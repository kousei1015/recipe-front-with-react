import React from "react";
import { describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Followers from "../src/routes/followers/index.lazy";
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
  rest.get("http://localhost:3000/v1/users/myfollowers.json", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          follower_id: 1,
          followed_id: 2,
          user_name: "test_user",
          avatar_url: null,
        },
      ])
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
  it("should render followers commponent", async () => {
    const rootRoute = createRootRoute();
    const favoriteRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/followers",
      component: () => <Followers />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([favoriteRoute]),
      history: createMemoryHistory({ initialEntries: ["/followers"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("test_user");
    screen.getByText("フォロワー");
  });
});
