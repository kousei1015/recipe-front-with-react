import React from "react";
import { describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Favorite from "../src/routes/favorites/route";
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
  rest.get("http://localhost:3000/v1/favorites.json", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          favorite_id: 1,
          recipe_id: 1,
          recipe_name: "test_name",
          image_url: null,
          user_id: 2,
          user_name: "test_user",
          avatar_url: null,
        },
      ])
    );
  }),
  rest.get("http://localhost:3000/v1/users.json", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        is_login: false,
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
  it("should render favorite commponent", async () => {
    const rootRoute = createRootRoute();
    const favoriteRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/favorites",
      component: () => <Favorite />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([favoriteRoute]),
      history: createMemoryHistory({ initialEntries: ["/favorites"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await screen.findByText("test_name");
    screen.getByText("保存済みレシピ");
    screen.getByText("ユーザー名: test_user");
    screen.getByText("お気に入りを解除");
  });
});