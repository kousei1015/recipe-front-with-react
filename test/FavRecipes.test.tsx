import React from "react";
import { describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Favorite from "../src/routes/favorites/route.lazy";
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

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("http://localhost:3000/v1/favorites.json", () => {
    return HttpResponse.json(
      [
        {
          recipe_id: 1,
          recipe_name: "test_name",
          image_url: null,
        },
      ],
      { status: 200 }
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

const setupTestRouter = (initialEntries = ["/favorites"]) => {
  const rootRoute = createRootRoute();
  const favoriteRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/favorites",
    component: () => <Favorite />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([favoriteRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("FavRecipes Component", () => {
  it("should render favorite commponent", async () => {
    setupTestRouter();

    await screen.findByText("test_name");
    screen.getByText("保存済みレシピ");
    screen.getByText("test_name");
  });
});
