# Deployment Guide

This comprehensive deployment guide covers all aspects of hosting and deploying the Claude Code Agents Hooks Documentation Guide, from local development servers to production-ready hosting solutions. Choose the deployment method that best fits your needs and technical requirements.

## Table of Contents

- [Quick Deployment](#quick-deployment)
- [Static Hosting Solutions](#static-hosting-solutions)
- [Advanced Deployment Options](#advanced-deployment-options)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## Quick Deployment

### Local Development Server

For immediate testing and development:

```bash
# Option 1: Python (most systems have this)
cd anthropic-style-github-page
python -m http.server 8000
# Visit: http://localhost:8000

# Option 2: Node.js http-server
npx http-server . -p 8080 -c-1
# Visit: http://localhost:8080

# Option 3: PHP (if available)
php -S localhost:8000
# Visit: http://localhost:8000

# Option 4: Live Server (auto-refresh)
npm install -g live-server
live-server . --port=8080
```

### File-Based Access

For the simplest testing method:
```bash
# Open directly in browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

**Note**: Some features (like clipboard API) require HTTPS and won't work with file:// protocol.

## Static Hosting Solutions

### GitHub Pages (Recommended for Open Source)

#### Setup Process
1. **Push code to GitHub repository**
   ```bash
   git remote add origin https://github.com/username/repo-name.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose branch: `main`
   - Choose folder: `/ (root)`
   - Click "Save"

3. **Access your site**
   - URL: `https://username.github.io/repo-name`
   - Custom domain supported via CNAME

#### GitHub Pages Configuration
```yaml
# .github/workflows/pages.yml (optional)
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

**Benefits**: Free, automatic HTTPS, version control integration
**Limitations**: Public repositories only (for free accounts)

### Netlify (Recommended for Simplicity)

#### Drag-and-Drop Deployment
1. **Prepare files**
   ```bash
   # Create deployment package
   zip -r site.zip . -x "node_modules/*" "tests/*" ".git/*"
   ```

2. **Deploy via Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag zip file to deployment area
   - Get instant URL: `https://random-name.netlify.app`

#### Git-Based Deployment
1. **Connect repository**
   - Link GitHub/GitLab repository
   - Set build command: (leave empty for static site)
   - Set publish directory: `/`

2. **Configure build settings**
   ```toml
   # netlify.toml
   [build]
     publish = "."
     command = "npm test"

   [build.environment]
     NODE_VERSION = "18"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
   ```

**Benefits**: Automatic deployments, branch previews, form handling, serverless functions
**Free Tier**: 100GB bandwidth, 300 build minutes per month

### Vercel (Recommended for Performance)

#### Deployment Process
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from command line**
   ```bash
   cd anthropic-style-github-page
   vercel --prod
   ```

3. **Configure deployment**
   ```json
   {
     "name": "anthropic-style-github-page",
     "version": 2,
     "builds": [
       {
         "src": "**/*",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "/$1" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-XSS-Protection", "value": "1; mode=block" }
         ]
       }
     ]
   }
   ```

**Benefits**: Global CDN, automatic HTTPS, excellent performance
**Free Tier**: 100GB bandwidth, 100 serverless function invocations per day

### AWS S3 + CloudFront

#### S3 Bucket Setup
1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure for static hosting**
   ```bash
   # Upload files
   aws s3 sync . s3://your-bucket-name --exclude "node_modules/*" --exclude ".git/*"

   # Enable static website hosting
   aws s3 website s3://your-bucket-name --index-document index.html --error-document error.html
   ```

3. **Set bucket policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

#### CloudFront Distribution
```json
{
  "DistributionConfig": {
    "Origins": [{
      "DomainName": "your-bucket-name.s3-website-us-east-1.amazonaws.com",
      "Id": "S3-your-bucket-name",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "OriginProtocolPolicy": "http-only"
      }
    }],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-your-bucket-name",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "TrustedSigners": { "Enabled": false, "Quantity": 0 }
    },
    "Enabled": true,
    "PriceClass": "PriceClass_All"
  }
}
```

**Benefits**: Full AWS ecosystem, scalable, fine-grained control
**Cost**: Pay-per-use pricing model

### Firebase Hosting

#### Setup Process
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize project**
   ```bash
   firebase init hosting
   # Select existing project or create new one
   # Set public directory to: . (current directory)
   # Configure as single-page app: No
   ```

3. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

4. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": ".",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**",
         "**/tests/**"
       ],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

**Benefits**: Google's global CDN, automatic HTTPS, integrates with Google services
**Free Tier**: 10GB storage, 10GB transfer per month

## Advanced Deployment Options

### Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ =404;
        }
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and Deploy
```bash
# Build image
docker build -t anthropic-docs .

# Run locally
docker run -p 8080:80 anthropic-docs

# Deploy to registry
docker tag anthropic-docs your-registry/anthropic-docs:latest
docker push your-registry/anthropic-docs:latest
```

### Kubernetes Deployment

#### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: anthropic-docs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: anthropic-docs
  template:
    metadata:
      labels:
        app: anthropic-docs
    spec:
      containers:
      - name: anthropic-docs
        image: your-registry/anthropic-docs:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: anthropic-docs-service
spec:
  selector:
    app: anthropic-docs
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

#### ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: anthropic-docs-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: anthropic-docs-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: anthropic-docs-service
            port:
              number: 80
```

## Performance Optimization

### CDN Configuration

#### Cloudflare Setup
1. **Add site to Cloudflare**
   - Update DNS to Cloudflare nameservers
   - Enable "Proxy" for your domain

2. **Optimize settings**
   ```javascript
   // Page Rules for performance
   {
     "url": "your-domain.com/*",
     "settings": {
       "cache_level": "cache_everything",
       "edge_cache_ttl": 86400,
       "browser_cache_ttl": 31536000
     }
   }
   ```

3. **Enable optimizations**
   - Auto Minify: HTML, CSS, JavaScript
   - Brotli compression
   - Polish (image optimization)
   - Rocket Loader for JavaScript

#### Cache Headers
```nginx
# Nginx cache configuration
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### Asset Optimization

#### Pre-deployment Script
```bash
#!/bin/bash
# optimize-assets.sh

echo "Optimizing assets for production..."

# Minify CSS (using cssnano)
npx cssnano styles.css styles.min.css

# Minify JavaScript (using terser)
npx terser scripts.js -c -m -o scripts.min.js

# Optimize images (if any)
# npx imagemin images/* --out-dir=images-optimized

# Update HTML to reference minified files
sed -i 's/styles.css/styles.min.css/g' index.html
sed -i 's/scripts.js/scripts.min.js/g' index.html

echo "Asset optimization complete!"
```

#### Performance Checklist
- [ ] **Minify CSS and JavaScript** for production
- [ ] **Optimize images** with appropriate formats
- [ ] **Enable gzip/brotli** compression
- [ ] **Set appropriate cache headers**
- [ ] **Use CDN** for external libraries
- [ ] **Enable HTTP/2** on server
- [ ] **Implement preloading** for critical resources

## Security Considerations

### HTTPS Configuration

#### Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Get certificate (for nginx)
sudo certbot --nginx -d your-domain.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

#### Comprehensive Security Headers
```nginx
# Strong security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self'" always;
```

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'sha256-...'; 
               style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; 
               img-src 'self' data:; 
               font-src 'self';
               connect-src 'self';
               frame-ancestors 'none';">
```

### Access Control

#### IP Whitelisting (if needed)
```nginx
# Restrict access to specific IPs
location / {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
    
    try_files $uri $uri/ =404;
}
```

#### Basic Authentication (for staging)
```nginx
# Password protect staging environment
location / {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    try_files $uri $uri/ =404;
}
```

## Monitoring and Maintenance

### Health Monitoring

#### Uptime Monitoring Script
```bash
#!/bin/bash
# health-check.sh

URL="https://your-domain.com"
EXPECTED_STATUS=200

# Check HTTP status
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $STATUS -eq $EXPECTED_STATUS ]; then
    echo "✅ Site is healthy (Status: $STATUS)"
    exit 0
