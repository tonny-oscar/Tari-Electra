# Tari Electra - Production Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables
Ensure all environment variables are properly set in your production environment:
- Firebase configuration
- API keys
- Database URLs
- Email service credentials

### 2. Build Commands

#### Development
```bash
npm run dev
```

#### Production Build
```bash
npm run build:prod
```

#### Type Check Only
```bash
npm run typecheck
```

#### Lint Check
```bash
npm run lint:check
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Option 2: Docker Deployment
```bash
# Build Docker image
docker build -t tari-electra .

# Run container
docker run -p 3000:3000 --env-file .env.production tari-electra
```

### Option 3: Traditional Server
```bash
# Build the application
npm run build:prod

# Start production server
npm run start:prod
```

## Performance Optimizations Applied

1. **Image Optimization**: WebP and AVIF formats enabled
2. **Security Headers**: Added comprehensive security headers
3. **Compression**: Enabled gzip compression
4. **Standalone Output**: Optimized for containerization
5. **Type Safety**: Enabled TypeScript checking for production

## Monitoring

- Monitor build logs for any warnings or errors
- Check Core Web Vitals in production
- Monitor Firebase usage and quotas
- Set up error tracking (recommended: Sentry)

## Post-deployment

1. Test all critical user flows
2. Verify Firebase integration
3. Test payment processing
4. Check email notifications
5. Validate mobile responsiveness

## Troubleshooting

### Build Failures
- Check TypeScript errors: `npm run typecheck`
- Check linting errors: `npm run lint:check`
- Verify environment variables are set

### Runtime Issues
- Check server logs
- Verify Firebase configuration
- Check API endpoints
- Validate environment variables

## Security Considerations

- Never commit `.env` files to version control
- Use environment-specific configurations
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use HTTPS in production