import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
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

describe("RecipeId Component", () => {
  it("Firstly, should render skeleton component", async () => {
    const rootRoute = createRootRoute();
    const detail = createRoute({
      getParentRoute: () => rootRoute,
      path: "/1",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([detail]),
      history: createMemoryHistory({ initialEntries: ["/1"] }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(router.state.location.pathname).toBe("/1");
    await screen.findByText("レシピ編集画面");
    screen.getByText("材料を追加");
    await screen.findByDisplayValue("test_name");
    screen.getByText("process_test");
    screen.getByDisplayValue("test1");
    screen.getByDisplayValue("100g");
    screen.getByDisplayValue("test2");
    screen.getByDisplayValue("100cc");
  });
});
