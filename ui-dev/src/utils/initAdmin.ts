export const initializeFirstAdmin = () => {
  // Check if we already have users
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (existingUsers.length === 0) {
    // Create first admin user
    const adminUser = {
      id: 'admin-' + Date.now(),
      email: 'admin@example.com',
      displayName: 'Admin',
      isApproved: true,
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify([adminUser]));
    
    // Also log them in
    const authState = {
      user: adminUser,
      token: 'admin-jwt-token',
      isAuthenticated: true,
      isApproved: true
    };
    
    localStorage.setItem('auth', JSON.stringify(authState));
    
    return {
      email: adminUser.email,
      password: 'admin123' // This is just for demo purposes
    };
  }
  
  return null; // No admin created
};
