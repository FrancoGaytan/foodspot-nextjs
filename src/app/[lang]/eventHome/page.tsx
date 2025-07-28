import PrivateFooter from '@components/macro/layout/PrivateFooter';
import PrivateHeader from '@components/macro/layout/PrivateHeader';
import EventHome from '@components/pages/EventHome';
import { getTranslations } from '@hooks/useTranslationServer';

interface EventHomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function EventHomePage(props: EventHomePageProps) {
  const lang = (await props.params).lang;
  const t = getTranslations(lang, 'eventHome');
  return (
    <>
      <PrivateHeader />
      <EventHome t={t} />
      {/* next */}
      <PrivateFooter />
    </>
  );
}
