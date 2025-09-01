import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  isSupported: boolean;
}

const PWAManager: React.FC = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    isSupported: 'serviceWorker' in navigator
  });
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Responsive values with validation
  const fontSize = useResponsiveValue(16) || 16;
  
  // Ensure values are valid numbers
  const safeFontSize = typeof fontSize === 'number' && !isNaN(fontSize) ? fontSize : 16;

  useEffect(() => {
    // Check if PWA is already installed
    checkInstallationStatus();
    
    // Listen for online/offline events
    const handleOnline = () => setPwaStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setPwaStatus(prev => ({ ...prev, isInstalled: true }));
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    // Register service worker
    if (pwaStatus.isSupported) {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pwaStatus.isSupported]);

  const checkInstallationStatus = () => {
    // Check if running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setPwaStatus(prev => ({ ...prev, isInstalled: isStandalone }));
  };

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setPwaStatus(prev => ({ ...prev, hasUpdate: true }));
                setShowUpdatePrompt(true);
              }
            });
          }
        });

        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setPwaStatus(prev => ({ ...prev, hasUpdate: false }));
          setShowUpdatePrompt(false);
        });
        
        // Listen for service worker errors
        registration.addEventListener('error', (error) => {
          console.error('Service Worker error:', error);
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      // Continue without service worker
      setPwaStatus(prev => ({ ...prev, isSupported: false }));
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation rejected');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
    }
    setShowUpdatePrompt(false);
  };

  const sendNotification = async () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('React Responsive Easy', {
        body: 'Welcome to the enhanced PWA experience!',
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-72x72.png',
        tag: 'welcome'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification();
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification();
      }
    }
  };

  if (!pwaStatus.isSupported) {
    return null;
  }

  return (
    <>
      {/* PWA Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${pwaStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium">
              {pwaStatus.isOnline ? 'Online' : 'Offline'}
            </span>
            {pwaStatus.isInstalled && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PWA Installed</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {pwaStatus.hasUpdate && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleUpdate}
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                🔄 Update Available
              </motion.button>
            )}
            
            <button
              onClick={requestNotificationPermission}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              title="Enable notifications"
            >
              🔔
            </button>
          </div>
        </div>
      </motion.div>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Install App</h3>
                <p className="text-sm text-gray-600">
                  Install React Responsive Easy for a better experience
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Prompt */}
      <AnimatePresence>
        {showUpdatePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔄</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Update Available</h3>
                <p className="text-sm text-gray-600">
                  A new version is ready to install
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Update Now
                </button>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h2 
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
          style={{ fontSize: `${safeFontSize + 8}px` }}
        >
          Progressive Web App Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">Installable</h3>
            <p className="text-sm text-gray-600">
              Add to home screen for app-like experience
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-800 mb-2">Offline Ready</h3>
            <p className="text-sm text-gray-600">
              Works without internet connection
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Fast Loading</h3>
            <p className="text-sm text-gray-600">
              Cached resources for instant access
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-semibold text-gray-800 mb-2">Push Notifications</h3>
            <p className="text-sm text-gray-600">
              Stay updated with real-time alerts
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-800 mb-2">Auto Updates</h3>
            <p className="text-sm text-gray-600">
              Always get the latest version
            </p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
            <p className="text-sm text-gray-600">
              Optimized for speed and efficiency
            </p>
          </div>
        </div>

        {/* PWA Status */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">PWA Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${pwaStatus.isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="text-sm font-medium text-gray-700">Supported</div>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${pwaStatus.isInstalled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div className="text-sm font-medium text-gray-700">Installed</div>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${pwaStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="text-sm font-medium text-gray-700">Online</div>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${pwaStatus.hasUpdate ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <div className="text-sm font-medium text-gray-700">Updated</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PWAManager;
