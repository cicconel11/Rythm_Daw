import { S3Client, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

export async function ensureTestBucket() {
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) throw new Error("S3_BUCKET_NAME env-var not set");

  const s3 = new S3Client({ region });

  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket })); // exists ✔︎
  } catch (err: unknown) {
    if (err.$metadata?.httpStatusCode === 404) {
      // us-east-1 MUST omit LocationConstraint
      const params =
        region === "us-east-1"
          ? { Bucket: bucket }
          : { Bucket: bucket, CreateBucketConfiguration: { LocationConstraint: region } };

      await s3.send(new CreateBucketCommand(params));
      console.log(`Created test bucket ${bucket} in ${region}`);
    } else {
      throw err; // permission or networking error
    }
  }
} 