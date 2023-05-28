import AuthCheck from '@/components/AuthCheck';
import PostFeed from '@/components/PostFeed';
import { UserContext } from '@/lib/context';
import { auth } from '@/lib/firebase';
import {
    collection,
    doc,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { toast } from 'react-hot-toast';

export default function AdminPostsPage({}) {
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const ref = collection(
        getFirestore(),
        'users',
        auth.currentUser.uid,
        'posts'
    );
    const postQuery = query(ref, orderBy('createdAt'));

    const [querySnapshot] = useCollection(postQuery);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: true,
            content: '# hello world',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);
        toast.success('Post created!');

        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article!"
                className=""
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}
