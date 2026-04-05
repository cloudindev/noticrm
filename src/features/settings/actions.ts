"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getS3Client, getPublicS3Url } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

export async function updateProfileAvatar(tenantSlug: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create unique file key: users/{userId}/avatar-{timestamp}.ext
    const extension = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const key = `users/${session.user.id}/avatar-${timestamp}.${extension}`;

    // Upload to S3
    const putCommand = new PutObjectCommand({
      Bucket: process.env['S3_BUCKET_NAME'] || 'principal-bucket-e10q',
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // For general public buckets, setting ACL to public-read is common if supported,
      // but 'Visibility Mapping' from the image says the bucket is public by default.
    });

    const s3 = getS3Client();
    await s3.send(putCommand);

    const publicUrl = getPublicS3Url(key);

    // Update the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    });

    revalidatePath(`/${tenantSlug}/settings/profile`);
    
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Error updating avatar:", error);
    return { error: error.message };
  }
}
