import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Shield, Zap, ArrowLeft, Users, Clock, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RadarOverlay from '@/components/RadarOverlay';
import EncryptedText from '@/components/EncryptedText';

const BattleResults = () => {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);

  // Simulate battle data
  const battleStats = {
    placement: 3,
    totalPlayers: 847,
    eliminations: 7,
    survivalTime: "18:42",
    damageDealt: 2847,
    accuracy: 73,
    encryptedEncounters: 12,
    distanceTraveled: 3.2
  };

  const rewards = {
    tokens: 450,
    experience: 1200,
    rank: "TACTICAL OPERATIVE"
  };

  useEffect(() => {
    const phases = [
      () => setAnimationPhase(1), // Show placement
      () => setAnimationPhase(2), // Show stats
      () => setAnimationPhase(3), // Show rewards
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, (index + 1) * 800);
    });
  }, []);

  const statCards = [
    { icon: Crosshair, label: "ELIMINATIONS", value: battleStats.eliminations, unit: "" },
    { icon: Target, label: "ACCURACY", value: battleStats.accuracy, unit: "%" },
    { icon: Shield, label: "ENCOUNTERS", value: battleStats.encryptedEncounters, unit: "" },
    { icon: Clock, label: "SURVIVAL TIME", value: battleStats.survivalTime, unit: "" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-tactical-bg to-background opacity-80" />
      <RadarOverlay className="absolute inset-0 opacity-10" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/arena')}
                className="text-muted-foreground hover:text-radar-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO ARENA
              </Button>
              <div className="h-6 w-px bg-border" />
              <span className="text-lg font-bold font-mono text-radar-primary">BATTLE RESULTS</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="tactical" 
                size="sm"
                onClick={() => navigate('/')}
                className="font-mono"
              >
                RETURN TO LOBBY
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Results */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Placement Display */}
        <section className="text-center mb-12">
          {animationPhase >= 1 && (
            <div className="mb-8">
              <EncryptedText 
                text="MISSION COMPLETE" 
                className="text-2xl md:text-3xl font-bold text-radar-primary block mb-4"
                delay={200}
              />
              <div className="relative">
                <div className="text-8xl md:text-9xl font-bold text-foreground mb-2">
                  #{battleStats.placement}
                </div>
                <div className="text-xl text-muted-foreground font-mono">
                  OUT OF {battleStats.totalPlayers.toLocaleString()} OPERATORS
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Battle Statistics */}
        {animationPhase >= 2 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 font-mono text-radar-primary">
              TACTICAL ANALYSIS
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {statCards.map((stat, index) => (
                <div key={stat.label} className="bg-card border border-border rounded-lg p-4 hover:border-radar-primary/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-radar-primary" />
                    <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
                  </div>
                  <div className="text-2xl font-mono text-radar-primary font-bold">
                    {stat.value}{stat.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-tactical-bg border border-border rounded-lg p-6">
                <h3 className="font-bold text-foreground font-mono mb-4">COMBAT METRICS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono text-sm">DAMAGE DEALT</span>
                    <span className="text-radar-primary font-mono font-bold">{battleStats.damageDealt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono text-sm">DISTANCE TRAVELED</span>
                    <span className="text-radar-primary font-mono font-bold">{battleStats.distanceTraveled}KM</span>
                  </div>
                </div>
              </div>

              <div className="bg-tactical-bg border border-border rounded-lg p-6">
                <h3 className="font-bold text-foreground font-mono mb-4">ENCRYPTION STATUS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono text-sm">POSITION REVEALS</span>
                    <span className="text-radar-primary font-mono font-bold">{battleStats.encryptedEncounters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono text-sm">PROTOCOL INTEGRITY</span>
                    <span className="text-radar-secondary font-mono font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Rewards Section */}
        {animationPhase >= 3 && (
          <section className="text-center">
            <div className="bg-tactical-bg border-2 border-radar-primary rounded-2xl p-8 max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-radar-primary/5 to-radar-secondary/5" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-radar-primary" />
                  <h3 className="text-3xl font-bold font-mono text-radar-primary">
                    MISSION REWARDS
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-xs text-muted-foreground font-mono mb-1">TOKENS EARNED</div>
                    <div className="text-2xl font-mono text-radar-primary font-bold">+{rewards.tokens}</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-xs text-muted-foreground font-mono mb-1">EXPERIENCE</div>
                    <div className="text-2xl font-mono text-radar-primary font-bold">+{rewards.experience}</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-xs text-muted-foreground font-mono mb-1">RANK</div>
                    <div className="text-sm font-mono text-radar-secondary font-bold">{rewards.rank}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    variant="arena" 
                    size="lg" 
                    onClick={() => navigate('/arena')}
                    className="text-lg px-12 py-4 font-mono"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    DEPLOY AGAIN
                  </Button>
                  
                  <div className="text-sm text-muted-foreground font-mono">
                    Ready for another encrypted battle?
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BattleResults;