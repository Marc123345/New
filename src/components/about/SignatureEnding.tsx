import { motion } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SignatureEnding() {
  return (
    <div className="w-full flex flex-col items-center text-center" style={{ padding: 'clamp(1rem, 3vw, 2.5rem) 0' }}>
      <motion.div
        className="w-16 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.4), transparent)', transformOrigin: 'center' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      />
    </div>
  );
}