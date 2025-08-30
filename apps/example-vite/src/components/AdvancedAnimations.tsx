import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useGesture } from 'react-use-gesture';
import { useResponsiveValue } from '@react-responsive-easy/core';

interface AnimationCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  delay: number;
}

const AdvancedAnimations: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Responsive values
  const cardSize = useResponsiveValue([280, 320, 360, 400]);
  const cardGap = useResponsiveValue([16, 20, 24, 32]);
  const fontSize = useResponsiveValue([14, 16, 18, 20]);

  // Motion values for drag interactions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [45, -45]);
  const rotateY = useTransform(x, [-100, 100], [-45, 45]);

  // Spring animations
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const animationCards: AnimationCard[] = [
    {
      id: 1,
      title: "Gesture Control",
      description: "Interactive drag, swipe, and pinch gestures with physics-based animations",
      icon: "👆",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      id: 2,
      title: "3D Transform",
      description: "Realistic 3D card effects with perspective and depth",
      icon: "🎭",
      color: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      id: 3,
      title: "Spring Physics",
      description: "Natural motion with configurable spring physics and damping",
      icon: "🔄",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      id: 4,
      title: "Staggered Layout",
      description: "Coordinated animations with precise timing and sequencing",
      icon: "🎯",
      color: "from-orange-500 to-red-500",
      delay: 0.4
    },
    {
      id: 5,
      title: "Morphing Shapes",
      description: "Smooth transitions between different geometric shapes",
      icon: "🔷",
      color: "from-indigo-500 to-blue-500",
      delay: 0.5
    },
    {
      id: 6,
      title: "Particle Effects",
      description: "Dynamic particle systems with physics and collision detection",
      icon: "✨",
      color: "from-yellow-500 to-orange-500",
      delay: 0.6
    }
  ];

  // Gesture handling
  const bind = useGesture({
    onDrag: ({ movement: [mx, my], direction: [dx], velocity: [vx] }) => {
      x.set(mx);
      y.set(my);
      
      if (Math.abs(dx) > 0.5) {
        setDragDirection(dx > 0 ? 'right' : 'left');
      }
    },
    onDragEnd: ({ velocity: [vx], direction: [dx] }) => {
      if (Math.abs(vx) > 0.5) {
        // Swipe animation
        x.set(dx * 200);
        setTimeout(() => {
          x.set(0);
          setDragDirection(null);
        }, 300);
      } else {
        // Return to center
        x.set(0);
        y.set(0);
      }
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95,
      rotateY: -5
    }
  };

  const expandedVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      scale: 0.8
    },
    expanded: {
      height: "auto",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: cardGap }}
      className="advanced-animations"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ fontSize: fontSize + 12, marginBottom: cardGap * 2 }}
        className="text-3xl font-bold text-gray-900 text-center mb-8"
      >
        Advanced Animation System
      </motion.h2>

      {/* Interactive Demo Card */}
      <motion.div
        className="mb-12 flex justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <motion.div
          {...bind()}
          style={{
            x: springX,
            y: springY,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="relative cursor-grab active:cursor-grabbing"
        >
          <motion.div
            className={`w-80 h-48 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 
                       shadow-2xl text-white p-6 flex flex-col justify-between
                       ${dragDirection ? 'ring-4 ring-yellow-400' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="text-4xl mb-2"
              >
                🎮
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Interactive Demo</h3>
              <p className="text-indigo-100 text-sm">
                Drag to explore 3D effects • Swipe for animations
              </p>
            </div>
            
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {dragDirection && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-yellow-400 text-indigo-900 rounded-full text-sm font-medium"
                >
                  {dragDirection === 'left' ? '← Swipe Left' : 'Swipe Right →'}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animation Cards Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gap: cardGap }}
      >
        {animationCards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            className="cursor-pointer"
            style={{ animationDelay: `${card.delay}s` }}
          >
            <motion.div
              className={`h-full rounded-xl bg-gradient-to-br ${card.color} 
                         shadow-lg hover:shadow-2xl transition-shadow duration-300
                         text-white p-6 relative overflow-hidden`}
              style={{ minHeight: cardSize * 0.6 }}
            >
              {/* Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-full h-full bg-white rounded-full" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: card.delay
                  }}
                >
                  {card.icon}
                </motion.div>
                
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ fontSize: fontSize + 2 }}
                >
                  {card.title}
                </h3>
                
                <p 
                  className="text-sm opacity-90 leading-relaxed"
                  style={{ fontSize: fontSize - 2 }}
                >
                  {card.description}
                </p>
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {selectedCard === card.id && (
                  <motion.div
                    variants={expandedVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs opacity-75"
                    >
                      <p className="mb-2">Animation Properties:</p>
                      <ul className="space-y-1">
                        <li>• Duration: {2 + card.delay * 10}s</li>
                        <li>• Easing: Spring physics</li>
                        <li>• Stagger: {card.delay * 100}ms</li>
                        <li>• Performance: 60fps</li>
                      </ul>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                     text-white rounded-full font-medium shadow-lg hover:shadow-xl
                     transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? 'Collapse All' : 'Expand All'}
        </motion.button>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        className="mt-8 bg-gray-50 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">60</div>
            <div className="text-sm text-gray-600">FPS Target</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">2.3ms</div>
            <div className="text-sm text-gray-600">Avg Render</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-gray-600">Animations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">99.9%</div>
            <div className="text-sm text-gray-600">Smooth</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedAnimations;
