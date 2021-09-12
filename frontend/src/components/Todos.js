import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InfiniteScroll from "react-infinite-scroll-component";
import DragComponent from "./DragComponent";
import TrelloLike from "./TrelloLike";

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
  textField: {
    marginLeft: 10,
    marginRight: 10,
  },
  deleteTodo: {
    visibility: "hidden",
  },
});

function Todos() {
  const classesStyles = useStyles();
  const [todos, setTodos] = useState([]);
  const [filteredTodosFlag, setFilteredTodosFlag] = useState(false);
  const [newTodoText, setNewTodoText] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const searchName = useRef();

  console.log("process.env" + JSON.stringify(process.env));
  const pageLimit = 10;

  useEffect(() => {
    fetchDataInit();
  }, []);

  function addTodo(text) {
    if (!text.todoText || !text.dueDate) {
      alert("validation enter task and duedate");
      return;
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
        todo.deadLineOver = false;
        setTodos([...todos, todo]);
        //setNewTodoText({ todoText: "", dueDate: "",filtered: true });
      })
      .catch((error) => {});
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

  async function loadFunc(page = 0, limit = pageLimit) {
    setPage(page + 1);
    //setSearchPress(false);
    setTimeout(() => {
      //let searchKey = searchName.current.value
      fetchData(page + 1, limit); //, searchKey, '123');
    }, 1000);
  }

  function fetchDataInit(page, limit) {
    fetch("http://localhost:3010/getData?count=" + 0)
      .then((response) => response.json())
      .then((_todos) => {
        // when no data immediately finish
        if (_todos.length === 0) {
          setHasMore(false);
          return;
        }
        _todos.map((t) => (t.deadLineOver = false));
        //alert("todos init " +JSON.stringify(todos)+todos.length+"]")
        console.log(JSON.stringify(_todos));
        setTodos(_todos);
        // setTodos((todos))
      });
  }
  function fetchData(page, limit) {
    fetch("http://localhost:3010/getData?count=" + page + "&limit=" + limit)
      .then((response) => response.json())
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
        console.log("dueDate" + dueDate.getMonth());
        console.log("nowDate" + nowDate.getMonth());

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
        console.log("deadlineover" + deadLineOver);
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

  async function handleSearch(e) {
    e.preventDefault();
    var searchKey = searchName.current.value;
    setSearchPress(true);
    if (searchKey == "") {
      console.log("search Key false");
      setSearch(false);
    } else {
      console.log("search Key true");
      setSearch(true);
    }
    setHasMore(true);
    fetchData(0, pageLimit, searchKey, "123");
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
      loader={
        <Container maxWidth="md">
          <h3> {todos.length} Loading... Please scroll the bar </h3>
        </Container>
      }
      endMessage={
        <Container maxWidth="md">
          <h4>Nothing more to show</h4>
        </Container>
      }
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Todos
        </Typography>
        <Paper className={classesStyles.addTodoContainer}>
          <form className={classesStyles.form}>
            <Box display="flex">
              <Box flexGrow={2}>
                <TextField
                  //fullWidth
                  className={classesStyles.textField}
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
                  inputProps={{ "data-testid": "todo-text" }}
                />

                <TextField
                  //fullWidth
                  className={classesStyles.textField}
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
                  inputProps={{ "data-testid": "todo-duedate" }}
                />
              </Box>
              <Button
                className={classesStyles.addTodoButton}
                startIcon={<Icon>add</Icon>}
                onClick={() => addTodo(newTodoText)}
                disabled={!newTodoText.dueDate || !newTodoText.todoText}
                data-testid="add-todo-test"
              >
                Adds
              </Button>
            </Box>
          </form>
          <FormControlLabel
            control={
              <Checkbox
                checked={filteredTodosFlag}
                onClick={filterTaskUntilToday}
                name="gilad"
              />
            }
            label="filter only tasks until today's due"
          />
        </Paper>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.length > 0 && (
                  <div>
                    {todos
                      .filter(
                        (elem) =>
                          //console.log("filtered=======" +(elem.todoText)+":"+(elem.deadLineOver)+"過去だけ表示する");
                          elem.deadLineOver
                      )
                      .map((elem, index) => {
                        return (
                          <DragComponent
                            elem={elem}
                            index={index}
                            provided={provided}
                            classes={classesStyles}
                            deleteTodo={deleteTodo}
                            toggleTodoCompleted={toggleTodoCompleted}
                          />
                          // <div>{JSON.stringify(elem)}</div>
                        );
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
