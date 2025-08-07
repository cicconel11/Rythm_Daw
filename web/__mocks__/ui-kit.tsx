import React from 'react';

// Mock for RegisterCredentials component
export const RegisterCredentials = ({
  onContinue,
  error,
}: {
  onContinue: (email: string, password: string) => void;
  error?: string;
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    onContinue(email, password);
  };

  return (
    <div data-testid="register-credentials">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-testid="confirm-password-input"
          />
        </div>
        {error && <div data-testid="error-message">{error}</div>}
        <button type="submit" data-testid="continue-button">
          Continue
        </button>
      </form>
    </div>
  );
};

// Mock for RegisterBio component
export const RegisterBio = ({
  onSuccess,
  onNavigate,
  error,
}: {
  onSuccess: (displayName: string, avatar?: string) => void;
  onNavigate: (path: string) => void;
  error?: string;
}) => {
  const [displayName, setDisplayName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(displayName);
  };

  return (
    <div data-testid="register-bio">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            data-testid="display-name-input"
          />
        </div>
        {error && <div data-testid="error-message">{error}</div>}
        <button type="button" onClick={() => onNavigate('/')} data-testid="back-button">
          Back
        </button>
        <button type="submit" data-testid="submit-button">
          Create Account
        </button>
      </form>
    </div>
  );
};
