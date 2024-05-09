import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Create from "../src/routes/create/route";
import {
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
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
  // Intercept "GET https://example.com/user" requests...
  rest.post("http://localhost:3000/v1/recipes", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 2,
        name: "test_name",
        process: "test_process",
        ingredients: [{ name: "test1", quantity: "100cc" }],
        cooking_time: 2,
        image_url: null,
      })
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

describe("Index Component", () => {
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
});