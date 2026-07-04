'use client'

import { hashEmail } from '@/lib/utils';
import { useState } from 'react';

type SubscriptionMessage = { type: 'success' | 'error'; text: string } | null;

export function useNewsletterSubscription() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<SubscriptionMessage>(null);

    const submit = async (email: string, source: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

        if (!isValidEmail) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return false;
        }

        setIsSubmitting(true);
        try {
            await hashEmail(normalizedEmail);
            setMessage({ type: 'success', text: 'Subscribed successfully. Check your inbox for updates.' });
            return true;
        } catch {
            setMessage({ type: 'error', text: 'Could not subscribe right now. Please try again.' });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        message,
        setMessage,
        submit,
    };
}
