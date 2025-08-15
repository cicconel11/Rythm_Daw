const { UpstashRedisService } = require('../dist/common/upstash-redis.service');

async function testUpstashRest() {
  console.log('Testing Upstash Redis REST API...');
  
  // Set environment variables for testing
  process.env.UPSTASH_REDIS_REST_URL = 'https://your-upstash-redis-url.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = '7b9834ca-2d24-4b7e-9ddb-d65746fa6ef3';
  
  const service = new UpstashRedisService();
  
  try {
    // Test ping
    const pingResult = await service.ping();
    console.log('Ping result:', pingResult);
    
    if (pingResult) {
      // Test set/get
      const setResult = await service.set('test:key', 'test:value');
      console.log('Set result:', setResult);
      
      const getResult = await service.get('test:key');
      console.log('Get result:', getResult);
      
      // Test exists
      const existsResult = await service.exists('test:key');
      console.log('Exists result:', existsResult);
      
      // Clean up
      const delResult = await service.del('test:key');
      console.log('Delete result:', delResult);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUpstashRest();
