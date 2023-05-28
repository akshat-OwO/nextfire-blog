import MetaTags from '@/components/Metatags';
import Link from 'next/link';

export default function NotFound({}) {
    return (
        <main>
        <MetaTags title='NXT-FIRE | page not found' />
            <h1>404 - That page does not seem to exist...</h1>
            <iframe
                src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
                width={480}
                height={362}
                frameborder="0"
                allowFullScreen
            ></iframe>
            <Link href="/">
                <button className="btn-blue">Go home</button>
            </Link>
        </main>
    );
}
