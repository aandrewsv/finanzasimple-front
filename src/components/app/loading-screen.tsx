import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="relative flex items-center justify-center">
        {/* Círculo exterior */}
        <motion.div
          className="absolute w-24 h-24 border-4 rounded-full border-blue-400/40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Símbolo de dólar central */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DollarSign className="w-12 h-12 text-blue-500" />
        </motion.div>

        {/* Iconos orbitando */}
        <motion.div
          className="absolute"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div className="absolute -top-8">
            <ArrowUpFromLine className="w-6 h-6 text-green-400" />
          </motion.div>
          <motion.div className="absolute -bottom-8">
            <ArrowDownToLine className="w-6 h-6 text-red-400" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Texto de carga */}
      <motion.div
        className="mt-8 text-lg text-blue-500"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Cargando
        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;