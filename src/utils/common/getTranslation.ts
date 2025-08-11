import { locales } from '@localization/index';
import { getLocaleFromCookieServer } from '@utils/cookies/localeCookiesServer';

type TranslationNamespace = Record<string, any>;

interface TranslationResult<T> {
  t: T;
}

export async function getTranslation<T = TranslationNamespace>(namespace: string): Promise<TranslationResult<T>> {
  const lang = await getLocaleFromCookieServer();

  const translation = locales.find(locale => locale.id === lang)?.translation[namespace] ?? locales[0].translation[namespace];

  return {
    t: translation,
  };
}
