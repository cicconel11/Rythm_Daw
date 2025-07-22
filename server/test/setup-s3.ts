import { S3Client, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

const { AWS_REGION, S3_BUCKET_NAME } = process.env;
if (!AWS_REGION || !S3_BUCKET_NAME) {
  throw new Error("Missing AWS_REGION or S3_BUCKET_NAME env vars");
}

export async function ensureTestBucket() {
  const s3 = new S3Client({ region: AWS_REGION });
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }));
    console.log(`[setup-s3] Bucket ${S3_BUCKET_NAME} already exists`);
  } catch {
    console.log(`[setup-s3] Creating bucket ${S3_BUCKET_NAME}`);
    await s3.send(
      new CreateBucketCommand(
        AWS_REGION === "us-east-1"
          ? { Bucket: S3_BUCKET_NAME }
          : {
              Bucket: S3_BUCKET_NAME,
              CreateBucketConfiguration: { LocationConstraint: AWS_REGION },
            },
      ),
    );
  }
} 