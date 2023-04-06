async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen({ onUnhandledRequest: 'warn' });
  }
}

initMocks();

export {};
