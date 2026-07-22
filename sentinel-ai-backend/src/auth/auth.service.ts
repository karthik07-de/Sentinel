import { Injectable, BadRequestException, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

const AuditAction = { LOGIN: 'LOGIN', LOGOUT: 'LOGOUT', REGISTER: 'REGISTER', PASSWORD_CHANGE: 'PASSWORD_CHANGE', MFA_ENABLE: 'MFA_ENABLE', MFA_DISABLE: 'MFA_DISABLE' };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ============================================================
  // REGISTER
  // ============================================================
  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await argon2.hash(dto.password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        cyberScore: 50,
        usage: {
          create: {
            urlScansToday: 0,
            emailScansToday: 0,
            totalScans: 0,
            threatsBlocked: 0,
          },
        },
      },
    });

    // Seed default achievements tracking
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: AuditAction.REGISTER,
        ipAddress,
        userAgent,
        success: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.plan);
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent);

    this.logger.log(`New user registered: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // ============================================================
  // LOGIN
  // ============================================================
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        deletedAt: null,
      },
    });

    if (!user || !user.passwordHash) {
      // Constant-time comparison to prevent timing attacks
      await argon2.hash('dummy-password-to-prevent-timing-attack');
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is suspended. Please contact support.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);

    if (!isPasswordValid) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.LOGIN,
          ipAddress,
          userAgent,
          success: false,
          errorMsg: 'Invalid password',
        },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last active
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: AuditAction.LOGIN,
        ipAddress,
        userAgent,
        success: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.plan);
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // ============================================================
  // LOGOUT
  // ============================================================
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash },
        data: { isRevoked: true },
      });
    } else {
      // Revoke all refresh tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }

    await this.prisma.auditLog.create({
      data: { userId, action: AuditAction.LOGOUT, success: true },
    });

    return { message: 'Logged out successfully' };
  }

  // ============================================================
  // REFRESH TOKEN
  // ============================================================
  async refreshTokens(userId: string, refreshToken: string, ipAddress?: string, userAgent?: string) {
    const tokenHash = this.hashToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      // Possible refresh token reuse attack — revoke all tokens
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.plan);
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent);

    return tokens;
  }

  // ============================================================
  // PASSWORD RESET
  // ============================================================
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: this.hashToken(resetToken),
        passwordResetExpiry: resetExpiry,
      },
    });

    // In production: send email with resetToken
    this.logger.log(`Password reset requested for: ${email} (token: ${resetToken})`);

    return { message: 'If an account exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiry: { gt: new Date() },
        deletedAt: null,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(newPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Revoke all sessions
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    await this.prisma.auditLog.create({
      data: { userId: user.id, action: AuditAction.PASSWORD_CHANGE, success: true },
    });

    return { message: 'Password reset successfully' };
  }

  // ============================================================
  // MFA
  // ============================================================
  async setupMfa(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'Sentinel AI', secret);
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    // Temporarily store secret (not enabled until verified)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    return { secret, qrCodeDataUrl, otpauthUrl };
  }

  async enableMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA setup not initiated');

    const isValid = authenticator.check(code, user.mfaSecret);
    if (!isValid) throw new BadRequestException('Invalid MFA code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: true },
    });

    await this.prisma.auditLog.create({
      data: { userId, action: AuditAction.MFA_ENABLE, success: true },
    });

    return { message: 'MFA enabled successfully' };
  }

  async disableMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA is not enabled');

    const isValid = authenticator.check(code, user.mfaSecret);
    if (!isValid) throw new BadRequestException('Invalid MFA code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { isMfaEnabled: false, mfaSecret: null },
    });

    await this.prisma.auditLog.create({
      data: { userId, action: AuditAction.MFA_DISABLE, success: true },
    });

    return { message: 'MFA disabled successfully' };
  }

  async verifyMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret || !user.isMfaEnabled) {
      throw new BadRequestException('MFA is not enabled');
    }

    const isValid = authenticator.check(code, user.mfaSecret);
    if (!isValid) throw new UnauthorizedException('Invalid MFA code');

    return { valid: true };
  }

  // ============================================================
  // GET PROFILE
  // ============================================================
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        usage: true,
        achievements: {
          include: { achievement: true },
        },
        subscription: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const allAchievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
    });

    const unlockedIds = new Set(user.achievements.map((ua) => ua.achievementId));

    const achievements = allAchievements.map((ach) => {
      const unlocked = user.achievements.find((ua) => ua.achievementId === ach.id);
      return {
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        locked: !unlockedIds.has(ach.id),
        unlockedAt: unlocked?.unlockedAt || null,
      };
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan.toLowerCase(),
      cyberScore: user.cyberScore,
      joinedAt: user.createdAt,
      emailVerified: user.emailVerified,
      isMfaEnabled: user.isMfaEnabled,
      stats: {
        totalScans: user.usage?.totalScans || 0,
        threatsBlocked: user.usage?.threatsBlocked || 0,
        urlsScanned: user.usage?.urlsScanned || 0,
        emailsAnalyzed: user.usage?.emailsAnalyzed || 0,
        imagesScanned: user.usage?.imagesTotal || 0,
        qrCodesScanned: user.usage?.qrCodesScanned || 0,
        streak: user.streak || 0,
        lastScan: user.lastScanAt,
      },
      achievements,
    };
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private async generateTokens(userId: string, email: string, role: any, plan: any) {
    const payload = { sub: userId, email, role, plan };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: userId, tokenId: uuidv4() },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, ipAddress, userAgent, expiresAt },
    });

    // Clean up old expired/revoked tokens
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [{ isRevoked: true }, { expiresAt: { lt: new Date() } }],
      },
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private sanitizeUser(user: any) {
    const { passwordHash, mfaSecret, passwordResetToken, emailVerifyToken, ...safe } = user;
    return safe;
  }
}
