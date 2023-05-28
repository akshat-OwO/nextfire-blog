import MetaTags from '@/components/Metatags';
import PostFeed from '@/components/PostFeed';
import UserProfile from '@/components/UserProfile';
import { getUserWithUsername, postToJSON } from '@/lib/firebase';
import {
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    where,
} from 'firebase/firestore';

export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <MetaTags title='NXT-FIRE | user page' />
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
