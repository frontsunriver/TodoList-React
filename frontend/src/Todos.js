import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from "@material-ui/core";

import { Form, Col, Row } from 'react-bootstrap';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InfiniteScroll from 'react-infinite-scroll-component';
import DragComponent from "./DragComponent";

const useStyles = makeStyles((theme) => ({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
    },
  },
}));

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(false)
  const [searchPress, setSearchPress] = useState(false);
  const searchName = useRef();

  const pageLimit = 20;
  useEffect(() => {
    fetch("http://localhost:3001/getData?count=" + 0 + "&limit=" + pageLimit)
      .then((response) => response.json())
      .then((todos) => {
        setTodos(todos);
      });
  }, [setTodos]);

  function addTodo(text) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => {
        return response.json();
      })
      .then((todo) => {
        setTodos([...todos, todo]);
        setNewTodoText({ todoText: "", dueDate: "" });
      }).catch((error) => {
      });
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  }

  async function loadFunc(page, limit=20){
    setPage(page+1);
    setSearchPress(false);
    // setTimeout(() => {
      var searchKey = searchName.current.value
      fetchData(page + 1, limit, searchKey, '123');
      // fetch("http://localhost:3001/getData?count=" + (page + 1) + "&limit=" + limit)
      // .then((response) => response.json())
      // .then((todoList) => {
      //   if(todoList.length > 0){
      //     const newTodo = todoList;
      //     setTodos((todos) => [...todos, ...newTodo])
      //   }else{
      //     setHasMore(false)
      //   }
      // });
    // }, 1000);
  }

  function fetchData(page, limit, searchName, searchDate){
    fetch("http://localhost:3001/getData?count=" + page + "&limit=" + limit + "&searchName=" + searchName + "&searchDate = " + searchDate)
      .then((response) => response.json())
      .then((todoList) => {
        if(todoList.length > 0){
          const newTodo = todoList;
          if(search){
            console.log("--------------------search ture")
            setTodos(newTodo)
          }else if(searchPress){
            setTodos(newTodo)
          }else{
            console.log("----------------------------------------------------search false")
            setTodos((todos) => [...todos, ...newTodo])
          }
        }else{
          setHasMore(false)
        }
      });
  }

  async function handleSearch(e){
    e.preventDefault();
    var searchKey = searchName.current.value
    setSearchPress(true)
    if(searchKey == ''){
      console.log("search Key false")
      setSearch(false)
    }else{
      console.log("search Key true")
      setSearch(true)
    }
    setHasMore(true)
    fetchData(0, pageLimit, searchKey, '123');
      // fetch("http://localhost:3001/getData?count=" + (page + 1) + "&limit=" + limit)
      // .then((response) => response.json())
      // .then((todoList) => {
      //   if(todoList.length > 0){
      //     const newTodo = todoList;
      //     setTodos((todos) => [...todos, ...newTodo])
      //   }else{
      //     setHasMore(false)
      //   }
      // });
  }

  return (
    <InfiniteScroll
      dataLength={todos.length}
      next={() => loadFunc(page, pageLimit)}
      hasMore={hasMore}
      loader={<Container maxWidth="md"><h3> Loading...</h3></Container>}
      endMessage={<Container maxWidth="md"><h4>Nothing more to show</h4></Container>}
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Todos
        </Typography>
        <Paper className={classes.addTodoContainer}>
          <Form onSubmit={handleSearch}>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Col sm="3">
                <Form.Control type="text" ref={searchName}/>
              </Col>
            </Form.Group>
          </Form>
        </Paper>
        <Paper className={classes.addTodoContainer}>
          <form className={classes.root}>
            <TextField
              fullWidth
              placeholder="task .."
              name="todoText"
              value={newTodoText.todoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) =>
                setNewTodoText({
                  ...newTodoText,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <TextField
              fullWidth
              placeholder="due date .."
              name="dueDate"
              value={newTodoText.dueDate}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) =>
                setNewTodoText({
                  ...newTodoText,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <Button
              className={classes.addTodoButton}
              startIcon={<Icon>add</Icon>}
              onClick={() => addTodo(newTodoText)}
            >
              Adds
            </Button>
          </form>
        </Paper>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {todos.length > 0 && (
                  <div>
                    {todos.map((elem, index) => {
                      return(
                        <DragComponent 
                          elem={elem} 
                          index={index} 
                          provided={provided} 
                          classes={classes} 
                          deleteTodo={deleteTodo} 
                          toggleTodoCompleted={toggleTodoCompleted}/>
                      )
                    })}
                  </div>
                )}
              </ul>
            )}
            </Droppable>
          </DragDropContext>
      </Container>
    </InfiniteScroll>
  );
}

export default Todos;
