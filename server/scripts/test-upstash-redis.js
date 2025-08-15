const Redis = require('ioredis');

async function testUpstashRedis() {
  console.log('Testing Upstash Redis connection...');
  
  const redis = new Redis({
    host: 'upstash-redis-rythm-daw.upstash.io',
    port: 443,
    password: '7b9834ca-2d24-4b7e-9ddb-d65746fa6ef3',
    tls: {
      rejectUnauthorized: false
    },
    lazyConnect: false,
  });

  try {
    // Test connection
    await redis.ping();
    console.log('✅ Redis connection successful!');
    
    // Test basic operations
    await redis.set('test:key', 'test:value');
    const value = await redis.get('test:key');
    console.log('✅ Redis get/set test:', value);
    
    // Clean up
    await redis.del('test:key');
    console.log('✅ Redis cleanup successful!');
    
    await redis.quit();
    console.log('✅ Redis connection closed!');
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    await redis.quit();
  }
}

testUpstashRedis();
