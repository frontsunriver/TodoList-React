import React from "react";
import {
  Button,
  Checkbox,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@material-ui/core";

import { DragDropContext, Draggable } from "react-beautiful-dnd";

export default function DragComponent(props) {
  const { elem, index, provided, classes } = props;
  const deleteTodo = (id) => {
    props.deleteTodo(id);
  };
  const toggleTodoCompleted = (id) => {
    // alert("toggle")
    // alert(id)
    props.toggleTodoCompleted(id);
  };
  return (
    <Draggable key={elem.id} draggableId={elem.id} index={index}>
      {(provided) => {
        //alert(JSON.stringify(elem),"elem");
        // alert(JSON.stringify(elem))

        return (
          // <Table>
          <TableBody
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
              <TableCell>
                <Checkbox
                  checked={elem.completed}
                  name="finish"
                  onChange={() => toggleTodoCompleted(elem.id)}
                ></Checkbox>
              </TableCell>
              <TableCell
                className={elem.completed ? classes.todoTextCompleted : ""}
              >
                {elem.todoText}
              </TableCell>
              <TableCell
                className={elem.completed ? classes.todoTextCompleted : ""}
              >
                {elem.dueDate}
              </TableCell>
              <TableCell>
              <Button
                // className={classes.deleteTodo}
                // startIcon={<Icon>delete</Icon>}
                onClick={() => deleteTodo(elem.id)}
              >
                Delete
              </Button>
              </TableCell>

            </TableBody>
        );
      }}
    </Draggable>
  );
}
