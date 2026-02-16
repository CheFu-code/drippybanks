'use client'

import { db } from '@/config/firebaseConfig';
import { hashEmail } from '@/lib/utils';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
            const subscriberId = await hashEmail(normalizedEmail);
            const subscriberRef = doc(db, 'drippybanks-subscribers', subscriberId);
            const existingSubscriber = await getDoc(subscriberRef);

            if (existingSubscriber.exists() && existingSubscriber.data()?.isActive) {
                setMessage({ type: 'error', text: 'This email is already subscribed.' });
                return false;
            }

            await setDoc(
                subscriberRef,
                {
                    email: normalizedEmail,
                    subscribedAt: serverTimestamp(),
                    source,
                    isActive: true,
                },
                { merge: true },
            );

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
