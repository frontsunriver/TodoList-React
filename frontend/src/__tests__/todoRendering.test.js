import * as React from "react";
// import { rest } from "msw";
// import { setupServer } from "msw/node";
// const { v4: generateId } = require("uuid");
import { act } from 'react-dom/test-utils';
import axios from "axios";
import { fireEvent, render, screen, container } from "@testing-library/react";
import {
  getByRole,
  getByText,
  findByText,
  getByPlaceholderText,
  getByLabelText
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Todos from "../components/Todos";

beforeAll(() => {});
afterEach(() => {});
afterAll(() => {});

jest.mock("axios");

test("todos scrolling starting #2", async () => {
  const todoRes = [
    { id: "1111", dueDate: "2020-01-01", todoText: "test HogeHoge todo" },
  ];
  const resp = { data: todoRes };
  axios.get.mockResolvedValue(resp);
  axios.post.mockResolvedValue(resp);

  const { getByTestId } = render(<Todos pageLimit="1" hasMore={true} />);

  await screen.getByText("Loading... Please scroll the bar");
  expect(screen.getByRole("loadingStatus")).not.toHaveTextContent("Nothing more to show")

});

test("todos scrolling over #3", async () => {
  const todoRes = [
    { id: "1111", dueDate: "2020-01-01", todoText: "todo Past #1" },
    { id: "2222", dueDate: "2020-01-01", todoText: "todo Past #2" }
  ];
  const resp = { data: todoRes };
  axios.get.mockResolvedValue(resp);
  axios.post.mockResolvedValue(resp);

  render(<Todos pageLimit="1" hasMore={false} />);

  expect(screen.getByRole("loadingStatus")).toHaveTextContent("Nothing more to show")
  expect(screen.getByRole("loadingStatus")).not.toHaveTextContent("Loading... Please scroll the bar")
  // await screen.getByText('Nothing more to show')

  fireEvent.scroll(window, { target: { scrollY: 800 } });

  await screen.getByText("Nothing more to show");
  await screen.getByText("todo Past #1");
  await screen.getByText("todo Past #2");
  screen.debug()
  //expect(screen.getByRole("test-contents")).toHaveTextContent("test HogeHoge todo")

});


test("todos filter only past when checked #4", async () => {
  const todoRes = [
    { id: "1111", dueDate: "1900-01-01", todoText: "todo Past #1" },
    { id: "2222", dueDate: "2020-01-01", todoText: "todo Past #2" },
    { id: "3333", dueDate: "2050-02-01", todoText: "todo Future #3" }
  ];
  const resp = { data: todoRes };
  axios.get.mockResolvedValue(resp);
  axios.post.mockResolvedValue(resp);

  const {getByTestId} = render(<Todos pageLimit="1" hasMore={false} />);

  expect(screen.getByRole("loadingStatus")).toHaveTextContent("Nothing more to show")

  const checkboxEl = await screen.getByTestId('todo-checkbox') 
  await userEvent.click(checkboxEl)
  
  // await screen.getByText('Nothing more to show')

  // const addButton = getByTestId("add-todo-test");
  // const todoText = getByTestId("todo-text");
  // const todoDueDate = getByTestId("todo-duedate");

  // fireEvent.change(todoText, { target: { value: "todoTextTestTestTest" } });
  // fireEvent.change(todoDueDate, { target: { value: "2021-08-01" } });
  // fireEvent.click(addButton);

  fireEvent.scroll(window, { target: { scrollY: 800 } });
  
  await screen.getByText("Nothing more to show");
  expect(screen.getByText("todo Past #1")).toBeTruthy();
  expect(screen.getByText("todo Past #2")).toBeTruthy();
  expect(screen.queryByText("todo Future #2")).not.toBeInTheDocument()
  

});


test("adding add to do", async () => {
  const todoRes = [
    { id: "1111", dueDate: "1900-01-01", todoText: "todo Past #1" },
    { id: "2222", dueDate: "2020-01-01", todoText: "todo Past #2" },
    { id: "3333", dueDate: "2050-02-01", todoText: "todo Future #3" }
  ];
  const resp = { data: todoRes };
  axios.get.mockResolvedValue(resp);

  const todoRes2 = [
    { id: "4444", dueDate: "1900-01-01", todoText: "todo Past #4" , deadLineOver: "mock" }
  ];
  const resp2 = { data: todoRes2 };
  axios.post.mockResolvedValue(resp2);

  await act(async()=>{
    const { getByTestId } = render(<Todos pageLimit="1" hasMore={false} />);

    const addButton = getByTestId("add-todo-test");
    const todoText = getByTestId("todo-text");
    const todoDueDate = getByTestId("todo-duedate");
  
    fireEvent.change(todoText, { target: { value: "todoTextTestTestTest" } });
    fireEvent.change(todoDueDate, { target: { value: "2021-08-01" } });
    fireEvent.click(addButton);
  })

  screen.debug()
  //await screen.getByText("Nothing more to show");

 
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
