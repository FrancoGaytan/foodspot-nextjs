import { redirect } from 'next/navigation';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home(props: HomePageProps): Promise<React.ReactNode> {
  const lang = (await props.params).lang;
  redirect(`/${lang}/eventHome`);
}
