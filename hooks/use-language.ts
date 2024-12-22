import { useCookies } from 'react-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useLanguage() {
  const [cookies, setCookie, removeCookie] = useCookies(['ep_lang']);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const setLanguage = (lang) => {
    setCookie('ep_lang', lang, { path: '/' });
  };

  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries());
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${pathName}?${queryString}`;

    if (cookies.ep_lang) {
      router.refresh();
      router.push(url);
    } else {
      removeCookie('ep_lang');
      router.refresh();
      router.push(url);
    }
  }, [cookies.ep_lang]);

  return [cookies.ep_lang || 'en-US', setLanguage];
}