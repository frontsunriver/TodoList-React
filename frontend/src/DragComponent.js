import React from 'react';
import {
    Typography,
    Button,
    Icon,
    Box,
    Checkbox,
  } from "@material-ui/core";

import { Draggable } from 'react-beautiful-dnd';

export default function DragComponent(props) {
    const { elem, index, provided, classes } = props;
    const deleteTodo = (id) => {
        props.deleteTodo(id)
    }
    const toggleTodoCompleted = (id) => {
        props.toggleTodoCompleted(id)
    }
    return(
        <Draggable key={elem.id} draggableId={elem.id} index={index}>
            {(provided) => (
            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                className={classes.todoContainer}
                >
                <Checkbox
                    checked={elem.completed}
                    onChange={() => toggleTodoCompleted(elem.id)}
                ></Checkbox>
                <Box flexGrow={1}>
                    <Typography
                    className={elem.completed ? classes.todoTextCompleted : ""}
                    variant="body1"
                    >
                    {elem.todoText}
                    {":[dueDate]"}
                    {elem.dueDate}
                    </Typography>
                </Box>
                <Button
                    className={classes.deleteTodo}
                    startIcon={<Icon>delete</Icon>}
                    onClick={() => deleteTodo(elem.id)}
                >
                    Delete
                </Button>
                </Box>
            </li>
            )}
        </Draggable>
    )
}