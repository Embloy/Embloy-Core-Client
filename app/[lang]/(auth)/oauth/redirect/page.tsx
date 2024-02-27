"use client"

import { getSession } from '@/lib/api/session';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react"
import { getDictionary } from '@/app/[lang]/dictionaries';

export default function OAuthRedirect({ params: { lang } }) {
  const refreshToken = useSearchParams().get('refresh_token');
  const [message, setMessage] = useState('Processing...');
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchUserAndDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);

      if (dict) {
        try {
          const session = await getSession(refreshToken ?? undefined);
          if (session.session) {
            setMessage(dict.auth.oauth.success);
          } else {
            setMessage(dict.auth.oauth.error);
          }
        } catch (error) {
          setMessage(dict.oauth.errorOccured.replace('{error}', error.message));
        }
      }
    };

    fetchUserAndDictionary();
  }, [refreshToken, lang]);

  return <div>{message}</div>;
}
