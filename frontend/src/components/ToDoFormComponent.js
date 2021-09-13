//import { makeStyles } from "@material-ui/core/styles";

//import useStyles from "../styles/styles";
import React from 'react'
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

export default function TodoForm(props) {
    const { classesStyles, 
        addTodo, 
        newTodoText, 
        setErrorText, 
        setTextErrorMsg, 
        setNewTodoText, 
        errorText, 
        textErrorMsg, 
        setErrorDate, 
        setDateErrorMsg, 
        errorDate,
        dateErrorMsg } = props
    return (
        <form className={classesStyles.form}>
            <Box display="flex">
              <Box flexGrow={2}>
                <TextField
                  name="todoText"
                  //fullWidth
                  className={classesStyles.textField}
                  placeholder="task .."
                  value={newTodoText.todoText}
                  getByLabelText
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      addTodo(newTodoText);
                    }
                  }}
                  onChange={(event) => {
                      setErrorText(false)
                      setTextErrorMsg('')
                      setNewTodoText({
                        ...newTodoText,
                        [event.target.name]: event.target.value,
                      })
                    }
                  }
                  inputProps={{ "data-testid": "todo-text" }}

                  error={errorText}
                  id="outlined-error-helper-text"
                  helperText={textErrorMsg}
                />

                <TextField
                  //fullWidth
                  className={classesStyles.textField}
                  name="dueDate"
                  placeholder="due date .."
                  type="date"
                  value={newTodoText.dueDate}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      addTodo(newTodoText);
                    }
                  }}
                  onChange={(event) => {
                    setErrorDate(false)
                    setDateErrorMsg('')
                    setNewTodoText({
                      ...newTodoText,
                      [event.target.name]: event.target.value,
                    })
                  }
                    
                  }
                  inputProps={{ "data-testid": "todo-duedate" }}

                  error = {errorDate}
                  id="outlined-error-helper-text"
                  helperText={dateErrorMsg}
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
    )
}