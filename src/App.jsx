/* eslint-disable consistent-return */
import { React, useEffect, useState } from "react";
import {
    Route,
    Routes,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    limit,
} from "firebase/firestore";
import "./App.css";
import Header from "./Components/Header/Header";
import GetStarted from "./Components/GetStarted/GetStarted";
import Main from "./Components/Main/Main";
import InsideProject from "./Components/InsideProject/InsideProject";

export default function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyAwGP-joybOGrcyahxFkuUvgpFo1ohf4wk",
        authDomain: "trelloclone-b1c89.firebaseapp.com",
        projectId: "trelloclone-b1c89",
        storageBucket: "trelloclone-b1c89.appspot.com",
        messagingSenderId: "1041593361208",
        appId: "1:1041593361208:web:9a0c2a1dc41ffc6ca657cd",
    };

    initializeApp(firebaseConfig);

    const db = getFirestore();
    const [currentUser, setCurrentUser] = useState();
    const [currentUserPath, setCurrentUserPath] = useState();
    const navigate = useNavigate();

    async function signIn() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
        await setCurrentUser(getAuth().currentUser);
        await navigate("/");
    }

    function signOutUser() {
        signOut(getAuth());
        setCurrentUser(null);
        localStorage.clear();
    }

    async function signInAsGuest() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, "guestAccounT1839@gmail.com", "01274aU1dw9Hak2Yg$aaw@");
        await setCurrentUser(auth.currentUser);
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

    useEffect(() => {
        if (currentUser === null || currentUser === undefined) return;
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where("uid", "==", currentUser.uid), limit(1));

        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            if (snapshot.docs.length === 0) return;
            const data = snapshot.docs[0].id;
            setCurrentUserPath(data);
            localStorage.setItem("currentUserPath", data);
        });

        return unsubscribe;
    }, [currentUser]);

    return (
        <div className="App">
            <Header
                currentUser={currentUser}
                currentUserPath={currentUserPath}
                signIn={() => signIn()}
                signOutUser={() => signOutUser()}
            />
            <Routes>
                <Route path="/*" element={<Main currentUserPath={currentUserPath} location="home" />} />
                <Route path="/get-started" element={<GetStarted signIn={() => signIn()} signInAsGuest={() => signInAsGuest()} />} />
                <Route path="/projects/*" element={<Main location="projects" currentUser={currentUser} currentUserPath={currentUserPath} />} />
                <Route path="/projects/:id" element={<InsideProject currentUser={currentUser} currentUserPath={currentUserPath} />} />
            </Routes>
        </div>
    );
}
