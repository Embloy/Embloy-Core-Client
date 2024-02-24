"use client"

import { getSession } from '@/lib/api/session';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function OAuthRedirect({ params: { lang } }) {
  const refreshToken = useSearchParams().get('refresh_token');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession(refreshToken ?? undefined);
        if (session.session) {
          setMessage('Authentication successful. Please close this window.');
        } else {
          setMessage('Authentication failed. Please close this window and try again.');
        }
      } catch (error) {
        setMessage(`An error occurred: ${error.message}. Please close this window and try again.`);
      }
    };

    fetchUser();
  }, [refreshToken]);

  return <div>{message}</div>;
}
