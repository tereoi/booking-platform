// src/components/3d/Hero3D.tsx
import { motion } from 'framer-motion';

export default function Hero3D() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Placeholder voor 3D content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20" />
        </div>
      </motion.div>
    </div>
  );
}