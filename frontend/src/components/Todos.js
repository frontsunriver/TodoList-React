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
  let URL;
  if(process.env.NODE_ENV === "development") {
     console.log("here")
     URL = "http://localhost:3010"
  }else{
     URL = "http://localhost:80"
  }
  const pageLimit = 10;

  useEffect(() => {
    fetchDataInit();
  }, []);

  function addTodo(text) {
    if (!text.todoText || !text.dueDate) {
      alert("validation enter task and duedate");
      return;
    }
    console.log("addTodo");
    fetch(`${URL}`, {
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
        // if checkbox is on should be caliculate dealinecheck
        if(filteredTodosFlag){
           todo.deadLineOver = deadLineCheck(text.dueDate)
        }else{
           todo.deadLineOver = true;
        }
        setTodos([...todos, todo]);
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
    fetch(`${URL}/${id}`, {
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
    fetch(`${URL}/${id}`, {
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

  async function fetchDataInit(page, limit) {
    console.log("fetchDataInit");
    fetch(`${URL}/getData?count=` + 0)
      .then((response) => response.json())
      .then((_todos) => {
        // when no data immediately finish
        if (_todos.length === 0) {
          setHasMore(false);
          return;
        }
        _todos.map((t) => (t.deadLineOver = true));
        //alert("todos init " +JSON.stringify(todos)+todos.length+"]")
        console.log(JSON.stringify(_todos));
        setTodos(_todos);
        // setTodos((todos))
      })
      .catch((error) => {
        console.log(error + "fetchDataInit error");
      });
  }
  function fetchData(page, limit) {
    fetch(`${URL}/getData?count=` + page + "&limit=" + limit)
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

  function deadLineCheck(_dueDate){

    let dueDate = new Date(Date.parse(_dueDate));
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
    
    return deadLineOver
  }

  async function filterTaskUntilToday(event) {
    setFilteredTodosFlag(event.target.checked);
    if (event.target.checked) {
      //alert("checkbox is true")
      todos.map((elem) => {
    
        let deadLineOver = deadLineCheck(elem.dueDate)
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



  return (
    <InfiniteScroll
      dataLength={todos.length}
      next={() => loadFunc(page, pageLimit)}
      hasMore={hasMore}
      loader={
        <Container maxWidth="md">
          <h3>  Loading... Please scroll the bar </h3>
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
                         { 
                          console.log("filtered=======" +(elem.todoText)+":"+(elem.deadLineOver)+"過去だけ表示する");
                          return elem.deadLineOver
                         }
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
