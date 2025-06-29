// Mock Service Worker server setup for testing
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server with our request handlers
export const server = setupServer(...handlers);

// Enable request interception
export const setupMSW = () => {
  // Enable request interception
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    });
  });

  // Reset handlers between tests
  afterEach(() => {
    server.resetHandlers();
  });

  // Disable request interception after tests
  afterAll(() => {
    server.close();
  });
};

export default server;
