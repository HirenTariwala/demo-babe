import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import en from '../../resources/en.json';
import zh from '../../resources/zh.json';
import th from '../../resources/th.json';
import es from '../../resources/es.json';
import inLang from '../../resources/in.json';

const langObj: any = {
  en,
  es,
  zh,
  th,
  in: inLang,
};

const useMessage = () => {
  const [messages, setMessage] = useState();
  const locale = useLocale();
  const getTranslationMessage = async () => {
    try {
      setMessage(langObj[locale]);
    } catch (error) {
      notFound();
    }
  };

  useEffect(() => {
    getTranslationMessage();
  }, [locale]);

  return messages;
};

export default useMessage;
