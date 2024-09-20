import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import SinglePost from "../src/routes/$recipeId/index";
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
import userEvent from "@testing-library/user-event";

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
  http.get("http://localhost:3000/v1/users/current_user_info.json", () => {
    return HttpResponse.json(
      {
        is_login: false,
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

const setupTestRouter = (initialEntries = ["/1"]) => {
  const rootRoute = createRootRoute();

  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$recipeId",
    component: SinglePost,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([detailRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("RecipeId Component", () => {
  it("should render component", async () => {
    const { router } = setupTestRouter();

    expect(router.state.location.pathname).toBe("/1");
    await router.load();
    await screen.findByText("test_name");
    screen.getByText("test_user");
    screen.getByText("test1");
    screen.getByText("100g");
    screen.getByText("test2");
    screen.getByText("100cc");
    screen.getByText("所要時間: 10分未満");
  });

  it("should navigate to the user's recipes when clicking on the user", async () => {
    const { router } = setupTestRouter();

    expect(router.state.location.pathname).toBe("/1");
    await screen.findByText("test_user");
    await userEvent.click(screen.getByText("test_user"));
    expect(router.state.location.pathname).toBe("/2/recipes");
  });
});
