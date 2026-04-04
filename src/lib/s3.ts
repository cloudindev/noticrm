import { S3Client } from '@aws-sdk/client-s3';

// Initialize the S3 Client globally
export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'eu-west-1',
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true, // Required for MinIO / OLA Cloud
});

// Helper to construct the public URL based on the bucket and key
export function getPublicS3Url(key: string): string {
  const endpoint = process.env.S3_ENDPOINT_URL || 'https://s3.oladc.com';
  const bucketName = process.env.S3_BUCKET_NAME || 'principal-bucket';
  
  // Clean trailing slashes from endpoint
  const cleanEndpoint = endpoint.replace(/\/$/, '');
  
  return `${cleanEndpoint}/${bucketName}/${key}`;
}
