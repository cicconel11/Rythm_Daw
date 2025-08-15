const { UpstashRedisService } = require('../src/common/upstash-redis.service');

async function testUpstashService() {
  console.log('Testing UpstashRedisService...');
  
  // Set environment variables
  process.env.UPSTASH_REDIS_REST_URL = 'https://holy-cod-22174.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'AVaeAAIjcDE4NTEyYWI0MDMxZjA0ZTE0YTRjNTk1MTAyOTM0NTdmOHAxMA';
  
  const service = new UpstashRedisService();
  
  try {
    // Test ping
    console.log('Testing ping...');
    const pingResult = await service.ping();
    console.log('Ping result:', pingResult);
    
    if (pingResult) {
      // Test set/get
      console.log('Testing set/get...');
      const setResult = await service.set('test:rythm:key', 'test:rythm:value');
      console.log('Set result:', setResult);
      
      const getResult = await service.get('test:rythm:key');
      console.log('Get result:', getResult);
      
      // Test exists
      console.log('Testing exists...');
      const existsResult = await service.exists('test:rythm:key');
      console.log('Exists result:', existsResult);
      
      // Clean up
      console.log('Cleaning up...');
      const delResult = await service.del('test:rythm:key');
      console.log('Delete result:', delResult);
      
      console.log('✅ All Upstash Redis operations successful!');
    } else {
      console.log('❌ Ping failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUpstashService();
