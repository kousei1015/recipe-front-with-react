import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Create from "../src/routes/create/route.lazy";
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
import { vi } from "vitest";

const mockMutateAsync = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

vi.mock("../hooks/useQueryHooks", async () => {
  const actual = (await vi.importActual("../hooks/useQueryHooks")) as any;
  return {
    ...actual,
    usePostRecipe: vi.fn().mockImplementation(() => {
      return {
        mutateAsync: mockMutateAsync,
      };
    }),
  };
});

export const handlers = [
  http.post("http://localhost:3000/v1/recipes", () => {
    return HttpResponse.json(
      {
        id: 2,
        name: "test_name",
        process: "test_process",
        ingredients: [{ name: "test1", quantity: "100cc" }],
        cooking_time: 2,
        image_url: null,
      },
      { status: 201 }
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
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

const setupTestRouter = (initialEntries = ["/create"]) => {
  const rootRoute = createRootRoute();
  const createRecipeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/create",
    component: () => <Create />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([createRecipeRoute]),
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
  await screen.findByText("レシピ投稿画面");
  return {
    nameInput: screen.getByPlaceholderText("レシピのタイトルを入力して下さい"),
    instructionInput: screen.getByPlaceholderText("手順の内容を入力"),
    selectElement: screen.getByRole("combobox"),
    ingredientName: screen.getByPlaceholderText("材料の名前"),
    ingredientQuantity: screen.getByPlaceholderText("量"),
    submitButton: screen.getByText("送信"),
  };
};

describe("Create Component", () => {
  it("should render component", async () => {
    setupTestRouter();
    await getElements();
    expect(screen.getByText("レシピ投稿画面")).toBeInTheDocument();
  });

  it("should enable the submit button when all inputs are filled", async () => {
    const { router } = setupTestRouter();
    const {
      nameInput,
      instructionInput,
      selectElement,
      ingredientName,
      ingredientQuantity,
      submitButton,
    } = await getElements();

    await userEvent.type(nameInput, "test_name");
    await userEvent.type(instructionInput, "test_process");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.type(ingredientName, "test1");
    await userEvent.type(ingredientQuantity, "100cc");

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);
    await expect(router.state.location.pathname).toBe("/");
  });

  it("an error message appears when reqired field is empty", async () => {
    setupTestRouter();
    const { submitButton } = await getElements();

    await userEvent.click(submitButton);
    screen.getByText("レシピのタイトルを入力してください");
    screen.getByText("手順の内容を入力してください");
    screen.getByText("材料の量を入力してください");
    screen.getByText("材料の名前を入力してください");
  });

  it("an error message appears when filed's length is over", async () => {
    setupTestRouter();
    const {
      nameInput,
      instructionInput,
      ingredientName,
      ingredientQuantity,
      submitButton,
    } = await getElements();

    await userEvent.type(nameInput, getRepeatedString(31));
    await userEvent.type(instructionInput, getRepeatedString(201));
    await userEvent.type(ingredientName, getRepeatedString(21));
    await userEvent.type(ingredientQuantity, getRepeatedString(21));

    await userEvent.click(submitButton);
    screen.getByText("タイトルは30文字以内で入力してください");
    screen.getByText("手順は200文字以内で入力してください");
    screen.getByText("材料の名前は20字以内にしてください");
    screen.getByText("材料の量は20字以内にしてください");
  });
});
