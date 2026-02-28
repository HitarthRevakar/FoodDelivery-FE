'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

export function CapacitorListeners() {
    useEffect(() => {
        let listenerHandle: any = null;

        const setupListener = async () => {
            try {
                await Keyboard.setResizeMode({ mode: KeyboardResize.None });
            } catch (e) {
                // Ignore if not running in a native Capacitor environment
            }

            try {
                listenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
                    // Go back if there is history, but don't close the entire app
                    if (canGoBack || window.history.length > 1) {
                        window.history.back();
                    }
                });
            } catch (e) {
                // Ignore if not running in a native Capacitor environment
            }
        };

        setupListener();

        // Swipe back gesture for Android/Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = () => {
            if (touchEndX === 0) return;

            const screenWidth = window.innerWidth;

            // Check if swiped from the left edge to the right OR right edge to the left
            if ((touchStartX < 50 && touchEndX > touchStartX + 60) ||
                (touchStartX > screenWidth - 50 && touchEndX < touchStartX - 60)) {
                window.history.back();
            }

            // Reset values
            touchStartX = 0;
            touchEndX = 0;
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return null;
}
