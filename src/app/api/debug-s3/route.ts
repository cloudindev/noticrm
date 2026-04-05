import { NextResponse } from 'next/server';

export async function GET() {
  const internal = process.env['S3_INTERNAL_ENDPOINT'];
  const pbl = process.env['S3_PUBLIC_ENDPOINT'];
  const ak = process.env['S3_ACCESS_KEY'] || '';
  const sk = process.env['S3_SECRET_KEY'] || '';
  
  return NextResponse.json({
    hasInternal: !!internal,
    internalValue: internal,
    hasPublic: !!pbl,
    publicValue: pbl,
    accessKeyLength: ak.length,
    accessKeyFirstChars: ak.substring(0, 4),
    secretKeyLength: sk.length,
    secretKeyFirstChars: sk.substring(0, 4),
    bucket: process.env['S3_BUCKET_NAME'],
    region: process.env['S3_REGION'],
    nodeEnv: process.env.NODE_ENV,
    awsVarsStatus: {
      hasAwsAccess: !!process.env.AWS_ACCESS_KEY_ID,
      hasAwsSecret: !!process.env.AWS_SECRET_ACCESS_KEY
    }
  });
}
