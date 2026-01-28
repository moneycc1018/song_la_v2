export function generateCSPHeader(nonce: string, isDev: boolean) {
  if (isDev) {
    return `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com/;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self';
      connect-src 'self';
      frame-src 'self' https://www.youtube.com/;
      frame-ancestors 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.youtube.com/;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self';
    connect-src 'self';
    frame-src 'self' https://www.youtube.com/;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}
