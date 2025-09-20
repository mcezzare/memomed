"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const ServiceWorkerRegistrar = () => {
    const { toast } = useToast();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                        toast({
                            title: 'Offline mode disabled',
                            description: 'Could not register service worker for offline notifications.',
                            variant: 'destructive'
                        });
                    });
            });
        }
    }, [toast]);

    return null;
}
