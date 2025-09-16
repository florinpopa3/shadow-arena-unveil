import React from 'react';

interface RadarOverlayProps {
  className?: string;
}

const RadarOverlay: React.FC<RadarOverlayProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Radar Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Concentric circles */}
          {[50, 100, 150, 200].map((radius) => (
            <circle
              key={radius}
              cx="200"
              cy="200"
              r={radius}
              fill="none"
              stroke="hsl(var(--radar-primary))"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
          
          {/* Cross lines */}
          <line x1="0" y1="200" x2="400" y2="200" stroke="hsl(var(--radar-primary))" strokeWidth="1" opacity="0.4" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="hsl(var(--radar-primary))" strokeWidth="1" opacity="0.4" />
          
          {/* Diagonal lines */}
          <line x1="58" y1="58" x2="342" y2="342" stroke="hsl(var(--radar-primary))" strokeWidth="1" opacity="0.2" />
          <line x1="342" y1="58" x2="58" y2="342" stroke="hsl(var(--radar-primary))" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>
      
      {/* Radar Sweep */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <div 
            className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-t from-radar-secondary to-transparent origin-bottom animate-radar-sweep"
            style={{ transformOrigin: 'bottom center', marginLeft: '-0.5px', marginTop: '-128px' }}
          />
        </div>
      </div>
      
      {/* Encrypted Blips */}
      <div className="absolute inset-0">
        {[
          { top: '30%', left: '60%' },
          { top: '70%', left: '25%' },
          { top: '45%', left: '80%' },
          { top: '65%', left: '55%' }
        ].map((pos, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-radar-secondary rounded-full animate-radar-ping"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}
      </div>
    </div>
  );
};

export default RadarOverlay;