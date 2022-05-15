import React, { useEffect, useState } from "react";
import { v4 } from 'uuid';
import Display from './Todo/Display';
import { TextField, Button, FormControlLabel, RadioGroup, Radio, FormControl } from "@mui/material";
import styled from "@emotion/styled";

const AlignCenter = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`

const H1 = styled.h1`
font-size: 72px;
background: -webkit-linear-gradient(#eee, #333);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-family: Bradley Hand;
`;

const Row = styled('div')`
  flex-direction: row;
  & > * {
      margin: 50px;
  }
`

export default function Todo() {
    const status = {
        showCompleted: 'showCompleted',
        showIncomplete: 'showIncomplete',
        showAll: 'showAll',
    }
    const [inputTodoItem, setInputTodoItem] = useState("");
    const [todoItem, setTodoItems] = useState([]);
    const [defaultAction, setDefaultAction] = useState(status.showIncomplete);
    const [db, setDb] = useState(null);
    const dbName = "TodoApp";
    const dbTable = "Todos";

    useEffect(() => {
        databaseSetup();
    }, [defaultAction])

    const databaseSetup = () => {
        const request = window.indexedDB.open(dbName, 2);
        request.onsuccess = function (event) {
            // get the db from the event. 
            const db = event.target.result;
            // store the db instance.
            setDb(db);
            const transaction = db.transaction([dbTable], "readwrite");
            const objectStore = transaction.objectStore(dbTable);
            var objects = objectStore.openCursor();
            const results = [];
            objects.onsuccess = event => {
                var cursor = event.target.result;
                if(cursor) {
                    const currentVal = cursor.value;
                    if(defaultAction === status.showIncomplete && !currentVal.isComplete) {
                        results.push(currentVal);
                    }
                    else if(defaultAction === status.showCompleted && currentVal.isComplete) {
                        results.push(currentVal);
                    }
                    else if(defaultAction === status.showAll) {
                        results.push(currentVal);
                    }
                    cursor.continue();
                } else {
                    setTodoItems(results.sort((a, b) => a.date - b.date));
                }
            }
        }
        request.onupgradeneeded = event => {
            const db = event.target.result;
            // Create an objectStore for this database
            db.createObjectStore(dbTable, { keyPath: "id" });
        }
    }

    const AddItemToStore = (item) => {
        const transaction = db.transaction([dbTable], "readwrite");
        transaction.objectStore(dbTable).add(item);
    }

    const UpdateItemToStore = (id) => {
        const store = db.transaction([dbTable], "readwrite").objectStore(dbTable);
        store.get(id).onsuccess = (event) => {
            const dbRecord = event.target.result;
            dbRecord.isComplete = !dbRecord.isComplete;
            store.put(dbRecord);
        };
    }

    const DeleteItemFromStore = (id) => {
        db.transaction([dbTable], "readwrite").objectStore(dbTable).delete(id).onsuccess = () => {
            DeleteTodo(id);
        }
    }

    const DeleteTodo = (id) => {
        setTodoItems(todoItem.filter(item => item.id !== id));
    }

   
    const AddTodo = () => {
        // if no value entered.
        if (!inputTodoItem) return;
        var item = {
            id: v4(),
            text: inputTodoItem,
            isComplete: false,
            date: new Date(),
        }
        setTodoItems([...todoItem, item]);
        setInputTodoItem("");
        AddItemToStore(item);
    }

    const toggleTodo = (id) => {
        setTodoItems(todoItem
            .map(item => item.id === id ? { ...item, isComplete: !item.isComplete } : item)
        );
        UpdateItemToStore(id);
    }
    return (
        <AlignCenter>
            <H1>Todo List</H1>
            <Row>
                <TextField label="Todo"
                    id="test"
                    variant="standard"
                    onChange={e => setInputTodoItem(e.target.value)}
                    value={inputTodoItem}
                />
                <Button variant="contained" onClick={() => AddTodo()}>Add</Button>
            </Row>
            <Row>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={defaultAction}
                        value={defaultAction}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel labelPlacement="top"
                            value={status.showIncomplete}
                            control={<Radio />}
                            label="Incomplete"
                            onClick={() => setDefaultAction(status.showIncomplete)} />
                        <FormControlLabel labelPlacement="top"
                            value={status.showCompleted}
                            control={<Radio />}
                            label="Completed"
                            onClick={() => setDefaultAction(status.showCompleted)} />
                        <FormControlLabel labelPlacement="top"
                            value={status.showAll}
                            control={<Radio />}
                            label="All"
                            onClick={() => setDefaultAction(status.showAll)} />
                    </RadioGroup>
                </FormControl>
            </Row>
            <Display todoItems={todoItem} toggleTodo={toggleTodo} handleDeleteTodo={DeleteItemFromStore} />
        </AlignCenter>
    )
}