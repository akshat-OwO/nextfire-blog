import MetaTags from '@/components/Metatags';
import PostContent from '@/components/PostContent';
import { getUserWithUsername, postToJSON } from '@/lib/firebase';
import {
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    query,
} from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

        post = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 100,
    };
}

export async function getStaticPaths() {
    const q = query(collectionGroup(getFirestore(), 'posts'), limit(20));
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        paths,
        fallback: 'blocking',
    };
}

export default function PostPage(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (
        <main className=''>
            <MetaTags title='NXT-FIRE | user post page' />
            <section>
                <PostContent post={post} />
            </section>

            <aside className='card'>
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>
            </aside>
        </main>
    );
}
