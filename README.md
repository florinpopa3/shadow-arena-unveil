# 🎯 Shadow Arena Unveil

<div align="center">

![Shadow Arena](public/favicon.svg)

**The Ultimate Encrypted Battle Royale Experience**

*Where stealth meets strategy in a world of encrypted combat*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/florinpopa3/shadow-arena-unveil)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

</div>

---

## 🌟 What Makes This Special?

Imagine a battle royale where your every move is encrypted until the moment of truth. **Shadow Arena Unveil** revolutionizes competitive gaming by using **Fully Homomorphic Encryption (FHE)** to ensure absolute fairness.

### 🔐 The Encryption Advantage
- **Zero-Knowledge Combat**: Your position remains hidden until direct encounters
- **Anti-Cheat Protocol**: Blockchain-verified actions prevent all forms of exploitation  
- **Fair Play Guaranteed**: No stream-sniping, no information advantage, pure skill wins

### ⚡ Lightning-Fast Gameplay
- **Real-time Encrypted Data**: Instant proximity detection with encrypted coordinates
- **Tactical Intel System**: Advanced radar with encrypted threat assessment
- **Secure Communications**: End-to-end encrypted team coordination

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Some Sepolia ETH for gas fees

### Installation
```bash
# Clone the repository
git clone https://github.com/florinpopa3/shadow-arena-unveil.git
cd shadow-arena-unveil

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` and connect your wallet to enter the arena!

---

## 🎮 How to Play

### 1. **Connect & Deploy**
Connect your Web3 wallet and deploy to the encrypted battlefield

### 2. **Navigate Stealthily** 
Use tactical movement controls to traverse the arena

### 3. **Collect Encrypted Loot**
Find and secure weapons and items with encrypted positioning

### 4. **Engage in Combat**
Fight other players when proximity triggers encrypted encounters

### 5. **Survive & Dominate**
Be the last operator standing in the ultimate test of skill

---

## 🛠️ Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui</td>
</tr>
<tr>
<td><strong>Blockchain</strong></td>
<td>Ethereum Sepolia, Rainbow Kit, Wagmi, Viem</td>
</tr>
<tr>
<td><strong>Encryption</strong></td>
<td>Zama FHE, Zero-Knowledge Proofs</td>
</tr>
<tr>
<td><strong>Smart Contracts</strong></td>
<td>Solidity ^0.8.24, FHE-powered game mechanics</td>
</tr>
</table>

---

## 🔧 Smart Contract Features

### ShadowArena Contract
```solidity
// Encrypted player management
mapping(uint256 => Player) public players;

// FHE-powered combat system  
function engageBattle(uint256 attackerId, uint256 targetId) external;

// Encrypted loot spawning
function spawnWeapon(externalEuint32 x, externalEuint32 y) external;
```

### Key Capabilities
- **Encrypted Position Tracking**: All coordinates hidden until encounters
- **FHE Combat Calculations**: Damage and health encrypted on-chain
- **Secure Loot System**: Weapons and items with encrypted placement
- **Reputation Tracking**: Encrypted player reputation system

---

## 🌐 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Import your fork
4. Add environment variables (see `.env.example`)
5. Deploy! 🚀

### Environment Variables
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_sepolia_rpc_url
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

---

## 🎯 Game Mechanics

### Arena System
- **1000x1000 Coordinate Grid**: Precise encrypted positioning
- **Proximity Detection**: Encrypted encounter triggers
- **Real-time Updates**: Live encrypted data feeds

### Combat System  
- **FHE Damage Calculation**: Encrypted health and armor systems
- **Verifiable Results**: Transparent yet private battle outcomes
- **Anti-Cheat Protection**: Blockchain-verified game state

### Loot & Weapons
- **Encrypted Spawning**: Randomized secure item placement
- **Rarity System**: Encrypted weapon classification
- **Secure Collection**: Verified loot acquisition

---

## 🔒 Security Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔐 **FHE Encryption** | All sensitive data encrypted using Zama's FHE |
| 🛡️ **Zero-Knowledge Proofs** | Verifiable actions without data exposure |
| ⚔️ **Anti-Cheat Protocol** | Blockchain-verified game state integrity |
| 🔒 **Secure Communications** | End-to-end encrypted player interactions |

</div>

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Zama](https://zama.ai/) for revolutionary FHE technology
- [Rainbow Kit](https://rainbowkit.com/) for seamless wallet integration  
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vite](https://vitejs.dev/) for lightning-fast development

---

## 🔮 Roadmap

- [ ] **Multi-chain Support** - Expand to other EVM chains
- [ ] **Mobile App** - Native iOS/Android experience
- [ ] **Tournament System** - Competitive leagues and rankings
- [ ] **NFT Integration** - Unique player avatars and items
- [ ] **Advanced FHE** - More sophisticated encryption features
- [ ] **Spectator Mode** - Watch encrypted battles unfold
- [ ] **Replay System** - Encrypted battle recordings

---

## 📞 Community & Support

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-7289DA?logo=discord&logoColor=white)](https://discord.gg/shadow-arena)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?logo=twitter&logoColor=white)](https://twitter.com/ShadowArenaGame)
[![GitHub](https://img.shields.io/badge/GitHub-100000?logo=github&logoColor=white)](https://github.com/florinpopa3/shadow-arena-unveil)

</div>

---

<div align="center">

**Ready to enter the encrypted battlefield?**

*Connect your wallet and deploy to the arena!*

[![Play Now](https://img.shields.io/badge/Play%20Now-Enter%20Arena-brightgreen?style=for-the-badge)](https://shadow-arena-unveil.vercel.app)

</div>