else
    echo "❌ Site is down (Status: $STATUS)"
    # Send alert (email, Slack, etc.)
    exit 1
fi
```

#### Performance Monitoring
```javascript
// client-side performance tracking
window.addEventListener('load', function() {
    // Core Web Vitals
    const navigation = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    
    const metrics = {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstContentfulPaint: fcp ? fcp.startTime : null
    };
    
    console.log('Performance Metrics:', metrics);
    
    // Send to analytics if needed
    // analytics.track('page_performance', metrics);
});
```

### Automated Deployment

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Backup and Recovery

#### Automated Backups
```bash
#!/bin/bash
# backup-site.sh

BACKUP_DIR="/backups/site"
SITE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/site_backup_$DATE.tar.gz" -C "$SITE_DIR" .

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "site_backup_*.tar.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp "$BACKUP_DIR/site_backup_$DATE.tar.gz" s3://your-backup-bucket/
```

## Troubleshooting

### Common Deployment Issues

#### 1. **Files Not Loading**
**Problem**: Static assets return 404 errors

**Solutions**:
- Check file paths are correct in HTML
- Verify files are included in deployment package
- Check web server configuration for static file serving

```bash
# Debug file structure
find . -name "*.css" -o -name "*.js"
ls -la styles.css scripts.js
```

#### 2. **HTTPS Mixed Content Warnings**
**Problem**: HTTP resources loaded on HTTPS site

**Solutions**:
- Update all external links to HTTPS
- Use protocol-relative URLs: `//cdn.example.com/script.js`
- Load external libraries from HTTPS CDNs

