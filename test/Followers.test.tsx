import React from "react";
import { describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Followers from "../src/routes/myfollowers/index.lazy";
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
  http.get("http://localhost:3000/v1/users/myfollowers.json", () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          follower_id: 1,
          followed_id: 2,
          user_name: "test_user",
          avatar_url: null,
        },
      ],
      { status: 200 }
    );
  }),
  http.get("http://localhost:3000/v1/users/current_user_info.json", () => {
    return HttpResponse.json(
      { is_login: true, user_id: 1, user_name: "me", avatar_url: "" },
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

const setupTestRouter = (initialEntries = ["/myfollowers"]) => {
  const rootRoute = createRootRoute();
  const followersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/myfollowers",
    component: () => <Followers />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([followersRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  const rendered = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("Followers Component", () => {
  it("should render Followers commponent", async () => {
    setupTestRouter();

    await screen.findByText("test_user");
    screen.getByText("フォロワー");
  });
});
