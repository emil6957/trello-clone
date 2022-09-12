/* eslint-disable max-len */
/* eslint-disable no-useless-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

/* To do in here change the DND to work from the lists state so that when index is changed it changes in the state
first then can be pushed up to the database should merge the 2nd and 3rd useeffect to have the list initially with cards
and then also change the listelements renendering so that it loads the cards from the state rather than from DB each time */

/* Need to change the way i render the cards in at first in the useeffect */

import {
    collection,
    getFirestore,
    doc,
    getDocs,
    getDoc,
    where,
    query,
    onSnapshot,
    limit,
    addDoc,
    deleteDoc,
    orderBy,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";
import AddNewList from "../AddNewList/AddNewList";
import List from "../List/List";
import "./InsideProject.css";

export default function InsideProject({ name, background }) {
    const [project, setProject] = useState();
    const [projectDocId, setDocId] = useState();
    const [loaded, setLoaded] = useState(false);
    const [addNewList, setAddNewList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newCardName, setNewCardName] = useState("");
    const [lists, setLists] = useState([]);

    const { id } = useParams();

    const db = getFirestore();
    const projectsRef = collection(db, "users/BUhOFZWdEbuKVU4FIRMg/projects");
    const listsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists`);

    useEffect(() => {
        const projectQuery = query(projectsRef, where("id", "==", id), limit(1));
        const unSubscribe = onSnapshot(projectQuery, (snapshot) => {
            setProject(snapshot.docs[0].data());
            setDocId(snapshot.docs[0].id);
            setLoaded(true);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        async function getCards(docId) {
            const cards = [];
            const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${docId}/cards`);
            const cardsQuery = query(cardsRef, orderBy("index", "asc"));
            const cardsSnapshot = await getDocs(cardsQuery);

            cardsSnapshot.docs.forEach((document) => {
                cards.push(document.data());
            });

            return cards;
        }

        const listsQuery = query(listsRef);
        const unSubscribe = onSnapshot(listsQuery, (snapshot) => {
            const listData = [];
            snapshot.docs.forEach((document) => {
                const list = document.data();
                list.docId = document.id;
                listData.push(list);
            });
            listData.forEach(async (list) => {
                // list.cards = await getCards(list.docId);
                list.cards = [];
                setLists((prevState) => [...prevState, list]);
            });
        });

        return () => unSubscribe();
    }, [projectDocId]);

    useEffect(() => {
        console.log(lists);
    }, [lists]);

    // useEffect(() => {
    //     const newListData = [];
    //     lists.forEach(async (list) => {
    //         const cardsData = [];
    //         const listQuery = query(listsRef, where("id", "==", list.id), limit(1));
    //         const listSnapshot = await getDocs(listQuery);
    //         const listDocId = await listSnapshot.docs[0].id;
    //         console.log("DOCID");
    //         console.log(listDocId);
    //         const cardsRef = await collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
    //         const cardsQuery = await query(cardsRef, orderBy("index", "asc"));
    //         const cardsSnapshot = await getDocs(cardsQuery);

    //         cardsSnapshot.docs.forEach((document) => {
    //             cardsData.push(document.data());
    //         });
    //         const newList = list;
    //         newList.cards = cardsData;
    //         newListData.push(newList);
    //     });
    //     setLists(newListData);
    //     console.log("LISTS");
    //     console.log(lists);
    // }, [projectDocId]);

    function toggleAddNewList() {
        setAddNewList((prevBool) => !prevBool);
    }

    function handleNewListName(e) {
        const { value } = e.target;
        setNewListName(value);
    }

    function handleNewCardName(e) {
        const { value } = e.target;
        setNewCardName(value);
    }

    function addList() {
        addDoc(listsRef, {
            name: newListName,
            id: nanoid(),
        });
        setNewListName("");
    }

    // Not needed
    function addCard(listDocId, cardIndex) {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        addDoc(cardsRef, {
            name: newCardName,
            id: nanoid(),
            index: cardIndex,
        });
        setNewCardName("");
    }

    function setListCards(listId, cards) {
        setLists((prevState) => {
            let newList;
            prevState.forEach((item) => {
                if (item.id === listId) {
                    newList = { ...item };
                    newList.cards = cards;
                }
            });
            return [...prevState.filter((item) => item.id !== listId), newList];
        });
    }

    async function reIndexCards(listDocId, docIndex) {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardsQuery = (cardsRef, orderBy("index", "asc"), where("index", ">", docIndex));
        const cardsArray = [];
        getDocs(cardsRef)
            .then((snapshot) => {
                snapshot.docs.forEach((document) => {
                    if (document.data().index > docIndex) {
                        cardsArray.push({ index: document.data().index, id: document.id });
                    }
                });
            })
            .then(() => {
                cardsArray.forEach((cardDoc) => {
                    const document = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDoc.id}`);
                    updateDoc(document, {
                        index: cardDoc.index - 1,
                    });
                });
            });
    }

    function deleteCard(listDocId, cardDocId) {
        const document = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDocId}`);
        getDoc(document)
            .then((snapshot) => {
                reIndexCards(listDocId, snapshot.data().index);
                deleteDoc(document);
            });
    }

    const listElements = lists.map((list) => (
        <Droppable key={list.id} droppableId={list.id}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <List
                        id={list.id}
                        name={list.name}
                        projectDocId={projectDocId}
                        newCardName={newCardName}
                        handleNewCardName={(e) => handleNewCardName(e)}
                        addCard={(listDocId, cardIndex) => addCard(listDocId, cardIndex)}
                        deleteCard={(listDocId, cardDocId) => deleteCard(listDocId, cardDocId)}
                        setListCards={(listId, cards) => setListCards(listId, cards)}
                        cards={list.cards}
                    />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    ));

    async function moveIndex(result) {
        if (result.source.index === result.destination.index) return;
        const listId = result.source.droppableId;
        const cardId = result.draggableId;
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        const [list] = lists.filter((item) => item.id === listId);
        const cards = Array.from(list.cards);
        const [removed] = cards.splice(startIndex, 1);
        cards.splice(endIndex, 0, removed);

        const [card] = cards.filter((item) => item.id === cardId);
        const otherCards = cards.filter((item) => item.id !== cardId);
        card.index = endIndex;
        const isCardMovingDown = startIndex < endIndex;
        otherCards.forEach((item) => {
            if (isCardMovingDown) {
                if (startIndex < item.index && item.index <= endIndex) {
                    item.index += -1;
                }
            } else if (startIndex > item.index && item.index >= endIndex) {
                item.index += 1;
            }
        });
        setLists((prevState) => {
            const newState = prevState.map((item) => (
                item.id === listId ? { ...item, cards } : item
            ));
            return newState;
        });

        const listQuery = query(listsRef, where("id", "==", result.source.droppableId, limit(1)));
        const listSnapshot = await getDocs(listQuery);
        const listDocId = listSnapshot.docs[0].id;
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardSnapshot = await getDocs(cardsRef);

        const batch = writeBatch(db);
        cardSnapshot.docs.forEach((document) => {
            const [newDoc] = cards.filter((item) => item.id === document.data().id);
            const docToUpdate = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${document.id}`);
            batch.update(docToUpdate, { ...newDoc });
        });

        await batch.commit();
    }

    async function moveBoards(result) {
        const destinationIndex = result.destination.index;
        const sourceListQuery = query(listsRef, where("id", "==", result.source.droppableId), limit(1));
        const destinationListQuery = query(listsRef, where("id", "==", result.destination.droppableId), limit(1));
        const sourceListSnapshot = await getDocs(sourceListQuery);
        const sourceListDocId = await sourceListSnapshot.docs[0].id;
        const sourceCardsRef = await collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${sourceListDocId}/cards`);
        const cardQuery = await query(sourceCardsRef, where("id", "==", result.draggableId, limit(1)));
        const cardQuerySnapshot = await getDocs(cardQuery);
        const cardId = await cardQuerySnapshot.docs[0].id;
        const cardData = { ...cardQuerySnapshot.docs[0].data() };
        const cardDoc = await doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${sourceListDocId}/cards/${cardId}`);
        deleteDoc(cardDoc);

        const destinationListSnapshot = await getDocs(destinationListQuery);
        const destinationListDocId = destinationListSnapshot.docs[0].id;
        const destinationCardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${destinationListDocId}/cards`);
        const destinationCardToIncreaseQuery = query(destinationCardsRef, where("index", ">=", destinationIndex));
        const destinationCardToIncreaseSnapshot = await getDocs(destinationCardToIncreaseQuery);
        const cardsToIncrease = [];

        destinationCardToIncreaseSnapshot.docs.forEach((document) => {
            cardsToIncrease.push({ id: document.id, index: document.data().index });
        });

        cardsToIncrease.forEach((cardToIncrease) => {
            const cardToIncreaseDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${destinationListDocId}/cards/${cardToIncrease.id}`);
            updateDoc(cardToIncreaseDoc, {
                index: cardToIncrease.index + 1,
            });
        });

        addDoc(destinationCardsRef, {
            ...cardData,
            index: destinationIndex,
        });
    }

    function handleDragEnd(result) {
        if (!result.destination) return;
        if (result.destination.droppableId === result.source.droppableId) {
            moveIndex(result);
        } else {
            moveBoards(result);
        }
    }

    return (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
            <div style={{ background: loaded && project.background }} className="inside-project">
                {listElements}
                <AddNewList
                    addNewList={addNewList}
                    newListName={newListName}
                    handleNewListName={(e) => handleNewListName(e)}
                    addList={() => addList()}
                    toggleAddNewList={() => toggleAddNewList()}
                />
            </div>
        </DragDropContext>
    );
}
