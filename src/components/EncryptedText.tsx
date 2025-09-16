import React, { useState, useEffect } from 'react';

interface EncryptedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const EncryptedText: React.FC<EncryptedTextProps> = ({ text, className = "", delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(true);

  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  useEffect(() => {
    const startDecryption = () => {
      let progress = 0;
      const targetLength = text.length;
      
      const interval = setInterval(() => {
        if (progress <= targetLength) {
          const decrypted = text.slice(0, progress);
          const encrypted = Array.from({ length: targetLength - progress }, () => 
            chars[Math.floor(Math.random() * chars.length)]
          ).join('');
          
          setDisplayText(decrypted + encrypted);
          progress += 0.5;
        } else {
          setDisplayText(text);
          setIsDecrypting(false);
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    };

    const timeout = setTimeout(startDecryption, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, chars]);

  return (
    <span className={`${className} ${isDecrypting ? 'animate-encrypt' : ''} font-mono`}>
      {displayText}
    </span>
  );
};

export default EncryptedText;