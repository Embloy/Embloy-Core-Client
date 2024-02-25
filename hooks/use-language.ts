import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useLanguage() {
  const [cookies, setCookie, removeCookie] = useCookies(['lang']);
  const router = useRouter();

  const setLanguage = (lang) => {
    setCookie('lang', lang, { path: '/' });
  };

  useEffect(() => {
    if (cookies.lang) {
        router.refresh()
    } else {
      removeCookie('lang');
      router.refresh()
    }
  }, [cookies.lang]);

  return [cookies.lang, setLanguage];
}