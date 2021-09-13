import useStyles from "../styles/styles";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Checkbox,
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  FormControlLabel,
  TextField,
  Grid,
} from "@material-ui/core";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InfiniteScroll from "react-infinite-scroll-component";
import DragComponent from "./DragComponent";


function Todos(props) {
  const classesStyles = useStyles;
  const [todos, setTodos] = useState([]);
  const [filteredTodosFlag, setFilteredTodosFlag] = useState(false);
  const [newTodoText, setNewTodoText] = useState({});
  const [hasMore, setHasMore] = useState(props.hasMore);
  const [page, setPage] = useState(0);
  const searchName = useRef();

  let URL;
  // if (process.env.NODE_ENV === "development") {
  //   console.log("props.hasMore" + props.hasMore)
  URL = "http://localhost:3010";
  // } else {
  //   URL = "http://localhost:80";
  // }

  const pageLimit = props.pageLimit;

  useEffect(() => {
    fetchDataInit();
  }, []);

  async function addTodo(text) {
    if (!text.todoText || !text.dueDate) {
      alert("validation enter task and duedate");
      return;
    }
    console.log("addTodo1");
    axios
      .post(`${URL}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // method: "POST",
        // body:JSON.stringify({ text }),
        text,
      })
      .then((response) => {
        console.log("addTodo2");
        return response.data;
      })
      .then((todo) => {
        console.log(
          "addTodo2<この要素１個だけ追加する＞" + JSON.stringify(todo)
        );
        todo.deadLineOver = true;
        setTodos([...todos, todo]);
        console.log("addTodo2<結果これで全部＞" + JSON.stringify(todos));
        //setNewTodoText({ todoText: "", dueDate: "",filtered: true });
      })
      .catch((error) => {
        console.log("add to do error" + error);
      })
      .finally(() => {
        console.log("add to do finally");
      });
  }

  function toggleTodoCompleted(id) {
    axios
      .put(`${URL}/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //method: "PUT",
        // body: JSON.stringify({
        //   completed: !todos.find((todo) => todo.id === id).completed,
        // }),
        completed: !todos.find((todo) => todo.id === id).completed,
      })
      .then(() => {
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
    axios
      .delete(`${URL}/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  }

  async function loadFunc(page = 0, limit = pageLimit) {
    setPage(page + 1);
    //setSearchPress(false);
    setTimeout(() => {
      //let searchKey = searchName.current.value
      fetchData(page + 1, limit); //, searchKey, '123');
    }, 1000);
  }

  function fetchDataInit(page, limit) {
    console.log("fetchDataInit!!!!");
    axios
      .get(`${URL}/getData`)
      .then((response) => {
        let _todos = response.data;
        console.log("_todos" + _todos);

        // when no data immediately finish
        if (_todos.length === 0) {
          console.log("fetchDataInit2");
          setHasMore(false);
          return;
        }
        //alert("todos init " +JSON.stringify(todos)+todos.length+"]")
        console.log("fetchDataInit" + JSON.stringify(_todos));
        console.log("hasMore" + hasMore);
        _todos.map((t) => (t.deadLineOver = true));
        setTodos(_todos);
      })
      .catch((error) => {
        console.log(error + "fetchDataInit error");
      })
      .finally(() => {
        console.log("fetchDataInit finally");
      });
  }

  function fetchData(page, limit) {
    axios
      .get(`${URL}/getData?count=` + page + "&limit=" + limit)
      .then((response) => response.data)
      .then((todoList) => {
        if (!(todoList.length > 0)) {
          setHasMore(false);
        }
      })
      .finally(() => {
        setHasMore(false);
      });
  }

  async function filterTaskUntilToday(event) {
    setFilteredTodosFlag(event.target.checked);
    if (event.target.checked) {
      //alert("checkbox is true")
      todos.map((elem) => {
        let dueDate = new Date(Date.parse(elem.dueDate));
        let nowDate = new Date(Date.now());
        console.log("dueDate" + dueDate);
        console.log("nowDate" + nowDate);

        let deadLineOver =
          new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
          ) <=
          new Date(
            nowDate.getFullYear(),
            nowDate.getMonth(),
            nowDate.getDate()
          );
        console.log("deadlineover=========" + deadLineOver);
        console.log("deadlineover=========" + deadLineOver);
        console.log("deadlineover=========" + deadLineOver);
        // deadline is over or today
        if (deadLineOver) {
          elem.deadLineOver = true;
          // still have some time until dead line
        } else {
          elem.deadLineOver = false;
        }
      });
      console.log(JSON.stringify(todos));
    } else {
      todos.map((elem) => (elem.deadLineOver = true));
      console.log(JSON.stringify(todos));
      setTodos(todos);
    }
  }

  // async function handleSearch(e) {
  //   e.preventDefault();
  //   var searchKey = searchName.current.value;
  //   setSearchPress(true);
  //   if (searchKey == "") {
  //     console.log("search Key false");
  //     setSearch(false);
  //   } else {
  //     console.log("search Key true");
  //     setSearch(true);
  //   }
  //   setHasMore(true);
  //   fetchData(0, pageLimit, searchKey, "123");
  //   // fetch("http://localhost:3001/getData?count=" + (page + 1) + "&limit=" + limit)
  //   // .then((response) => response.json())
  //   // .then((todoList) => {
  //   //   if(todoList.length > 0){
  //   //     const newTodo = todoList;
  //   //     setTodos((todos) => [...todos, ...newTodo])
  //   //   }else{
  //   //     setHasMore(false)
  //   //   }
  //   // });
  // }

  return (
    <InfiniteScroll
      dataLength={todos.length}
      next={() => loadFunc(page, pageLimit)}
      hasMore={hasMore}
      loader={
        <Container maxWidth="md">
          <h3 role="loadingStatus" data-testid="loadingStatus-test">
            Loading... Please scroll the bar
          </h3>
        </Container>
      }
      endMessage={
        <Container maxWidth="md">
          <h4 role="loadingStatus" data-testid="loadingStatus-test">
            {" "}
            Nothing more to show
          </h4>
        </Container>
      }
    >
      <Container maxWidth="md">
        <Grid container component="main">
          <Grid item xs={false} sm={4} md={7} >
            <Typography variant="h3" component="h1" gutterBottom>
              Todos
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} md={5} elevation={1} className="mt-3" >
            <TextField
                    //fullWidth
                    className={classesStyles.textField}
                    placeholder="search task"
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
                    className={classesStyles.addTodoButton}
                    startIcon={<Icon>search</Icon>}
                    onClick={() => addTodo(newTodoText)}
                    data-testid="add-todo-test"
                  >
                    Seach Tasks
                  </Button>
          </Grid>
        </Grid>
        
        
        <Paper className={classesStyles.addTodoContainer}>
          <form className={classesStyles.form}>
            <Box display="flex">
              <Box flexGrow={2}>
                <TextField
                  //fullWidth
                  className={classesStyles.textField}
                  placeholder="task .."
                  value={newTodoText.todoText}
                  getByLabelText
                  onChange={(event) =>
                    setNewTodoText({
                      ...newTodoText,
                      [event.target.name]: event.target.value,
                    })
                  }
                  inputProps={{ "data-testid": "todo-text" }}
                />

                <TextField
                  //fullWidth
                  className={classesStyles.textField}
                  placeholder="due date .."
                  type="date"
                  value={newTodoText.dueDate}
                  onChange={(event) =>
                    setNewTodoText({
                      ...newTodoText,
                      [event.target.name]: event.target.value,
                    })
                  }
                  inputProps={{ "data-testid": "todo-duedate" }}
                />
              </Box>
              <Button
                className={classesStyles.addTodoButton}
                startIcon={<Icon>add</Icon>}
                onClick={() => addTodo(newTodoText)}
                data-testid="add-todo-test"
              >
                Adds
              </Button>
            </Box>
          </form>
          <Box display="flex">
            <Box flexGrow={2}>
              <FormControlLabel
                label="Todo Checkbox"
                control={
                  <Checkbox
                    checked={filteredTodosFlag}
                    onClick={filterTaskUntilToday}
                    name="gilad"
                    data-testid="todo-checkbox"
                  />
                }
                label="filter only tasks until today's due"
              />
            </Box>
          </Box>
        </Paper>
       
        <DragDropContext onDragEnd={handleOnDragEnd} role="test-contents">
          <Droppable droppableId="character">
            {(provided) => (
              <div
                className="character"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.length > 0 && (
                  <div id>
                    {todos
                      .filter((elem) => {
                        console.log(
                          "filtered=======" +
                            JSON.stringify(elem) +
                            "過去だけ表示する"
                        );
                        return elem.deadLineOver;
                      })
                      .map((elem, index) => {
                        console.log(
                          JSON.stringify(elem) + "ここ表示されてほしいい!!!!!!!"
                        );
                        return (
                          <DragComponent
                            elem={elem}
                            index={index}
                            provided={provided}
                            classes={classesStyles}
                            deleteTodo={deleteTodo}
                          />
                          // <div id={index}>{JSON.stringify(elem)}</div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </InfiniteScroll>
  );
}

export default Todos;
