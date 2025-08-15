const https = require('https');

const API_KEY = 'AVaeAAIjcDE4NTEyYWI0MDMxZjA0ZTE0YTRjNTk1MTAyOTM0NTdmOHAxMA';

// Use the correct Upstash Redis URL
const urlPatterns = [
  'https://holy-cod-22174.upstash.io',
];

async function testUpstashConnection(baseUrl) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/ping`;
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ success: true, status: res.statusCode, data: result });
        } catch (error) {
          resolve({ success: false, status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function testAllPatterns() {
  console.log('Testing Upstash Redis connection patterns...\n');
  
  for (const pattern of urlPatterns) {
    console.log(`Testing: ${pattern}`);
    const result = await testUpstashConnection(pattern);
    
    if (result.success) {
      console.log(`✅ SUCCESS! Status: ${result.status}, Response:`, result.data);
      console.log(`\n🎉 Found working Upstash Redis URL: ${pattern}`);
      return pattern;
    } else {
      console.log(`❌ Failed: ${result.error || result.data}`);
    }
    console.log('');
  }
  
  console.log('❌ No working Upstash Redis URL found');
  return null;
}

testAllPatterns().then((workingUrl) => {
  if (workingUrl) {
    console.log(`\nUse this URL in your .env file:`);
    console.log(`UPSTASH_REDIS_REST_URL=${workingUrl}`);
    console.log(`UPSTASH_REDIS_REST_TOKEN=${API_KEY}`);
  }
});
