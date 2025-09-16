# 🚀 Shadow Arena Unveil - Complete Deployment Guide

This guide will walk you through deploying the Shadow Arena Unveil project with real FHE encryption on-chain.

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- A Web3 wallet (MetaMask, etc.)
- Sepolia ETH for gas fees
- Infura account for RPC access
- WalletConnect project for wallet integration

## 🔧 Step 1: Environment Setup

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Frontend Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS

# Hardhat Configuration (for deployment)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 1.3 Get Required API Keys

#### Infura API Key
1. Visit [infura.io](https://infura.io)
2. Create account and new project
3. Copy the project ID

#### WalletConnect Project ID
1. Visit [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create new project
3. Copy the project ID

#### Private Key
1. Export private key from MetaMask
2. **⚠️ Never share this key or commit it to version control**

## 🏗️ Step 2: Smart Contract Deployment

### 2.1 Compile Contracts
```bash
npm run compile
```

### 2.2 Deploy to Sepolia Testnet
```bash
npm run deploy:sepolia
```

This will:
- Deploy the ShadowArena contract
- Save deployment info to `deployments/` folder
- Display the contract address

### 2.3 Update Contract Address
After deployment, update your `.env.local` file with the actual contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourActualContractAddress
```

### 2.4 Verify Contract (Optional)
```bash
npm run verify -- --network sepolia CONTRACT_ADDRESS
```

## 🌐 Step 3: Frontend Deployment

### 3.1 Local Development
```bash
npm run dev
```

Visit `http://localhost:8080` to test locally.

### 3.2 Build for Production
```bash
npm run build
```

### 3.3 Deploy to Vercel

#### Option A: Vercel CLI
```bash
npx vercel --prod
```

#### Option B: Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## 🔐 Step 4: FHE Configuration

### 4.1 FHE Client Setup
The FHE client is automatically initialized when:
- Wallet is connected
- Contract address is configured
- Network is Sepolia

### 4.2 Testing FHE Functions
1. Connect wallet to Sepolia network
2. Click "DEPLOY TO BATTLEFIELD"
3. Enter coordinates (will be encrypted)
4. Confirm transaction
5. Check encrypted data on-chain

## 🎮 Step 5: Game Testing

### 5.1 Join Arena
1. Connect wallet
2. Click "DEPLOY TO BATTLEFIELD"
3. Enter starting coordinates
4. Confirm transaction

### 5.2 Move Player
1. Use movement controls
2. Coordinates are encrypted before sending
3. Check transaction on block explorer

### 5.3 Attack System
1. Target other players
2. Damage is encrypted
3. Health calculations use FHE

## 🔍 Step 6: Verification

### 6.1 Check Contract on Etherscan
1. Visit [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Search for your contract address
3. Verify all functions are working

### 6.2 Test FHE Encryption
1. Check transaction data
2. Verify coordinates are encrypted
3. Confirm health/damage calculations

### 6.3 Monitor Events
Watch for these events:
- `PlayerJoined`
- `PlayerMoved`
- `PlayerAttacked`
- `PlayerEliminated`

## 🚨 Troubleshooting

### Common Issues

#### 1. FHE Client Not Initializing
- Check network connection
- Verify contract address
- Ensure wallet is connected

#### 2. Transaction Failures
- Check gas fees
- Verify Sepolia ETH balance
- Confirm contract is deployed

#### 3. Encryption Errors
- Check FHE client initialization
- Verify network compatibility
- Review console errors

### Debug Commands
```bash
# Check contract compilation
npm run compile

# Test local deployment
npm run deploy:localhost

# Run tests
npm run test
```

## 📊 Monitoring

### 6.1 Contract Events
Monitor these events for game activity:
```javascript
// Player joined
PlayerJoined(address indexed playerAddress, uint32 playerId, uint32 x, uint32 y)

// Player moved
PlayerMoved(address indexed playerAddress, uint32 x, uint32 y)

// Player attacked
PlayerAttacked(address indexed attacker, address indexed target, uint8 damage)
```

### 6.2 Performance Metrics
- Transaction success rate
- Gas usage optimization
- FHE encryption speed
- User engagement

## 🔒 Security Considerations

### 6.1 Private Key Security
- Never commit private keys
- Use environment variables
- Consider hardware wallets

### 6.2 Contract Security
- Verify contract on Etherscan
- Test all functions thoroughly
- Monitor for unusual activity

### 6.3 FHE Security
- Verify encryption is working
- Check data privacy
- Monitor for leaks

## 🎯 Production Checklist

- [ ] Contract deployed and verified
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] FHE client working
- [ ] All game functions tested
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Monitoring set up

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review console errors
3. Verify all configurations
4. Test on local network first
5. Check contract on Etherscan

## 🎉 Success!

Once deployed, your Shadow Arena Unveil will be:
- ✅ Fully encrypted with FHE
- ✅ Deployed on Sepolia testnet
- ✅ Accessible via Web3 wallet
- ✅ Ready for players to join the encrypted battlefield!

---

**Ready to deploy? Start with Step 1 and follow the guide!** 🚀
