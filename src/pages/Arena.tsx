import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Radar, Lock, Users, Zap, Target, ArrowLeft, Signal, MapPin, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RadarOverlay from '@/components/RadarOverlay';
import EncryptedText from '@/components/EncryptedText';
import { useShadowArena } from '@/hooks/useShadowArena';

const Arena = () => {
  const navigate = useNavigate();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('READY');
  const [playerCount] = useState(847);
  const [playerPosition, setPlayerPosition] = useState({ x: 500, y: 500 });
  
  const {
    gameState,
    playerInfo,
    isJoining,
    isMoving,
    handleJoinArena,
    handleMovePlayer,
  } = useShadowArena();

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('INITIALIZING...');
    
    setTimeout(() => setDeploymentStatus('ENCRYPTING POSITION...'), 1000);
    setTimeout(() => setDeploymentStatus('ESTABLISHING SECURE CHANNEL...'), 2500);
    setTimeout(() => setDeploymentStatus('LOADING BATTLEFIELD...'), 4000);
    
    // Join arena with encrypted coordinates
    setTimeout(async () => {
      try {
        await handleJoinArena(playerPosition.x, playerPosition.y);
        setDeploymentStatus('DEPLOYMENT COMPLETE');
        setIsDeploying(false);
        // Navigate to battle results after deployment
        setTimeout(() => navigate('/battle-results'), 1000);
      } catch (error) {
        console.error('Failed to join arena:', error);
        setDeploymentStatus('DEPLOYMENT FAILED');
        setIsDeploying(false);
      }
    }, 4000);
  };

  const handleMove = async (direction: 'up' | 'down' | 'left' | 'right') => {
    const moveDistance = 50;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, playerPosition.y - moveDistance);
        break;
      case 'down':
        newY = Math.min(1000, playerPosition.y + moveDistance);
        break;
      case 'left':
        newX = Math.max(0, playerPosition.x - moveDistance);
        break;
      case 'right':
        newX = Math.min(1000, playerPosition.x + moveDistance);
        break;
    }

    setPlayerPosition({ x: newX, y: newY });
    await handleMovePlayer(newX, newY);
  };

  const arenaStats = [
    { label: "ENCRYPTION", value: "AES-256", status: "ACTIVE" },
    { label: "NETWORK", value: "TESTNET", status: "ONLINE" },
    { label: "LATENCY", value: "12ms", status: "OPTIMAL" },
    { label: "ARENA", value: "READY", status: "WAITING" }
  ];

  const tacticalSystems = [
    {
      icon: Lock,
      title: "Position Encryption",
      description: "Your location remains hidden until engagement range",
      status: "SECURED"
    },
    {
      icon: Radar,
      title: "Proximity Detection",
      description: "Real-time threat assessment within encounter zones",
      status: "SCANNING"
    },
    {
      icon: Signal,
      title: "Secure Communications",
      description: "End-to-end encrypted team coordination",
      status: "ACTIVE"
    },
    {
      icon: Target,
      title: "Fair Play Protocol",
      description: "Zero-knowledge proof validation of all actions",
      status: "VERIFIED"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-tactical-bg to-background opacity-80" />
      <RadarOverlay className="absolute inset-0 opacity-15" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-radar-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO LOBBY
              </Button>
              <div className="h-6 w-px bg-border" />
              <span className="text-lg font-bold font-mono text-radar-primary">TACTICAL ARENA</span>
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

      {/* Main Arena Interface */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Arena Status */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <EncryptedText 
                text="ARENA DEPLOYMENT" 
                className="text-radar-primary block"
                delay={300}
              />
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              Secure battlefield initialization in progress
            </p>
          </div>

          {/* System Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {arenaStats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4 hover:border-radar-primary/50 transition-colors">
                <div className="text-xs text-muted-foreground font-mono mb-1">{stat.label}</div>
                <div className="text-sm font-mono text-radar-primary font-bold">{stat.value}</div>
                <div className="text-xs text-radar-secondary mt-1">{stat.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tactical Systems */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 font-mono text-radar-primary">
            TACTICAL SYSTEMS STATUS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tacticalSystems.map((system, index) => (
              <div 
                key={system.title}
                className="bg-card border border-border rounded-lg p-6 hover:border-radar-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-radar-primary/10 rounded-lg flex items-center justify-center group-hover:bg-radar-primary/20 transition-colors">
                    <system.icon className="w-5 h-5 text-radar-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground font-mono">{system.title}</h3>
                    <div className="text-xs text-radar-secondary font-mono">{system.status}</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{system.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Game Interface */}
        {gameState.isInGame ? (
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Arena Map */}
              <div className="lg:col-span-2">
                <div className="bg-tactical-bg border border-radar-primary rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 font-mono text-radar-primary">BATTLEFIELD MAP</h3>
                  <div className="relative w-full h-96 bg-black rounded-lg border border-border overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={i}>
                          <div className="absolute w-full h-px bg-radar-primary" style={{ top: `${i * 5}%` }} />
                          <div className="absolute h-full w-px bg-radar-primary" style={{ left: `${i * 5}%` }} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Player position */}
                    <div 
                      className="absolute w-4 h-4 bg-radar-primary rounded-full border-2 border-white animate-pulse"
                      style={{ 
                        left: `${(playerPosition.x / 1000) * 100}%`, 
                        top: `${(playerPosition.y / 1000) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-radar-primary rounded-full animate-ping opacity-75" />
                    </div>
                    
                    {/* Position coordinates */}
                    <div className="absolute top-4 left-4 bg-black/80 text-radar-primary px-3 py-1 rounded font-mono text-sm">
                      X: {playerPosition.x} Y: {playerPosition.y}
                    </div>
                  </div>
                  
                  {/* Movement controls */}
                  <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    <div />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMove('up')}
                      disabled={isMoving}
                      className="font-mono"
                    >
                      ↑
                    </Button>
                    <div />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMove('left')}
                      disabled={isMoving}
                      className="font-mono"
                    >
                      ←
                    </Button>
                    <div className="bg-radar-primary/20 rounded flex items-center justify-center">
                      <Crosshair className="w-4 h-4 text-radar-primary" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMove('right')}
                      disabled={isMoving}
                      className="font-mono"
                    >
                      →
                    </Button>
                    <div />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMove('down')}
                      disabled={isMoving}
                      className="font-mono"
                    >
                      ↓
                    </Button>
                    <div />
                  </div>
                </div>
              </div>
              
              {/* Player Stats */}
              <div className="space-y-6">
                <div className="bg-tactical-bg border border-radar-primary rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 font-mono text-radar-primary">PLAYER STATUS</h3>
                  {playerInfo ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-mono">Health:</span>
                        <span className="text-radar-primary font-mono">{playerInfo.health}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-mono">Armor:</span>
                        <span className="text-radar-primary font-mono">{playerInfo.armor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-mono">Ammo:</span>
                        <span className="text-radar-primary font-mono">{playerInfo.ammo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-mono">Status:</span>
                        <span className={`font-mono ${playerInfo.isAlive ? 'text-green-400' : 'text-red-400'}`}>
                          {playerInfo.isAlive ? 'ALIVE' : 'ELIMINATED'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground font-mono">Loading player data...</div>
                  )}
                </div>
                
                <div className="bg-tactical-bg border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 font-mono text-radar-primary">ENCRYPTION STATUS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-radar-primary" />
                      <span className="text-sm font-mono">Position: ENCRYPTED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-radar-primary" />
                      <span className="text-sm font-mono">Health: ENCRYPTED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radar className="w-4 h-4 text-radar-primary" />
                      <span className="text-sm font-mono">Proximity: SCANNING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Deployment Section */
          <section className="text-center">
            <div className="bg-tactical-bg border-2 border-radar-primary rounded-2xl p-8 max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-radar-primary/5 to-radar-secondary/5" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 font-mono text-radar-primary">
                  {isDeploying ? deploymentStatus : 'READY FOR DEPLOYMENT'}
                </h3>
                
                {isDeploying ? (
                  <div className="space-y-4">
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-gradient-to-r from-radar-primary to-radar-secondary h-2 rounded-full animate-pulse" 
                           style={{ width: deploymentStatus === 'DEPLOYMENT COMPLETE' ? '100%' : '70%' }} />
                    </div>
                    <p className="text-muted-foreground font-mono">
                      Establishing secure connection to battlefield...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-lg">
                      All systems operational. Ready to enter the encrypted battlefield.
                    </p>
                    
                    <Button 
                      variant="arena" 
                      size="lg" 
                      onClick={handleDeploy}
                      disabled={isJoining}
                      className="text-xl px-12 py-6 font-mono"
                    >
                      <Zap className="w-6 h-6 mr-3" />
                      {isJoining ? 'JOINING ARENA...' : 'DEPLOY TO BATTLEFIELD'}
                    </Button>
                    
                    <div className="text-sm text-muted-foreground font-mono">
                      Warning: Once deployed, your position will be encrypted until engagement
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Arena;