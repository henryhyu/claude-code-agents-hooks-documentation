// Simple test to verify the setup works
import { detectLanguage, escapeRegExp } from '../scripts-testable.js';

// Create mock HTML structure
const createMockHTML = () => {
  document.body.innerHTML = `
    <div class="reading-progress">
      <div class="reading-progress-bar" id="progressBar"></div>
    </div>
    
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
          
          <pre><code>function test() {
  console.log("Testing");
}</code></pre>
        </div>
      </div>
    </main>
    
    <button id="backToTop" class="back-to-top" title="Back to top">↑</button>
  `;
};

describe('Basic Functionality Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    createMockHTML();
    jest.clearAllMocks();
  });

  describe('Language Detection', () => {
    test('should detect bash language', () => {
      expect(detectLanguage('#!/bin/bash\necho "Hello"')).toBe('bash');
      expect(detectLanguage('echo "test"')).toBe('bash');
      expect(detectLanguage('mkdir folder')).toBe('bash');
      expect(detectLanguage('cd /home/user')).toBe('bash');
      expect(detectLanguage('ls -la')).toBe('bash');
      expect(detectLanguage('git status')).toBe('bash');
      expect(detectLanguage('claude --help')).toBe('bash');
    });

    test('should detect JSON language', () => {
      expect(detectLanguage('{"hooks": {"PreToolUse": []}}')).toBe('json');
      expect(detectLanguage('{"matcher": "Edit|Write"}')).toBe('json');
    });

    test('should detect Markdown language', () => {
      expect(detectLanguage('---\nname: "test"\ndescription: "test"')).toBe('markdown');
      expect(detectLanguage('description: test')).toBe('markdown');
    });

    test('should detect JavaScript language', () => {
      expect(detectLanguage('function test() {}')).toBe('javascript');
      expect(detectLanguage('const variable = 5;')).toBe('javascript');
      expect(detectLanguage('let item = "test";')).toBe('javascript');
    });

    test('should detect Python language', () => {
      expect(detectLanguage('def test():\n    pass')).toBe('python');
      expect(detectLanguage('import os')).toBe('python');
      expect(detectLanguage('python script.py')).toBe('python');
    });

    test('should default to bash for unknown languages', () => {
      expect(detectLanguage('unknown code content')).toBe('bash');
      expect(detectLanguage('')).toBe('bash');
      expect(detectLanguage(null)).toBe('bash');
      expect(detectLanguage(undefined)).toBe('bash');
    });
  });

  describe('Utility Functions', () => {
    test('should escape regex characters properly', () => {
      expect(escapeRegExp('test.with+special*chars?')).toBe('test\\.with\\+special\\*chars\\?');
      expect(escapeRegExp('normal text')).toBe('normal text');
      expect(escapeRegExp('')).toBe('');
      expect(escapeRegExp('(parentheses)')).toBe('\\(parentheses\\)');
      expect(escapeRegExp('[brackets]')).toBe('\\[brackets\\]');
      expect(escapeRegExp('{braces}')).toBe('\\{braces\\}');
    });
  });

  describe('DOM Elements', () => {
    test('should find required elements in DOM', () => {
      const progressBar = document.getElementById('progressBar');
      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('searchResults');
      const backToTop = document.getElementById('backToTop');
      
      expect(progressBar).toBeTruthy();
      expect(searchInput).toBeTruthy();
      expect(searchResults).toBeTruthy();
      expect(backToTop).toBeTruthy();
    });

    test('should have proper element structure', () => {
      const mainContent = document.querySelector('.main-content');
      expect(mainContent).toBeTruthy();
      
      const codeBlocks = document.querySelectorAll('pre code');
      expect(codeBlocks.length).toBe(1);
      
      const headings = document.querySelectorAll('h2[id]');
      expect(headings.length).toBe(1);
    });
  });

  describe('Basic Mocks', () => {
    test('should have mocked external libraries', () => {
      expect(global.mermaid).toBeDefined();
      expect(global.Prism).toBeDefined();
      expect(global.mermaid.initialize).toBeDefined();
      expect(global.Prism.highlightAll).toBeDefined();
    });

    test('should have mocked browser APIs', () => {
      expect(global.scrollTo).toBeDefined();
      expect(navigator.clipboard).toBeDefined();
      expect(navigator.clipboard.writeText).toBeDefined();
      expect(document.execCommand).toBeDefined();
    });
  });
});