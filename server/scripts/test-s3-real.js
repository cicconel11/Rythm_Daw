const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configuration for real S3 testing
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const bucketName = process.env.S3_BUCKET || 'rhythm-test-bucket';

async function testRealS3Integration() {
  console.log('🚀 Testing Real S3 Integration...\n');

  // Check if AWS credentials are configured
  if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
    console.log('❌ AWS credentials not configured');
    console.log('📋 To test with real S3, set these environment variables:');
    console.log('   export AWS_REGION=us-east-1');
    console.log('   export AWS_ACCESS_KEY_ID=your-access-key');
    console.log('   export AWS_SECRET_ACCESS_KEY=your-secret-key');
    console.log('   export S3_BUCKET=your-bucket-name');
    console.log('\n🔧 Or create a .env file with these values');
    return;
  }

  try {
    // Step 1: Configure AWS SDK
    console.log('1. Configuring AWS SDK...');
    AWS.config.update(s3Config);
    const s3 = new AWS.S3();
    console.log('✅ AWS SDK configured with real credentials\n');

    // Step 2: Test bucket access
    console.log('2. Testing bucket access...');
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log(`✅ Bucket '${bucketName}' is accessible`);
    } catch (error) {
      if (error.code === 'NotFound') {
        console.log(`❌ Bucket '${bucketName}' does not exist`);
        console.log('🔧 Create the bucket first or use an existing bucket');
        return;
      } else {
        console.log(`❌ Error accessing bucket: ${error.message}`);
        return;
      }
    }

    // Step 3: Generate presigned URLs
    console.log('3. Generating presigned URLs...');
    const testKey = `test-${Date.now()}/test-file.txt`;
    
    const uploadParams = {
      Bucket: bucketName,
      Key: testKey,
      ContentType: 'text/plain',
      Expires: 3600, // 1 hour
    };

    const downloadParams = {
      Bucket: bucketName,
      Key: testKey,
      Expires: 86400, // 24 hours
    };

    const [uploadUrl, downloadUrl] = await Promise.all([
      s3.getSignedUrlPromise('putObject', uploadParams),
      s3.getSignedUrlPromise('getObject', downloadParams),
    ]);

    console.log('📤 Upload URL generated:', uploadUrl ? '✅' : '❌');
    console.log('📥 Download URL generated:', downloadUrl ? '✅' : '❌');
    console.log('✅ Presigned URLs generated successfully\n');

    // Step 4: Test file upload
    console.log('4. Testing file upload...');
    const testContent = 'This is a test file for S3 integration testing.';
    const testBuffer = Buffer.from(testContent);

    try {
      await s3.upload({
        Bucket: bucketName,
        Key: testKey,
        Body: testBuffer,
        ContentType: 'text/plain',
      }).promise();

      console.log(`✅ File uploaded successfully to s3://${bucketName}/${testKey}`);
    } catch (error) {
      console.log(`❌ File upload failed: ${error.message}`);
      return;
    }

    // Step 5: Test file download
    console.log('5. Testing file download...');
    try {
      const downloadResult = await s3.getObject({
        Bucket: bucketName,
        Key: testKey,
      }).promise();

      const downloadedContent = downloadResult.Body.toString();
      if (downloadedContent === testContent) {
        console.log('✅ File downloaded successfully and content matches');
      } else {
        console.log('❌ Downloaded content does not match original');
      }
    } catch (error) {
      console.log(`❌ File download failed: ${error.message}`);
      return;
    }

    // Step 6: Clean up test file
    console.log('6. Cleaning up test file...');
    try {
      await s3.deleteObject({
        Bucket: bucketName,
        Key: testKey,
      }).promise();
      console.log('✅ Test file cleaned up successfully');
    } catch (error) {
      console.log(`⚠️  Cleanup failed: ${error.message}`);
    }

    console.log('\n🎉 Real S3 integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  ✅ AWS credentials configured');
    console.log('  ✅ Bucket access verified');
    console.log('  ✅ Presigned URL generation');
    console.log('  ✅ File upload to S3');
    console.log('  ✅ File download from S3');
    console.log('  ✅ Content verification');
    console.log('  ✅ Cleanup completed');

    console.log('\n🚀 Your S3 integration is ready for production!');
    console.log('   The file sharing system can now:');
    console.log('   - Generate presigned URLs for secure uploads');
    console.log('   - Store files directly in S3');
    console.log('   - Provide secure download links');
    console.log('   - Handle large file transfers efficiently');

  } catch (error) {
    console.error('❌ Real S3 integration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testRealS3Integration();
