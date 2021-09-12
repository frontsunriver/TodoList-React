import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import FormTest from "../components/FormTest";
import Todos from "../components/Todos";

const server = setupServer(
  rest.get("/greeting", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays greeting", async () => {
  const { getByTestId } = render(<Todos />);

  // const password = getByTestId("account-delete-password");
  const addButton = getByTestId("add-todo-test");
  // const submit = getByTestId("account-delete-submit");

  // fireEvent.change(password, { target: { value: "password" } });
  fireEvent.click(addButton);

  // const { todos } = render(<Todos />);

  // const addTestButton = todos("add-test-button");
  // fireEvent.click(addTestButton);
});
