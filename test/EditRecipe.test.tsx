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

const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

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
        process: "process_test",
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
          {
            name: "test2",
            quantity: "100cc",
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

describe("EditRecipe Component", () => {
  it("Firstly, should render skeleton component", async () => {
    const rootRoute = createRootRoute();
    const detail = createRoute({
      getParentRoute: () => rootRoute,
      path: "/1/edit",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([detail]),
      history: createMemoryHistory({ initialEntries: ["/1/edit"] }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(router.state.location.pathname).toBe("/1/edit");
    await screen.findByText("レシピ編集画面");
    screen.getByText("材料を追加");
    await screen.findByDisplayValue("test_name");
    screen.getByText("process_test");
    screen.getByDisplayValue("test1");
    screen.getByDisplayValue("100g");
    screen.getByDisplayValue("test2");
    screen.getByDisplayValue("100cc");
  });
  it("an alert appears when ingredients name and quantity is empty", async () => {
    const rootRoute = createRootRoute();
    const detail = createRoute({
      getParentRoute: () => rootRoute,
      path: "/1/edit",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([detail]),
      history: createMemoryHistory({ initialEntries: ["/1/edit"] }),
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("レシピ編集画面");

    // 材料の名前を入力するinputのvalueを空にする
    const ingredientName = screen.getAllByPlaceholderText("材料の名前");
    for (const input of ingredientName) {
      await userEvent.clear(input);
    }

    // 材料の量を入力するinputのvalueを空にする
    const ingredientQuantity = screen.getAllByPlaceholderText("量");
    for (const input of ingredientQuantity) {
      await userEvent.clear(input);
    }

    await userEvent.click(screen.getByText("送信"));

    // 材料の名前と量、両方を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
  });
  it("an alert appears when ingredients name is empty", async () => {
    const rootRoute = createRootRoute();
    const detail = createRoute({
      getParentRoute: () => rootRoute,
      path: "/1/edit",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([detail]),
      history: createMemoryHistory({ initialEntries: ["/1/edit"] }),
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("レシピ編集画面");

    await screen.findByDisplayValue("test_name");
    screen.getByDisplayValue("test1");
    screen.getByDisplayValue("test2");
    // 材料の名前を入力するinputのvalueを空にする
    const ingredientName = screen.getAllByPlaceholderText("材料の名前");
    for (const input of ingredientName) {
      userEvent.clear(input);
    }

    for (const input of ingredientName) {
      expect(input).toHaveValue("");
    }

    await userEvent.click(screen.getByText("送信"));
    // 材料の名前を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
    screen.debug();
  });
  it("an alert appears when ingredients quantity is empty", async () => {
    const rootRoute = createRootRoute();
    const detail = createRoute({
      getParentRoute: () => rootRoute,
      path: "/1/edit",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([detail]),
      history: createMemoryHistory({ initialEntries: ["/1/edit"] }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("レシピ編集画面");

    await screen.findByDisplayValue("test_name");
    screen.getByDisplayValue("100g");
    screen.getByDisplayValue("100cc");
    // 材料の量を入力するinputのvalueを空にする
    const ingredientQuantity = screen.getAllByPlaceholderText("量");
    for (const input of ingredientQuantity) {
      await userEvent.clear(input);
    }

    await userEvent.click(screen.getByText("送信"));
    // 材料の量を入力しなかった場合、window.alertが出現確認
    expect(alertMock).toHaveBeenCalledWith(
      "材料の名前と量を両方とも入力してください"
    );
  });
});
