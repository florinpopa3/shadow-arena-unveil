import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Radar, Lock, Users, Zap, Target, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RadarOverlay from '@/components/RadarOverlay';
import WalletConnect from '@/components/WalletConnect';
import EncryptedText from '@/components/EncryptedText';
import tacticalBg from '@/assets/tactical-bg.jpg';
import encryptedBrLogo from '@/assets/encrypted-br-logo.png';

const Index = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [playerCount] = useState(847);

  const handleWalletConnect = (address: string) => {
    setIsConnected(true);
  };

  const handleEnterArena = () => {
    navigate('/arena');
  };

  const features = [
    {
      icon: Lock,
      title: "Zero-Knowledge Combat",
      description: "Player positions remain encrypted until direct encounters occur"
    },
    {
      icon: Shield,
      title: "Anti-Cheat Protocol", 
      description: "Blockchain-verified actions prevent stream sniping and exploits"
    },
    {
      icon: Radar,
      title: "Tactical Intel System",
      description: "Real-time encrypted data feeds with proximity-based reveals"
    },
    {
      icon: Target,
      title: "Fair Engagement",
      description: "No pre-game intel advantage - pure skill determines victory"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${tacticalBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
      
      {/* Radar Overlay */}
      <RadarOverlay className="absolute inset-0 opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={encryptedBrLogo} alt="Encrypted BR" className="w-10 h-10" />
              <span className="text-xl font-bold font-mono text-radar-primary">ENCRYPTED BR</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-mono">{playerCount.toLocaleString()} OPERATORS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <EncryptedText 
                text="SURVIVE IN SECRET" 
                className="text-foreground block mb-2"
                delay={500}
              />
              <EncryptedText 
                text="REVEAL IN VICTORY" 
                className="text-radar-primary block"
                delay={1500}
              />
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-mono max-w-2xl mx-auto leading-relaxed">
              Enter the world's first encrypted battle royale where locations and loot remain hidden until encounters occur.
            </p>

            <div className="mb-16">
              <WalletConnect onConnect={handleWalletConnect} />
            </div>

            {/* Status Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: "ENCRYPTION", value: "AES-256", status: "ACTIVE" },
                { label: "NETWORK", value: "TESTNET", status: "ONLINE" },
                { label: "LATENCY", value: "12ms", status: "OPTIMAL" },
                { label: "ARENA", value: "READY", status: "WAITING" }
              ].map((stat) => (
                <div key={stat.label} className="bg-tactical-bg border border-border rounded-lg p-4">
                  <div className="text-xs text-muted-foreground font-mono mb-1">{stat.label}</div>
                  <div className="text-sm font-mono text-radar-primary font-bold">{stat.value}</div>
                  <div className="text-xs text-radar-secondary mt-1">{stat.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono text-radar-primary">
              TACTICAL ADVANTAGES
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced encryption protocols ensure fair competition and prevent exploitation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card border border-border rounded-lg p-6 hover:border-radar-primary transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-radar-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-radar-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-radar-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 font-mono text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="bg-tactical-bg border border-radar-primary rounded-2xl p-12 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-radar-primary/5 to-radar-secondary/5" />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 font-mono text-radar-primary">
                READY FOR DEPLOYMENT?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Join the next generation of competitive gaming where skill, not information, determines victory.
              </p>
              
              {isConnected ? (
                <Button 
                  variant="arena" 
                  size="lg" 
                  className="text-lg px-12 py-6"
                  onClick={handleEnterArena}
                >
                  <Play className="w-5 h-5 mr-2" />
                  ENTER ARENA
                </Button>
              ) : (
                <div className="text-radar-secondary font-mono">
                  Connect wallet to access the arena
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
