import React from "react";
import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Index from "../src/routes/$recipeId/edit.lazy";
import {
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const handlers = [
  http.get("http://localhost:3000/v1/recipes/:recipeId.json", () => {
    return HttpResponse.json(
      {
        id: 1,
        recipe_name: "test_name",
        instructions: [
          {
            description: "process_test",
          },
        ],
        image_url: null,
        user_id: 2,
        user_name: "test_user",
        avatar_url: null,
        cooking_time: 2,
        ingredients: [
          {
            name: "test1",
            quantity: "100g",
          },
        ],
      },
      { status: 200 }
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  queryClient.clear();
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

function getRepeatedString(length) {
  const character = "a"; // 繰り返す文字
  return character.repeat(length); // 指定された長さ分繰り返す
}

const setupTestRouter = (initialEntries = ["/1/edit"]) => {
  const rootRoute = createRootRoute();
  const recipeEditRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/1/edit",
    component: () => <Index />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([recipeEditRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

const getElements = async () => {
  await screen.findByText("レシピ編集画面"); // この行で待機
  return {
    nameInput: await screen.findByPlaceholderText("レシピのタイトルを入力して下さい"),
    instructionInput: await screen.findByPlaceholderText("手順の内容を入力"),
    selectElement: await screen.findByRole("combobox"),
    ingredientName: await screen.findByPlaceholderText("材料の名前"),
    ingredientQuantity: await screen.findByPlaceholderText("量"),
    submitButton: await screen.findByText("送信"),
  };
};


describe("EditRecipe Component", () => {
  it("should render component", async () => {
    const { router } = setupTestRouter();

    expect(router.state.location.pathname).toBe("/1/edit");
    await screen.findByText("レシピ編集画面");
    screen.getByText("+ 材料を追加");
    await screen.findByDisplayValue("test_name");
    screen.getByDisplayValue("process_test");
    screen.getByDisplayValue("test1");
    screen.getByDisplayValue("100g");
  });
  it("an error message appears when reqired field is empty", async () => {
    setupTestRouter();
    const {
      nameInput,
      instructionInput,
      ingredientName,
      ingredientQuantity,
      submitButton,
    } = await getElements();

    await userEvent.clear(nameInput);
    await userEvent.clear(instructionInput);
    await userEvent.clear(ingredientName);
    await userEvent.clear(ingredientQuantity);

    await userEvent.click(submitButton);
    screen.getByText("レシピのタイトルを入力してください");
    screen.getByText("手順の内容を入力してください");
    screen.getByText("材料の量を入力してください");
    screen.getByText("材料の名前を入力してください");
  });
  it("an error message appears when field's length is over", async () => {
    setupTestRouter();
    const {
      nameInput,
      instructionInput,
      ingredientName,
      ingredientQuantity,
      submitButton,
    } = await getElements();

    await userEvent.type(nameInput, getRepeatedString(31));
    await userEvent.type(instructionInput, getRepeatedString(201)); // 最初のインストラクションフィールドを使用
    await userEvent.type(ingredientName, getRepeatedString(21)); // 最初の材料名フィールドを使用
    await userEvent.type(ingredientQuantity, getRepeatedString(21)); // 最初の材料量フィールドを使用

    await userEvent.click(submitButton);

    screen.getByText("タイトルは30文字以内で入力してください");
    screen.getByText("手順は200文字以内で入力してください");
    screen.getByText("材料の名前は20字以内にしてください");
    screen.getByText("材料の量は20字以内にしてください");
  });
});
