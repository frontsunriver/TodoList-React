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
  TextField
} from "@material-ui/core";

import { Form, Col, Row } from 'react-bootstrap';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InfiniteScroll from 'react-infinite-scroll-component';
import DragComponent from "./DragComponent";

const useStyles = makeStyles({
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
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(false)
  const [searchPress, setSearchPress] = useState(false);
  const searchName = useRef();

  console.log("process.env" + JSON.stringify(process.env))
  const pageLimit = 1;
  // useEffect(() => {
  //   fetch("http://localhost:3010/getData?count=" + 0 + "&limit=" + pageLimit)
  //     .then((response) => response.json())
  //     .then((todos) => {
  //       setTodos(todos);
  //     });
  // }, [setTodos]);
 
　useEffect(()=>{
       fetchDataInit()
     },[setTodos]
  )
  function addTodo(text) {
   
    if(!text.todoText){
      alert("validation enter task")
      //return
    }
    fetch("http://localhost:3010/", {
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
    fetch(`http://localhost:3010/${id}`, {
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
    fetch(`http://localhost:3010/${id}`, {
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

  async function loadFunc(page=0, limit=pageLimit){
    //alert("loadFunc")
    setPage(page+1);
    setSearchPress(false);
    setTimeout(() =>{
      let searchKey = searchName.current.value
      fetchData(page + 1, limit, searchKey, '123');
    },1000)
  }

  function fetchDataInit(page, limit,){
    fetch("http://localhost:3010/getData?count=" + 0 )
    .then((response) => response.json())
    .then((todos) => {
        // when no data immediately finish
        if(todos.length ===0 ) {setHasMore(false)}
        setTodos((todos))
    })
  }
  function fetchData(page, limit, searchName, searchDate){
   // alert("fetchData"+"page"+page+"limit"+limit)
    
    fetch("http://localhost:3010/getData?count=" + page + "&limit=" + limit )
      .then((response) => response.json())
      .then((todoList) => {
        //alert(JSON.stringify(todoList))
        if(!(todoList.length > 0)){
          setHasMore(false)
        }
      }).finally(()=>{
        //alert("finally");
        setHasMore(false);
      }
      );
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
      loader={<Container maxWidth="md"><h3> {todos.length} Loading...</h3></Container>}
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
          <form className={classes.form}>
            <Box display="flex">
              <Box flexGrow={2}>
              
                <TextField
                  //fullWidth
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
                  //fullWidth
                  placeholder="due date .."
                  name="dueDate"
                  type="date"
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
              </Box>
              <Button
                className={classes.addTodoButton}
                startIcon={<Icon>add</Icon>}
                onClick={() => addTodo(newTodoText)}
              >
                Adds
              </Button>
            </Box>
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
