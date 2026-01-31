'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
  shape: 'circle' | 'square' | 'triangle';
  delay: number;
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * -100 - 50,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    scale: Math.random() * 0.5 + 0.5,
    shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.2,
  }));
}

function ParticleShape({ shape, color }: { shape: Particle['shape']; color: string }) {
  if (shape === 'circle') {
    return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />;
  }
  if (shape === 'square') {
    return <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />;
  }
  return (
    <div
      className="w-0 h-0"
      style={{
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: `10px solid ${color}`,
      }}
    />
  );
}

export function Confetti() {
  const [particles] = useState<Particle[]>(() => generateParticles(50));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.x * 8,
              y: particle.y * 4 + 200,
              scale: particle.scale,
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2,
              ease: [0.23, 1, 0.32, 1],
              delay: particle.delay,
            }}
          >
            <ParticleShape shape={particle.shape} color={particle.color} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
