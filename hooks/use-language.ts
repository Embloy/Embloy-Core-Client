import { useCookies } from 'react-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useLanguage() {
  const [cookies, setCookie, removeCookie] = useCookies(['lang']);
  const router = useRouter();
  const pathName = usePathname();

  const setLanguage = (lang) => {
    setCookie('lang', lang, { path: '/' });
  };

  useEffect(() => {
    if (cookies.lang) {
      router.refresh()
      router.push(pathName)
    } else {
      removeCookie('lang');
      router.refresh()
      router.push(pathName)
    }
  }, [cookies.lang]);

  return [cookies.lang || 'en-US', setLanguage];
}