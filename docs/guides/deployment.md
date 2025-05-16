# Deployment Guide

This guide provides detailed instructions for deploying the Kobe Scraper UI to production environments. It covers different deployment options, environment configuration, and best practices for reliable performance.

## Deployment Options

### 1. Netlify Deployment (Recommended)

The application is pre-configured for seamless deployment to Netlify:

1. **Connect Repository**:
   - Log in to Netlify
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Select the kobe-scraper-ui repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Advanced build settings:
     - Set environment variables (see Environment Variables section)

3. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - A preview URL will be provided once deployment is complete

4. **Configure Custom Domain** (Optional):
   - Go to "Site settings" > "Domain management"
   - Add your custom domain
   - Follow Netlify's instructions to configure DNS

### 2. Vercel Deployment

1. **Connect Repository**:
   - Log in to Vercel
   - Click "New Project"
   - Import your GitHub repository
   - Select the kobe-scraper-ui repository

2. **Configure Project**:
   - Framework Preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Add required environment variables

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

### 3. Docker Deployment

The application includes a Dockerfile for containerized deployment:

1. **Build Docker Image**:
   ```bash
   docker build -t kobe-scraper-ui:latest .
   ```

2. **Run Container**:
   ```bash
   docker run -p 80:80 -e VITE_API_BASE_URL=https://your-api-url.com kobe-scraper-ui:latest
   ```

3. **Docker Compose** (Optional):
   - Use the provided `docker-compose.yml` for orchestrating multiple services
   - Run with `docker-compose up -d`

### 4. Manual Deployment

For traditional web servers like Nginx or Apache:

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Copy Files**:
   - Copy the contents of the `dist` directory to your web server's root

3. **Configure Web Server**:
   - Set up URL rewriting for SPA support
   - Example Nginx configuration:
     ```nginx
     server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       
       location / {
         try_files $uri $uri/ /index.html;
       }
       
       # API proxy configuration
       location /api {
         proxy_pass https://your-api-url.com;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
       }
     }
     ```

## Environment Variables

Configure these environment variables for your deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `https://api.example.com` |
| `VITE_USE_MOCK_DATA` | Whether to use mock data (for testing) | `false` |
| `VITE_ENABLE_ANALYTICS` | Enable usage analytics | `true` |
| `VITE_LOG_LEVEL` | Logging verbosity | `error` |
| `VITE_ENABLE_PREFETCH` | Enable data prefetching | `true` |

## CI/CD Pipeline

The repository includes GitHub Actions workflows for continuous integration and deployment:

### Automated Workflow

1. **Pull Request Checks**:
   - Linting
   - Type checking
   - Unit tests
   - Accessibility tests

2. **Staging Deployment**:
   - Automatically deploys development branch to staging
   - Bundle analysis and performance reports
   - Cross-browser testing

3. **Production Deployment**:
   - Requires manual approval
   - Deploys main branch to production
   - Post-deployment verification checks

### Customizing the Pipeline

1. Edit `.github/workflows/ci-cd.yml` to customize the CI/CD pipeline
2. Configure secrets in your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_STAGING_SITE_ID`
   - `NETLIFY_PRODUCTION_SITE_ID`

## Performance Optimization

### Bundle Optimization

The build process automatically optimizes the bundle:

1. **Code Splitting**:
   - Routes are split into separate chunks
   - Vendor dependencies are isolated

2. **Asset Optimization**:
   - Images are compressed
   - CSS is minified
   - JavaScript is optimized with tree-shaking

3. **Bundle Analysis**:
   - Run `npm run build:analyze` to generate bundle visualization
   - Identify large dependencies for potential optimization

### Caching Strategy

Configure proper caching in your hosting environment:

1. **Static Assets**:
   - Cache with long TTL (1 year)
   - Use the built-in content hashing to invalidate when changed

2. **HTML Files**:
   - No caching or very short TTL
   - Enable Brotli or Gzip compression

3. **API Responses**:
   - Configure caching based on data volatility
   - Use ETags for conditional requests

## Monitoring and Logging

### Application Monitoring

1. **Error Tracking**:
   - The application supports integration with error tracking services
   - Configure `VITE_ERROR_TRACKING_DSN` to enable

2. **Performance Monitoring**:
   - Core Web Vitals are tracked automatically
   - User interactions are sampled for performance metrics

### Logging

1. **Client-Side Logs**:
   - Configure log level with `VITE_LOG_LEVEL`
   - Logs can be sent to a central service

2. **Audit Logs**:
   - User actions are logged for security and troubleshooting
   - Configure retention policy based on your needs

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files to version control
   - Use secrets management in your CI/CD platform

2. **API Security**:
   - Configure CORS properly on your API
   - Use HTTPS for all API communications

3. **Content Security Policy**:
   - A default CSP is provided in `index.html`
   - Customize based on your specific requirements

4. **Vulnerability Scanning**:
   - Regular dependency scanning is part of the CI process
   - Update dependencies promptly when security issues are found

## Rollback Procedures

In case of deployment issues:

1. **Netlify/Vercel**:
   - Use the built-in rollback feature
   - Select a previous successful deployment

2. **Docker**:
   - Tag images with versions
   - Deploy the previous version: `docker run kobe-scraper-ui:previous`

3. **Manual Deployment**:
   - Keep backups of previous `dist` directories
   - Replace with the previous version

## Troubleshooting

### Common Deployment Issues

1. **API Connection Problems**:
   - Verify environment variables are correctly set
   - Check CORS configuration on the API

2. **Build Failures**:
   - Check the build logs for specific errors
   - Ensure all dependencies are installed correctly

3. **Performance Issues**:
   - Run Lighthouse audits to identify bottlenecks
   - Use the bundle analyzer to find oversized dependencies

### Support Resources

If you encounter issues not covered in this guide:

1. Check the [GitHub repository](https://github.com/kobe-finance/kobe-scraper-ui) for issues and discussions
2. Review the comprehensive documentation
3. Contact the development team

## Maintenance

### Regular Updates

1. **Dependencies**:
   - Run `npm outdated` to identify outdated packages
   - Update with `npm update` or manually update package.json

2. **Security Patches**:
   - Subscribe to security advisories
   - Prioritize security-related updates

### Database Migrations

If your application uses a database:

1. Keep migrations in the `migrations` directory
2. Run migrations as part of the deployment process
3. Have rollback procedures for each migration

### Backup Strategy

1. **Data Backups**:
   - Schedule regular backups of application data
   - Test restoration procedures periodically

2. **Configuration Backups**:
   - Maintain backups of environment configurations
   - Document any manual settings in your hosting environment
