import { createMachine, interpret } from 'xstate';
import { registrationMachine } from '@/app/machines/registrationMachine';
import { emailSchema, codeSchema } from '@/app/lib/validation';

// Mock the validation functions
jest.mock('@/app/lib/validation', () => ({
  emailSchema: {
    safeParse: jest.fn(),
  },
  codeSchema: {
    safeParse: jest.fn(),
  },
}));

describe('registrationMachine', () => {
  let machine: ReturnType<typeof createMachine>;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh instance of the machine for each test
    machine = registrationMachine;
  });
  
  describe('initial state', () => {
    it('should start in the idle state', () => {
      const service = interpret(machine).start();
      expect(service.getSnapshot().value).toBe('idle');
      service.stop();
    });
  });
  
  describe('email submission', () => {
    it('should transition to codeEntry on valid email submission', () => {
      // Mock email validation to pass
      (emailSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      
      const service = interpret(machine).start();
      
      // Send START event to move from idle to emailEntry
      service.send('START');
      
      // Send SUBMIT_EMAIL event with valid email
      service.send({ type: 'SUBMIT_EMAIL', email: 'test@example.com' });
      
      expect(service.getSnapshot().value).toBe('codeEntry');
      expect(service.getSnapshot().context.email).toBe('test@example.com');
      
      service.stop();
    });
    
    it('should transition to error on invalid email', () => {
      // Mock email validation to fail
      (emailSchema.safeParse as jest.Mock).mockReturnValue({ 
        success: false,
        error: { message: 'Invalid email' } 
      });
      
      const service = interpret(machine).start();
      
      // Send START event to move from idle to emailEntry
      service.send('START');
      
      // Send SUBMIT_EMAIL event with invalid email
      service.send({ type: 'SUBMIT_EMAIL', email: 'invalid-email' });
      
      expect(service.getSnapshot().value).toBe('error');
      expect(service.getSnapshot().context.error).toBeDefined();
      
      service.stop();
    });
  });
  
  describe('code verification', () => {
    beforeEach(() => {
      // Start from the codeEntry state
      machine = registrationMachine.withContext({
        ...registrationMachine.context,
        email: 'test@example.com',
        requestId: 'test-request-id',
      });
    });
    
    it('should transition to profileEntry on valid code submission', () => {
      // Mock code validation to pass
      (codeSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      
      const service = interpret(machine).start('codeEntry');
      
      // Send SUBMIT_CODE event with valid code
      service.send({ type: 'SUBMIT_CODE', code: '123456' });
      
      expect(service.getSnapshot().value).toBe('profileEntry');
      expect(service.getSnapshot().context.code).toBe('123456');
      
      service.stop();
    });
    
    it('should transition to error on invalid code', () => {
      // Mock code validation to fail
      (codeSchema.safeParse as jest.Mock).mockReturnValue({ 
        success: false,
        error: { message: 'Invalid code' } 
      });
      
      const service = interpret(machine).start('codeEntry');
      
      // Send SUBMIT_CODE event with invalid code
      service.send({ type: 'SUBMIT_CODE', code: '123' });
      
      expect(service.getSnapshot().value).toBe('error');
      expect(service.getSnapshot().context.error).toBeDefined();
      
      service.stop();
    });
  });
  
  describe('profile submission', () => {
    beforeEach(() => {
      // Start from the profileEntry state with required context
      machine = registrationMachine.withContext({
        ...registrationMachine.context,
        email: 'test@example.com',
        requestId: 'test-request-id',
        code: '123456',
        token: 'test-token',
      });
    });
    
    it('should transition to submitting on valid profile data', () => {
      const service = interpret(machine).start('profileEntry');
      
      // Mock the completeRegistration service
      service.onTransition((state) => {
        if (state.matches('submitting')) {
          // Simulate successful registration
          service.send({ type: 'done.invoke.completeRegistration' });
        }
      });
      
      // Send SUBMIT_PROFILE event with valid data
      service.send({ 
        type: 'SUBMIT_PROFILE', 
        displayName: 'Test User', 
        password: 'SecurePass123!',
        avatarUrl: 'https://example.com/avatar.jpg'
      });
      
      // Should transition to success after submission
      expect(service.getSnapshot().value).toBe('success');
      
      service.stop();
    });
    
    it('should clear sensitive data on success', () => {
      const service = interpret(machine).start('profileEntry');
      
      // Mock the completeRegistration service
      service.onTransition((state) => {
        if (state.matches('submitting')) {
          // Simulate successful registration
          service.send({ type: 'done.invoke.completeRegistration' });
        }
      });
      
      // Send SUBMIT_PROFILE event with valid data
      service.send({ 
        type: 'SUBMIT_PROFILE', 
        displayName: 'Test User', 
        password: 'SecurePass123!',
        avatarUrl: 'https://example.com/avatar.jpg'
      });
      
      const finalContext = service.getSnapshot().context;
      expect(finalContext.password).toBeNull();
      expect(finalContext.token).toBeNull();
      
      service.stop();
    });
  });
  
  describe('error handling', () => {
    it('should reset to emailEntry on RESET event from error state', () => {
      // Start from error state
      const service = interpret(machine).start('error');
      
      // Send RESET event
      service.send('RESET');
      
      expect(service.getSnapshot().value).toBe('emailEntry');
      
      service.stop();
    });
  });
});
