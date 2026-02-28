'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallBanner() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if iOS
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
        const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|opios|mercury/i.test(navigator.userAgent)
        setIsIOS(ios && isSafari)

        // For iOS — show instruction banner if not installed
        if (ios && isSafari) {
            const dismissed = localStorage.getItem('pwa-install-dismissed')
            if (!dismissed) {
                setIsVisible(true)
            }
            return
        }

        // For Android/Chrome — listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e as BeforeInstallPromptEvent)
            const dismissed = localStorage.getItem('pwa-install-dismissed')
            if (!dismissed) {
                setIsVisible(true)
            }
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!installPrompt) return
        await installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice
        if (outcome === 'accepted') {
            setIsVisible(false)
            setInstallPrompt(null)
        }
    }

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', '1')
        setIsVisible(false)
    }

    if (isInstalled || !isVisible) return null

    return (
        <div className="fixed bottom-20 left-3 right-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div
                className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)' }}
            >
                {/* App Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-lg">
                    <span className="text-xl">🍔</span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Install Food App</p>
                    {isIOS ? (
                        <p className="text-xs text-white/60 leading-snug">
                            Tap <span className="font-medium text-white/80">Share</span> then{' '}
                            <span className="font-medium text-white/80">Add to Home Screen</span>
                        </p>
                    ) : (
                        <p className="text-xs text-white/60">Install for a faster, app-like experience</p>
                    )}
                </div>

                {/* Actions */}
                {!isIOS && (
                    <button
                        onClick={handleInstall}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all active:scale-95"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Install
                    </button>
                )}

                <button
                    onClick={handleDismiss}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/70"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
