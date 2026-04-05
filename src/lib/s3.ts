import { S3Client } from '@aws-sdk/client-s3';

// Helper to get the S3 Client globally but dynamically (prevents Next.js build-time caching of process.env)
export function getS3Client() {
  const internal = process.env['S3_INTERNAL_ENDPOINT'];
  const pbl = process.env['S3_PUBLIC_ENDPOINT'];
  return new S3Client({
    region: process.env['S3_REGION'] || 'us-east-1',
    endpoint: internal || pbl || 'https://s3.oladc.com',
    credentials: {
      accessKeyId: process.env['S3_ACCESS_KEY'] || '',
      secretAccessKey: process.env['S3_SECRET_KEY'] || '',
    },
    forcePathStyle: true, // Required for MinIO / OLA Cloud
  });
}

// Helper to construct the public URL based on the bucket and key
export function getPublicS3Url(key: string): string {
  const endpoint = process.env['S3_PUBLIC_ENDPOINT'] || 'https://s3.oladc.com';
  const bucketName = process.env['S3_BUCKET_NAME'] || 'principal-bucket-e10q';
  
  // Clean trailing slashes from endpoint
  const cleanEndpoint = endpoint.replace(/\/$/, '');
  
  return `${cleanEndpoint}/${bucketName}/${key}`;
}
