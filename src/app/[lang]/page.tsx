import Link from 'next/link';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home(props: HomePageProps): Promise<React.ReactNode> {
  //define which page is going to be the home
  const lang = (await props.params).lang;

  return (
    <div>
      <h1 className="text-2xl">Home page</h1>

      <Link href={`/${lang}/login`} className="text-blue-500">
        Login
      </Link>
    </div>
  );
}
