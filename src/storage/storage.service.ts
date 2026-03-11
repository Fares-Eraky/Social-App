import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from '../config/s3.config';
import { UploadResult, PresignedUrlOptions } from './storage.types';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  async uploadFile(file: Buffer, key: string, contentType: string): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return {
      key,
      location: `https://${S3_BUCKET}.s3.amazonaws.com/${key}`,
    };
  }

  async uploadLargeFile(file: Buffer, key: string): Promise<UploadResult> {
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    const { UploadId } = await s3Client.send(createCommand);

    const partSize = 5 * 1024 * 1024;
    const parts = [];
    let partNumber = 1;

    for (let start = 0; start < file.length; start += partSize) {
      const end = Math.min(start + partSize, file.length);
      const partBuffer = file.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: S3_BUCKET,
        Key: key,
        UploadId,
        PartNumber: partNumber,
        Body: partBuffer,
      });

      const { ETag } = await s3Client.send(uploadPartCommand);
      parts.push({ ETag, PartNumber: partNumber });
      partNumber++;
    }

    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: S3_BUCKET,
      Key: key,
      UploadId,
      MultipartUpload: { Parts: parts },
    });

    await s3Client.send(completeCommand);

    return {
      key,
      location: `https://${S3_BUCKET}.s3.amazonaws.com/${key}`,
    };
  }

  async generatePresignedUrl(
    key: string,
    operation: 'read' | 'write',
    options: PresignedUrlOptions = {}
  ): Promise<string> {
    const expiresIn = options.expiresIn || 3600;

    let command;
    if (operation === 'read') {
      command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
    } else {
      command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
    }

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const command = new DeleteObjectsCommand({
      Bucket: S3_BUCKET,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    await s3Client.send(command);
  }

  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);
    return response.Body as Readable;
  }

  generateUniqueKey(folder: string, filename: string): string {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const extension = filename.split('.').pop();
    return `${folder}/${timestamp}-${uniqueId}.${extension}`;
  }
}
