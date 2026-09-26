import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Zap,
  Share,
  PlusSquare,
  Smartphone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const InstallAppPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service Worker registration skipped:', err);
        });
      });
    }

    // Check if already running as installed PWA standalone app
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIosDevice(isIos);

    // Check if user dismissed recently (24 hours)
    const lastDismissed = localStorage.getItem('techbazzar_install_dismissed');
    const isDismissedRecently = lastDismissed && (Date.now() - parseInt(lastDismissed, 10) < 24 * 60 * 60 * 1000);

    // Listen for Chrome/Android/Desktop install event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissedRecently && !isRunningStandalone) {
        setIsBannerVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS Safari: show prompt after 2 seconds if mobile and not dismissed
    if (isIos && !isRunningStandalone && !isDismissedRecently && window.innerWidth < 768) {
      const timer = setTimeout(() => {
        setIsBannerVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Custom event to trigger install anytime from menu
    const handleManualTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else if (isIos) {
        setIsIosModalOpen(true);
      } else {
        setIsBannerVisible(true);
      }
    };

    window.addEventListener('techbazzar:open-install-prompt', handleManualTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('techbazzar:open-install-prompt', handleManualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsBannerVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIosDevice) {
      setIsIosModalOpen(true);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install this app on your device:\n1. Tap the browser menu (⋮ or ⋯)\n2. Select "Install app" or "Add to Home screen"');
    }
  };

  const handleDismiss = () => {
    setIsBannerVisible(false);
    localStorage.setItem('techbazzar_install_dismissed', Date.now().toString());
  };

  // If already installed or banner dismissed, don't show floating banner
  if (isStandalone || (!isBannerVisible && !isIosModalOpen)) {
    return null;
  }

  return (
    <>
      {/* Floating Mobile Install App Banner */}
      {isBannerVisible && (
        <div className="md:hidden fixed top-2.5 inset-x-2.5 z-50 animate-fade-in">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white border border-cyan-500/40 shadow-2xl flex items-center justify-between gap-2.5 backdrop-blur-xl">
            {/* App Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/40 animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white tracking-tight truncate font-['Outfit']">
                  Install TechBazzar App
                </h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0">
                  FREE
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Fast 1-tap checkout & offline app access
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-glow-cyan active:scale-95 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>

              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Dismiss"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {isIosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-[10px] text-slate-500">Install in 3 easy steps</p>
                </div>
              </div>
              <button
                onClick={() => setIsIosModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Tap the Share Button</span>
                    <Share className="w-3.5 h-3.5 text-blue-500 inline" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Located in Safari's bottom toolbar on iPhone or top right on iPad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Select 'Add to Home Screen'</span>
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-500 inline" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scroll down through the share options menu to find it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Tap 'Add'</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 inline" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    In the top right corner. The TechBazzar app icon will now appear on your home screen!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsIosModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
