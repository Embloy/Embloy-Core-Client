"use client"

import { getSession } from '@/lib/api/session';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react"
import { getDictionary } from '@/app/[lang]/dictionaries';

export default function OAuthRedirect({ params: { lang } }) {
  const refreshToken = useSearchParams().get('refresh_token');
  const [message, setMessage] = useState('Processing...');
  
  useEffect(() => {
    const fetchUserAndDictionary = async () => {
      const dictionary = await getDictionary(lang);
      try {
        const session = await getSession(refreshToken ?? undefined);
        if (session.session) {
          setMessage(dictionary.auth.oauth.success);
        } else {
          setMessage(dictionary.auth.oauth.error);
        }
      } catch (error) {
        setMessage(dictionary.oauth.errorOccured.replace('{error}', error.message));
      }
    };

    fetchUserAndDictionary();
  }, [refreshToken, lang]);

  return <div>{message}</div>;
}
