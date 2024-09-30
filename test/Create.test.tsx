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
const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

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
    processInput: screen.getByPlaceholderText("レシピの作り方を書いて下さい"),
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
    expect(screen.getByText("送信")).toBeDisabled();
  });

  it("should enable the submit button when all inputs are filled", async () => {
    const { router } = setupTestRouter();
    const {
      nameInput,
      processInput,
      selectElement,
      ingredientName,
      ingredientQuantity,
      submitButton,
    } = await getElements();

    await userEvent.type(nameInput, "test_name");
    await userEvent.type(processInput, "test_process");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.type(ingredientName, "test1");
    await userEvent.type(ingredientQuantity, "100cc");

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);
    await expect(router.state.location.pathname).toBe("/");
  });

  it("button is disabled when input field is empty", async () => {
    setupTestRouter();
    const { submitButton } = await getElements();
    expect(submitButton).toBeDisabled();
  });

  it("an alert appears when ingredients name and quantity are empty", async () => {
    setupTestRouter();
    const { nameInput, processInput, selectElement, submitButton } = await getElements();

    await userEvent.type(nameInput, "test_name");
    await userEvent.type(processInput, "test_process");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("材料の名前と量を両方とも入力してください");
  });

  it("an alert appears when ingredients name is empty", async () => {
    setupTestRouter();
    const { nameInput, processInput, selectElement, ingredientQuantity, submitButton } = await getElements();

    await userEvent.type(nameInput, "test_name");
    await userEvent.type(processInput, "test_process");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.type(ingredientQuantity, "100cc");
    await userEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("材料の名前と量を両方とも入力してください");
  });

  it("an alert appears when ingredients quantity is empty", async () => {
    setupTestRouter();
    const { nameInput, processInput, selectElement, ingredientName, submitButton } = await getElements();

    await userEvent.type(nameInput, "test_name");
    await userEvent.type(processInput, "test_process");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.type(ingredientName, "test1");
    await userEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("材料の名前と量を両方とも入力してください");
  });
});
