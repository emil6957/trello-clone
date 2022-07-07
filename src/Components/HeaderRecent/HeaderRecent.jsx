import React, { useState, useEffect } from "react";
import "./HeaderRecent.css";
import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from "firebase/firestore";

export default function HeaderRecent() {
    const [recentProjects, setRecentProjects] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const projectsRef = collection(db, "users/BUhOFZWdEbuKVU4FIRMg/projects");
        const recentProjectsQuery = query(projectsRef, orderBy("timestamp", "desc"));
        getDocs(recentProjectsQuery)
            .then((snapshot) => {
                const data = snapshot.docs.map((document) => ({
                    ...document.data(),
                }));
                setRecentProjects([data]);
            });
    }, []);

    useEffect(() => {
        console.log(recentProjects);
    }, [recentProjects]);

    return (
        <div />
    );
}
