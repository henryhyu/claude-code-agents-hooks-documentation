// Test utilities for DOM testing

export const fireEvent = {
  click: (element) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  input: (element, value) => {
    element.value = value;
    const event = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  scroll: (scrollY = 0) => {
    window.pageYOffset = scrollY;
    document.documentElement.scrollTop = scrollY;
    document.body.scrollTop = scrollY;
    
    const event = new Event('scroll');
    window.dispatchEvent(event);
  }
};

export const waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 10);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    check();
  });
};

export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

export const createCodeBlock = (code, language = '') => {
  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');
  
  if (language) {
    codeElement.className = `language-${language}`;
    pre.className = `language-${language}`;
  }
  
  codeElement.textContent = code;
  pre.appendChild(codeElement);
  
  return pre;
};

export const simulateKeypress = (element, key, keyCode) => {
  const event = new KeyboardEvent('keydown', {
    key,
    keyCode,
    which: keyCode,
    bubbles: true
  });
  element.dispatchEvent(event);
};

export const mockScrollProperties = (scrollY, documentHeight, clientHeight) => {
  window.pageYOffset = scrollY;
  document.documentElement.scrollTop = scrollY;
  document.body.scrollTop = scrollY;
  document.documentElement.scrollHeight = documentHeight;
  document.documentElement.clientHeight = clientHeight;
};