```html
<!-- Bad: Mixed content -->
<script src="http://cdn.example.com/library.js"></script>

<!-- Good: HTTPS -->
<script src="https://cdn.example.com/library.js"></script>

<!-- Good: Protocol-relative -->
<script src="//cdn.example.com/library.js"></script>
```

#### 3. **JavaScript Features Not Working**
**Problem**: Interactive features fail after deployment

**Solutions**:
- Check browser console for errors
- Verify all JavaScript files are loading
- Test clipboard API requires HTTPS
- Check Content Security Policy restrictions

```bash
# Test JavaScript loading
curl -I https://your-domain.com/scripts.js

# Check CSP headers
curl -I https://your-domain.com | grep -i content-security-policy
```

#### 4. **Performance Issues**
**Problem**: Site loads slowly

**Solutions**:
- Enable compression (gzip/brotli)
- Set appropriate cache headers
- Use CDN for static assets
- Minify CSS and JavaScript

```nginx
# Enable compression
gzip on;
gzip_types text/plain text/css application/javascript application/json;

# Set cache headers
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Debug Tools

#### Browser Developer Tools
```javascript
// Check site performance
console.log('Performance timing:', performance.timing);
console.log('Navigation entries:', performance.getEntriesByType('navigation'));

// Test features individually
console.log('Search input:', document.getElementById('searchInput'));
console.log('Copy buttons:', document.querySelectorAll('.copy-button'));

// Monitor errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});
```

#### Server-Side Debugging
```bash
# Check server logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Test server response
curl -v https://your-domain.com
curl -H "Accept-Encoding: gzip" -v https://your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## CI/CD Integration

### Automated Testing Pipeline

#### Pre-deployment Checks
```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on: [push, pull_request]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Check code quality
        run: |
          # HTML validation
          npx html-validate index.html
          
          # CSS validation  
          npx stylelint styles.css
          
          # JavaScript linting
          npx eslint scripts.js
      
      - name: Performance audit
        run: |
          npm install -g lighthouse-ci
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Multi-Environment Deployment

#### Staging and Production
```yaml
# Deploy to staging on PR, production on merge
name: Multi-Environment Deploy

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  deploy-staging:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging environment..."
          # Deploy to staging URL
    
  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production  
        run: |
          echo "Deploying to production environment..."
          # Deploy to production URL
```

This deployment guide provides comprehensive coverage for hosting the Claude Code Agents Hooks Documentation Guide across various platforms and environments. Choose the deployment method that best fits your technical requirements, budget, and maintenance capabilities.