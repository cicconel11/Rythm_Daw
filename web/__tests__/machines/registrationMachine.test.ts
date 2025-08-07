import { renderHook, act } from '@testing-library/react';
import { useMachine } from '@xstate/react';
import { registrationMachine } from '../../src/machines/registrationMachine';
import { mockApiResponse } from '../utils/test-utils';

describe('registrationMachine', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Mock the fetch API
    global.fetch = jest.fn();
  });

  it('should start in the idle state', () => {
    const { result } = renderHook(() => useMachine(registrationMachine));
    expect(result.current[0].value).toBe('idle');
  });

  it('should transition to validating when credentials are submitted', () => {
    const { result } = renderHook(() => useMachine(registrationMachine));
    
    act(() => {
      result.current[1]({ 
        type: 'SUBMIT_CREDENTIALS', 
        email: 'test@example.com',
        password: 'Test123!',
        recaptchaToken: 'test-token'
      });
    });
    
    expect(result.current[0].value).toBe('validating');
  });

  it('should transition to profile after successful validation', async () => {
    // Mock the validation API response
    mockApiResponse('/api/auth/register/validate', { success: true });
    
    const { result } = renderHook(() => useMachine(registrationMachine));
    
    await act(async () => {
      result.current[1]({ 
        type: 'SUBMIT_CREDENTIALS', 
        email: 'test@example.com',
        password: 'Test123!',
        recaptchaToken: 'test-token'
      });
      
      // Wait for the validation to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current[0].value).toBe('profile');
  });

  it('should handle validation errors', async () => {
    // Mock a failed validation response
    mockApiResponse('/api/auth/register/validate', { 
      success: false, 
      message: 'Invalid email format' 
    }, 400);
    
    const { result } = renderHook(() => useMachine(registrationMachine));
    
    await act(async () => {
      result.current[1]({ 
        type: 'SUBMIT_CREDENTIALS', 
        email: 'invalid-email',
        password: 'Test123!',
        recaptchaToken: 'test-token'
      });
      
      // Wait for the validation to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current[0].value).toBe('credentials');
    expect(result.current[0].context.error).toBe('Invalid email format');
  });

  it('should transition to registering when profile is submitted', async () => {
    // Mock the registration API response
    mockApiResponse('/api/auth/register', { 
      success: true,
      userId: '123'
    });
    
    const { result } = renderHook(() => useMachine(registrationMachine, {
      state: 'profile',
      context: {
        credentials: {
          email: 'test@example.com',
          password: 'Test123!',
          recaptchaToken: 'test-token'
        },
        profile: {
          displayName: 'Test User'
        },
        error: null
      }
    }));
    
    await act(async () => {
      result.current[1]({ 
        type: 'SUBMIT_PROFILE',
        displayName: 'Test User'
      });
      
      // Wait for the registration to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current[0].value).toBe('complete');
  });

  it('should handle registration errors', async () => {
    // Mock a failed registration response
    mockApiResponse('/api/auth/register', { 
      success: false,
      message: 'Email already in use'
    }, 409);
    
    const { result } = renderHook(() => useMachine(registrationMachine, {
      state: 'profile',
      context: {
        credentials: {
          email: 'existing@example.com',
          password: 'Test123!',
          recaptchaToken: 'test-token'
        },
        profile: {
          displayName: 'Test User'
        },
        error: null
      }
    }));
    
    await act(async () => {
      result.current[1]({ 
        type: 'SUBMIT_PROFILE',
        displayName: 'Test User'
      });
      
      // Wait for the registration to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current[0].value).toBe('profile');
    expect(result.current[0].context.error).toBe('Email already in use');
  });

  it('should allow going back from profile to credentials', () => {
    const { result } = renderHook(() => useMachine(registrationMachine, {
      state: 'profile',
      context: {
        credentials: {
          email: 'test@example.com',
          password: 'Test123!',
          recaptchaToken: 'test-token'
        },
        profile: {
          displayName: 'Test User'
        },
        error: null
      }
    }));
    
    act(() => {
      result.current[1]({ type: 'BACK' });
    });
    
    expect(result.current[0].value).toBe('credentials');
  });
});
