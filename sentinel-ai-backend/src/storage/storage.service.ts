import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: AWS.S3;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const config: AWS.S3.ClientConfiguration = {
      region: configService.get<string>('storage.region', 'us-east-1'),
      accessKeyId: configService.get<string>('storage.accessKeyId'),
      secretAccessKey: configService.get<string>('storage.secretAccessKey'),
    };

    const endpoint = configService.get<string>('storage.endpoint');
    if (endpoint) {
      config.endpoint = endpoint;
      config.s3ForcePathStyle = true;
    }

    this.s3 = new AWS.S3(config);
    this.bucket = configService.get<string>('storage.bucket', 'sentinel-ai-uploads');
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'uploads',
  ): Promise<{ key: string; url: string }> {
    const ext = path.extname(originalName);
    const key = `${folder}/${uuidv4()}${ext}`;

    try {
      await this.s3
        .putObject({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          ServerSideEncryption: 'AES256',
        })
        .promise();

      const url = this.getFileUrl(key);
      return { key, url };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({ Bucket: this.bucket, Key: key })
        .promise();
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}: ${error.message}`);
    }
  }

  getFileUrl(key: string): string {
    const endpoint = this.configService.get<string>('storage.endpoint');
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.configService.get('storage.region', 'us-east-1')}.amazonaws.com/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }
}
