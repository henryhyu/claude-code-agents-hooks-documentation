// Jest setup file
const { jest } = globalThis;

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

// Setup DOM environment helpers
export const createMockElement = (tag, attributes = {}, textContent = '') => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

export const createMockHTML = () => {
  document.body.innerHTML = `
    <div class="reading-progress">
      <div class="reading-progress-bar" id="progressBar"></div>
    </div>
    
    <header>
      <h1>Test Document</h1>
    </header>
    
    <main>
      <div class="content-wrapper">
        <aside class="sidebar">
          <div class="search-container">
            <input type="text" class="search-box" placeholder="Search..." id="searchInput">
            <div class="search-results" id="searchResults"></div>
          </div>
        </aside>
        
        <div class="main-content">
          <h2 id="section1">Section 1</h2>
          <p>This is some content for testing search functionality.</p>
          
          <h3 id="subsection">Subsection</h3>
          <p>More content with <code>code snippets</code> for testing.</p>
          
          <pre><code>function test() {
  console.log("Testing");
}</code></pre>
          
          <pre><code>#!/bin/bash
echo "Testing bash detection"</code></pre>
        </div>
      </div>
    </main>
    
    <button id="backToTop" class="back-to-top" title="Back to top">↑</button>
    
    <footer>
      <p>Test footer</p>
    </footer>
  `;
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