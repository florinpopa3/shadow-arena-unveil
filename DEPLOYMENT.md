# Vercel Deployment Guide for Shadow Arena Unveil

This guide provides step-by-step instructions for deploying Shadow Arena Unveil to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Domain name (optional, for custom domain setup)

## Step 1: Connect to Vercel

1. **Visit Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" or "Import Project"
   - Select "Import Git Repository"
   - Choose `florinpopa3/shadow-arena-unveil` from the list
   - Click "Import"

## Step 2: Configure Project Settings

1. **Project Configuration**
   - **Project Name**: `shadow-arena-unveil` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables**
   Add the following environment variables in Vercel dashboard:

   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_ID
   NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_KEY
   ```

   **How to add environment variables:**
   - In the project settings, go to "Environment Variables"
   - Click "Add New"
   - Enter the variable name and value
   - Select "Production", "Preview", and "Development" environments
   - Click "Save"

## Step 3: Deploy

1. **Initial Deployment**
   - Click "Deploy" button
   - Vercel will automatically:
     - Install dependencies (`npm install`)
     - Build the project (`npm run build`)
     - Deploy to a unique URL

2. **Wait for Deployment**
   - The deployment process typically takes 2-5 minutes
   - You can monitor the progress in the deployment logs
   - Once complete, you'll get a live URL (e.g., `https://shadow-arena-unveil.vercel.app`)

## Step 4: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to project settings
   - Navigate to "Domains" section
   - Click "Add Domain"
   - Enter your custom domain (e.g., `shadowarena.game`)

2. **DNS Configuration**
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record pointing to Vercel's IP addresses
   - Wait for DNS propagation (up to 24 hours)

3. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled once DNS is configured

## Step 5: Configure Build Settings

1. **Build Configuration**
   - Ensure the following settings in `vercel.json` (create if needed):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "installCommand": "npm install"
   }
   ```

2. **Node.js Version**
   - Vercel automatically detects Node.js version from `package.json`
   - Ensure you have `"engines": { "node": ">=18.0.0" }` in package.json

## Step 6: Environment-Specific Configuration

1. **Production Environment**
   - Use production RPC URLs
   - Set production wallet connect project ID
   - Configure production contract addresses

2. **Preview Environment**
   - Use testnet RPC URLs
   - Set testnet wallet connect project ID
   - Configure testnet contract addresses

3. **Development Environment**
   - Use local development settings
   - Set development wallet connect project ID

## Step 7: Post-Deployment Verification

1. **Test the Application**
   - Visit the deployed URL
   - Test wallet connection
   - Verify all features work correctly
   - Check console for any errors

2. **Performance Optimization**
   - Enable Vercel Analytics (optional)
   - Configure caching headers
   - Optimize images and assets

## Step 8: Continuous Deployment

1. **Automatic Deployments**
   - Vercel automatically deploys on every push to main branch
   - Preview deployments are created for pull requests
   - You can configure branch-specific settings

2. **Deployment Hooks**
   - Set up webhooks for external services
   - Configure deployment notifications
   - Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Double-check variable names and values
   - Ensure variables are set for all environments
   - Restart deployment after adding new variables

3. **Domain Issues**
   - Verify DNS configuration
   - Check domain propagation status
   - Ensure SSL certificate is properly configured

4. **Performance Issues**
   - Enable Vercel Edge Functions
   - Optimize bundle size
   - Configure proper caching headers

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Support](https://vercel.com/support)

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Configure proper security headers
   - Enable HSTS if needed

3. **Access Control**
   - Configure proper CORS settings
   - Implement rate limiting
   - Monitor for suspicious activity

## Monitoring and Analytics

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance metrics
   - Track user behavior

2. **Error Tracking**
   - Integrate with Sentry or similar service
   - Monitor application errors
   - Set up alerts for critical issues

3. **Performance Monitoring**
   - Use Vercel's built-in performance monitoring
   - Track Core Web Vitals
   - Optimize based on metrics

## Backup and Recovery

1. **Code Backup**
   - Repository is automatically backed up on GitHub
   - Regular backups of environment variables
   - Document all configuration changes

2. **Disaster Recovery**
   - Keep deployment configuration in version control
   - Document rollback procedures
   - Test recovery processes regularly

---

## Quick Deployment Checklist

- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings (Vite framework)
- [ ] Add environment variables
- [ ] Deploy to production
- [ ] Test all functionality
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and analytics
- [ ] Document deployment process

**Your Shadow Arena Unveil application should now be live and accessible to users worldwide!**

For additional support or questions, refer to the [Vercel documentation](https://vercel.com/docs) or contact the development team.