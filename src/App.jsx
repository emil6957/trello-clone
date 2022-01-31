import { React, useEffect, useState } from "react";
import {
    Route,
    Routes,
    useNavigate,
    Link,
    useLocation,
} from "react-router-dom";
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
import Main from "./Components/Main/Main";

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
    const navigate = useNavigate();

    initializeApp(firebaseConfig);

    async function signIn() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
        await setCurrentUser(getAuth().currentUser);
        await navigate("/");
    }

    function signOutUser() {
        signOut(getAuth());
        setCurrentUser(null);
    }

    const location = useLocation();
    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            setCurrentUser(user);
            if (user) {
                if (location.pathname === "/get-started") {
                    navigate("/");
                }
            } else {
                navigate("/get-started");
            }
        });
    }, []);

    return (
        <div className="App">
            <Header
                currentUser={currentUser}
                signIn={() => signIn()}
                signOutUser={() => signOutUser()}
            />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/get-started" element={<GetStarted signIn={() => signIn()} />} />
            </Routes>
        </div>
    );
}
