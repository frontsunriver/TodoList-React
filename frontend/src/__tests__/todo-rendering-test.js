import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
const { v4: generateId } = require("uuid");
import axios from "axios";
import { fireEvent, render, screen, container } from "@testing-library/react";
import {
  getByRole,
  getByText,
  findByText,
  getByPlaceholderText,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import FormTest from "../components/FormTest";
import Todos from "../components/Todos";
import App2 from "../components/FormTest";

beforeAll(() => {});
afterEach(() => {});
afterAll(() => {});

jest.mock("axios");

test("todos adding", async () => {
  const todoRes = [
    { id: "1111", dueDate: "2020-01-01", todoText: "test HogeHoge todo" },
  ];
  const resp = { data: todoRes };
  axios.get.mockResolvedValue(resp);
  axios.post.mockResolvedValue(resp);

  const { getByTestId } = render(<Todos pageLimit="1" hasMore={false} />);

  // const addButton = getByTestId("add-todo-test");
  // const todoText = getByTestId("todo-text");
  // const todoDueDate = getByTestId("todo-duedate");

  // fireEvent.change(todoText, { target: { value: "todoTextTestTestTest" } });
  // fireEvent.change(todoDueDate, { target: { value: "2021-08-01" } });

  fireEvent.scroll(window, { target: { scrollY: 800 } });

  // fireEvent.click(addButton);
  await screen.getByText("Nothing more to show");
  await screen.getByText("test HogeHoge todo");
});

// test("checked", () => {
//   const users = [
//     { id: "1111", dueDate: "2020-01-01", todoText: "test HogeHoge todo" },
//   ];
//   const resp = { data: users };
//   axios.get.mockResolvedValue(resp);
//   const { getByTestId } = render(<Todos pageLimit="1" hasMore="true" />);
//   const checkbox = getByTestId("checkbox");
//   const isChecked = checkbox.checked;
//   fireEvent.change(checkbox);
//   expect(checkbox.checked).toEqual(!isChecked);
// });
