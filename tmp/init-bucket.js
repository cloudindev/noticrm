const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_INTERNAL_ENDPOINT || process.env.S3_PUBLIC_ENDPOINT || 'https://s3.oladc.com',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function createFolder() {
  const bucketName = process.env.S3_BUCKET_NAME;
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: 'users/.keep',
      Body: '',
    });
    
    await s3.send(command);
    console.log(`Successfully created users/ folder in the ${bucketName} bucket.`);
  } catch (error) {
    console.error('Error creating folder:', error);
  }
}

createFolder();
