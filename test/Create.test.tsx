import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen, findByText } from "@testing-library/react";
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
  // Intercept "GET https://example.com/user" requests...
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

describe("Create Component", () => {
  it("should render component", async () => {
    const rootRoute = createRootRoute();
    const postRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create",
      component: () => <Create />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([postRoute]),
      history: createMemoryHistory({ initialEntries: ["/create"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await rendered.findByText("レシピ投稿画面");
    const nameInput =
      screen.getByPlaceholderText("レシピのタイトルを入力して下さい");
    await userEvent.type(nameInput, "test_name");
    const processInput =
      screen.getByPlaceholderText("レシピの作り方を書いて下さい");
    await userEvent.type(processInput, "test_process");
    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, "10分未満");
    const ingredientName = screen.getByPlaceholderText("材料の名前");
    await userEvent.type(ingredientName, "test1");
    const ingredientQuantity = screen.getByPlaceholderText("量");
    await userEvent.type(ingredientQuantity, "100cc");
    expect(screen.getByText("送信")).toBeEnabled();
    await userEvent.click(screen.getByText("送信"));
    await expect(router.state.location.pathname).toBe("/");
  });

  it("button is disable when input field is empty", async () => {
    const rootRoute = createRootRoute();
    const postRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create",
      component: () => <Create />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([postRoute]),
      history: createMemoryHistory({ initialEntries: ["/create"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await rendered.findByText("レシピ投稿画面");
    expect(screen.getByText("送信")).toBeDisabled();
  });
  it("an alert appears when ingredients name and quantity is empty", async () => {
    const rootRoute = createRootRoute();
    const postRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create",
      component: () => <Create />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([postRoute]),
      history: createMemoryHistory({ initialEntries: ["/create"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await rendered.findByText("レシピ投稿画面");
    await rendered.findByText("レシピ投稿画面");
    const nameInput =
      screen.getByPlaceholderText("レシピのタイトルを入力して下さい");
    await userEvent.type(nameInput, "test_name");
    const processInput =
      screen.getByPlaceholderText("レシピの作り方を書いて下さい");
    await userEvent.type(processInput, "test_process");
    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.click(screen.getByText("送信"));

    // 材料の名前と量、両方を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
  });
  it("an alert appears when ingredients name is empty", async () => {
    const rootRoute = createRootRoute();
    const postRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create",
      component: () => <Create />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([postRoute]),
      history: createMemoryHistory({ initialEntries: ["/create"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await rendered.findByText("レシピ投稿画面");
    await rendered.findByText("レシピ投稿画面");
    const nameInput =
      screen.getByPlaceholderText("レシピのタイトルを入力して下さい");
    await userEvent.type(nameInput, "test_name");
    const processInput =
      screen.getByPlaceholderText("レシピの作り方を書いて下さい");
    await userEvent.type(processInput, "test_process");
    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.click(screen.getByText("送信"));
    const ingredientQuantity = screen.getByPlaceholderText("量");
    await userEvent.type(ingredientQuantity, "100cc");

    // 材料の名前を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
  });
  it("an alert appears when ingredients quantity is empty", async () => {
    const rootRoute = createRootRoute();
    const postRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create",
      component: () => <Create />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([postRoute]),
      history: createMemoryHistory({ initialEntries: ["/create"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await rendered.findByText("レシピ投稿画面");
    await rendered.findByText("レシピ投稿画面");
    const nameInput =
      screen.getByPlaceholderText("レシピのタイトルを入力して下さい");
    await userEvent.type(nameInput, "test_name");
    const processInput =
      screen.getByPlaceholderText("レシピの作り方を書いて下さい");
    await userEvent.type(processInput, "test_process");
    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, "10分未満");
    await userEvent.click(screen.getByText("送信"));
    const ingredientName = screen.getByPlaceholderText("材料の名前");
    await userEvent.type(ingredientName, "test1");

    // 材料の量を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
  });
});
