const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    });
    
    console.log('Registration successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

testRegistration();
