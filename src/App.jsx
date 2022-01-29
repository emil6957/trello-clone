import { React, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";
import "./App.css";
import Header from "./Components/Header/Header";
import GetStarted from "./Components/GetStarted/GetStarted";

export default function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyAwGP-joybOGrcyahxFkuUvgpFo1ohf4wk",
        authDomain: "trelloclone-b1c89.firebaseapp.com",
        projectId: "trelloclone-b1c89",
        storageBucket: "trelloclone-b1c89.appspot.com",
        messagingSenderId: "1041593361208",
        appId: "1:1041593361208:web:9a0c2a1dc41ffc6ca657cd",
    };

    const [currentUser, setCurrentUser] = useState();

    const app = initializeApp(firebaseConfig);

    async function signIn() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
        await setCurrentUser(getAuth().currentUser);
    }

    function signOutUser() {
        signOut(getAuth());
        setCurrentUser(null);
    }

    function initFirebaseAuth() {

    }

    useEffect(() => {
        setCurrentUser(getAuth().currentUser);
    }, []);

    return (
        <div className="App">
            <Header
                currentUser={currentUser}
                signIn={() => signIn()}
                signOutUser={() => signOutUser()}
            />
            <GetStarted signIn={() => signIn()} />
        </div>
    );
}
