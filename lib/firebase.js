import { initializeApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider  } from 'firebase/auth';
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyDKVvyY97U7AyrG-OFwOPeOC6IDIZvu9og',
    authDomain: 'next-fire-a91c0.firebaseapp.com',
    projectId: 'next-fire-a91c0',
    storageBucket: 'next-fire-a91c0.appspot.com',
    messagingSenderId: '806086432205',
    appId: '1:806086432205:web:84bc6fe38907250f28a084',
    measurementId: 'G-6YRP816YM4',
};


const createFirebaseApp = (config) => {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

// auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// firestore exports
export const firestore = getFirestore(firebaseApp);

// storage exports
export const storage = getStorage(firebaseApp);