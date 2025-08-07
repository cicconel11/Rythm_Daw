import React, { forwardRef, useEffect } from 'react';

const ReCAPTCHA = forwardRef(({ sitekey, onChange, size }, ref) => {
  // Mock the reCAPTCHA execution
  React.useImperativeHandle(ref, () => ({
    executeAsync: () => Promise.resolve('test-recaptcha-token'),
    reset: () => {},
    getValue: () => 'test-recaptcha-token',
  }));

  // Call onChange with the test token when component mounts
  useEffect(() => {
    if (onChange) {
      onChange('test-recaptcha-token');
    }
  }, [onChange]);

  return (
    <div 
      data-testid="mock-recaptcha" 
      data-sitekey={sitekey}
      data-size={size}
    />
  );
});

ReCAPTCHA.displayName = 'ReCAPTCHA';

export default ReCAPTCHA;
