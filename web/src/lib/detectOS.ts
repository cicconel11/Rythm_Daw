export const detectOS = (ua = navigator.userAgent) =>
  /Macintosh|Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : 'Other';
