import React from 'react';
import { List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Display({ todoItems, toggleTodo, handleDeleteTodo }) {
    return (
        <List dense sx={{ width: '100%', maxWidth: 240 }}>
            {
                todoItems.map(item => {
                    return (
                        <ListItem key={item.id}
                            secondaryAction={
                                <>
                                    <Checkbox
                                        checked={item.isComplete}
                                        onChange={() => toggleTodo(item.id)}
                                    />
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                            disablePadding
                        >
                            <ListItemText onClick={() => toggleTodo(item.id)} primary={item.text}></ListItemText>
                        </ListItem>
                    )
                })
            }
        </List>
    );
}