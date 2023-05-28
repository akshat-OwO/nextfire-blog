import AuthCheck from '@/components/AuthCheck';
import { auth } from '@/lib/firebase';
import styles from '@/styles/Admin.module.css';
import {
    deleteDoc,
    doc,
    getFirestore,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function AdminEditPost({}) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = doc(
        getFirestore(),
        'users',
        auth.currentUser.uid,
        'posts',
        slug
    );
    const [post] = useDocumentDataOnce(postRef);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const {
        register,
        handleSubmit,
        formState,
        reset,
        watch,
        formState: { errors },
    } = useForm({ defaultValues, mode: 'onChange' });

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post was updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <textarea
                    name="content"
                    id="content"
                    {...register('content', {
                        maxLength: {
                            value: 20000,
                            message: 'content is too long',
                        },
                        minLength: {
                            value: 10,
                            message: 'content is too short',
                        },
                        required: {
                            value: true,
                            message: 'content is required',
                        },
                    })}
                ></textarea>

                <fieldset>
                    <input
                        className={styles.checkbox}
                        name="published"
                        type="checkbox"
                        {...register('published')}
                    />
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
