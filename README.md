# Trollo

This project was an attempt at recreating a website with similar features to [https://trello.com](https://trello.com)

## Overview

### The challenge

Users should be able to:

- Be able to login with google and have data saved
- Create projects with image or colour backgrounds
- Be able to favourite projects and be able to see which projects where viewed most recently
- Be able to create, edit and delete lists/cards
- Be able to drag and drop cards into different lists
- Be notified of due dates of cards

### Screenshots

### Links

- Code URL: [https://github.com/emil6957/trello-clone](https://github.com/emil6957/trello-clone)
- Live site URL: TO BE DONE

## My process

### Built with

- React
- CSS
- Flexbox
- CSS grid
- Dynamic Routing
- Firebase
- [Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - A package for implementing drag and drop in react

### What i learned

In this project I learnt a lot about using a no SQL database with firebase and also using firebase for other things such as authentication with google.
I've also gotten a lot of practice with using react states and components in a lot bigger of a project.

Here is my code for signing in and out with google by using firebase authentication.
```js
import {
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";

const [currentUser, setCurrentUser] = useState();

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
```

### Useful links
