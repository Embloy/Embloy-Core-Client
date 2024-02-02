"use client"

import { getCurrentUser } from '@/lib/api/session';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function OAuthRedirect() {
  const refreshToken = useSearchParams().get('refresh_token');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser(refreshToken ?? undefined);
      if (currentUser) {
        // Store the user data in the session
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        // Update the message
        setMessage('User fetched successfully. Please close this window.');
      }
    };

    fetchUser();
  }, [refreshToken]);

  return <div>{message}</div>;
}

export default OAuthRedirect;