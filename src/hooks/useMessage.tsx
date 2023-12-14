import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

const useMessage = () => {
  const [messages, setMessage] = useState()
  const locale = useLocale();
  const getTranslationMessage= async () =>{
    try {
      (import(`../../resources/${locale}.json`)).then(r=> {
       setMessage(r.default)
      } )
     } catch (error) {
       notFound();
     }
  }

  useEffect(()=>{
    getTranslationMessage();
  },[locale]);
 
  return  messages ;
};

export default useMessage;