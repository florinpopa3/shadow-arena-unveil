# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

## How to Get These Values

### 1. Infura API Key
- Visit [infura.io](https://infura.io)
- Create an account and new project
- Copy the project ID from your dashboard

### 2. Wallet Connect Project ID
- Visit [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Create a new project
- Copy the project ID

### 3. Chain ID
- Sepolia testnet: `11155111`
- Mainnet: `1` (for production)

## Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly for security
