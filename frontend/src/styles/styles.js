import { makeStyles } from "@material-ui/core/styles";

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

  export default useStyles;