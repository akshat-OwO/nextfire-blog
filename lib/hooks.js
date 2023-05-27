import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { doc, getFirestore, onSnapshot  } from "firebase/firestore";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            const ref = doc(getFirestore(), 'users', user.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }
    }, [user]);

    return {user, username};
}