import { auth, googleAuthProvider } from '@/lib/firebase';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import Image from 'next/image';

export default function EnterPage({}) {
    const user = null;
    const username = null;

    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

// sign-in with google button
const SignInButton = () => {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image src={'/google.png'} width={30} height={30} alt="google logo" /> Sign in with Google
        </button>
    );
};

// sign-out
const SignOutButton = () => {
    return <button onClick={() => signOut(auth)}>Sign Out</button>;
};

function UsernameForm() {
    return null;
}
