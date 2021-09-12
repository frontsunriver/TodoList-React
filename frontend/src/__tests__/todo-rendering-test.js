import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import FormTest from "../components/FormTest";
import Todos from "../components/Todos";

const server = setupServer(
  rest.post("/", (req, res, ctx) => {
    console.log("setUpServer post mock=============");
    return res(ctx.json({ todoText: "mock Response", dueDate: "2021-08-01" }));
  }),

  rest.get("/getData", (req, res, ctx) => {
    console.log("setUpServer get mock=================");
    console.log("req.params" + req.params);
    return res(
      ctx.json([{ todoText: "mock Response", dueDate: "2021-08-01" }])
    );
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("todos adding", async () => {
  const { getByTestId } = render(<Todos />);

  // const password = getByTestId("account-delete-password");
  const addButton = getByTestId("add-todo-test");
  const todoText = getByTestId("todo-text");
  const todoDueDate = getByTestId("todo-duedate");

  fireEvent.change(todoText, { target: { value: "todoTextTestTestTest" } });
  fireEvent.change(todoDueDate, { target: { value: "2021-08-01" } });

  fireEvent.click(addButton);

  await screen.findByRole("heading");

  // const { todos } = render(<Todos />);

  // const addTestButton = todos("add-test-button");
  // fireEvent.click(addTestButton);
});
