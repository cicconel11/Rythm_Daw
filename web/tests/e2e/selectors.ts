// Central selectors for e2e tests
export const selectors = {
  // Landing page
  landing: {
    mainHeading: '[data-testid="landing-main-heading"]',
    features: '[data-testid="features"]',
    footer: '[data-testid="footer-links"]',
    getStartedBtn: '[data-testid="btn-get-started"]',
    loginBtn: '[data-testid="btn-login"]',
    navFeatures: '[data-testid="nav-features"]',
    navPricing: '[data-testid="nav-pricing"]',
    navDocs: '[data-testid="nav-docs"]',
    heroSection: 'section.hero',
    featuresSection: 'section#features',
    featureCards: '.feature-card',
    footerLinks: 'footer a',
  },

  // Registration
  register: {
    emailInput: '#email',
    passwordInput: '#password',
    confirmPasswordInput: '#confirmPassword',
    displayNameInput: '#displayName',
    bioInput: '#bio',
    avatarUrlInput: '#avatarUrl',
    submitBtn: 'button[type="submit"]',
    nextBtn: 'button:has-text("Continue to profile")',
    backBtn: 'button:has-text("Back")',
    loginLink: 'a:has-text("sign in to your existing account")',
    characterCount: '.text-xs.text-gray-500.text-right',
  },

  // Login
  login: {
    emailInput: 'label:has-text("Email") input',
    passwordInput: 'label:has-text("Password") input',
    loginBtn: 'button:has-text("Login")',
    registerLink: 'a:has-text("Don\'t have an account? Register")',
  },

  // Device/Plugin
  device: {
    connectCode: '[data-testid="connect-code"]',
    successBanner: '[data-testid="success-banner"]',
  },

  scan: {
    downloadLink: '[data-testid="download-link"]',
  },

  // Dashboard
  dashboard: {
    welcomeHeading: 'h1:has-text("Welcome back")',
    statCards: '[data-testid="stat-card"]',
    activityItems: '[data-testid="activity-item"]',
    projectItems: '[data-testid="project-item"]',
    recentActivityHeading: 'h2:has-text("Recent Activity")',
    recentProjectsHeading: 'h2:has-text("Recent Projects")',
  },

  // Files
  files: {
    uploadInput: '[data-testid="upload-input"]',
    fileTable: '[data-testid="file-table"]',
    downloadBtn: '[data-testid="download-btn"]',
    deleteBtn: '[data-testid="delete-btn"]',
  },

  // History
  history: {
    historyList: '[data-testid="history-list"]',
    emptyState: 'text=No history yet',
  },

  // Friends
  friends: {
    friendsPanel: '[data-testid="friends-panel"]',
    onlineBadge: '[data-testid="online-badge"]',
  },

  // Chat
  chat: {
    threadList: '[data-testid="thread-list"]',
    messageInput: '[data-testid="message-input"]',
    sendBtn: '[data-testid="send-btn"]',
    messages: '[data-testid="message"]',
  },

  // Settings
  settings: {
    settingsForm: '[data-testid="settings-form"]',
    saveBtn: '[data-testid="save-btn"]',
  },

  // Common
  common: {
    loadingSpinner: '[data-testid="loading-spinner"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',
    toast: '[data-sonner-toast]',
  },
};

// Test data
export const testData = {
  user: {
    email: `testuser+${Date.now()}@example.com`,
    password: 'TestPassword123!',
    displayName: 'Test User',
    bio: 'This is a test bio for the Rythm DAW platform. I love making music and collaborating with other artists.',
  },
  files: {
    testWav: 'test-files/test-audio.wav',
  },
};
