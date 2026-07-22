import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { usage: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, mfaSecret, passwordResetToken, emailVerifyToken, ...safe } = user as any;
    return safe;
  }

  async updateProfile(id: string, data: { name?: string; avatar?: string }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash, mfaSecret, passwordResetToken, emailVerifyToken, ...safe } = user as any;
    return safe;
  }
}
