// WebSocket test setup file
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme for React testing if needed
configure({ adapter: new Adapter() });

// Add any WebSocket-specific test setup here
beforeAll(() => {
  // Ensure we're using the real WebSocket implementation
  jest.unmock('ws');
  jest.resetModules();
});

afterAll(() => {
  // Clean up any resources if needed
});
