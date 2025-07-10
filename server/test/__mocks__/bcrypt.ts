// Mock implementation of bcrypt for testing
export const hash = jest.fn().mockImplementation((password: string) => {
  return Promise.resolve(`hashed_${password}`);
});

export const compare = jest.fn().mockImplementation((password: string, hashedPassword: string) => {
  return Promise.resolve(hashedPassword === `hashed_${password}`);
});

export const genSalt = jest.fn().mockResolvedValue('mock_salt');

// Default export for commonjs compatibility
const bcrypt = {
  hash,
  compare,
  genSalt,
};

export default bcrypt;
