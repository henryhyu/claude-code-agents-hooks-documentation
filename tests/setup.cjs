// Jest setup file (CommonJS)
// Mock Mermaid library
global.mermaid = {
  initialize: jest.fn(),
  render: jest.fn(),
  init: jest.fn()
};

// Mock Prism library
global.Prism = {
  highlightAll: jest.fn(),
  highlight: jest.fn(),
  plugins: {}
};

// Mock navigator.clipboard for clipboard tests
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve(''))
  }
});

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock document.execCommand
global.document.execCommand = jest.fn(() => true);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Mock window properties
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0
});

Object.defineProperty(document.documentElement, 'scrollTop', {
  writable: true,
  value: 0
});

Object.defineProperty(document.body, 'scrollTop', {
  writable: true,
  value: 0
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  writable: true,
  value: 2000
});

Object.defineProperty(document.documentElement, 'clientHeight', {
  writable: true,
  value: 800
});

// Mock isSecureContext for clipboard testing
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true
});