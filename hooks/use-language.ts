import { useCookies } from 'react-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useLanguage() {
  const [cookies, setCookie, removeCookie] = useCookies(['lang']);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const setLanguage = (lang) => {
    setCookie('lang', lang, { path: '/' });
  };

  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries());
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${pathName}?${queryString}`;

    if (cookies.lang) {
      router.refresh();
      router.push(url);
    } else {
      removeCookie('lang');
      router.refresh();
      router.push(url);
    }
  }, [cookies.lang]);

  return [cookies.lang || 'en-US', setLanguage];
}