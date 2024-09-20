import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Followings from "../src/routes/myfollowings/index.lazy";
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
  http.get("http://localhost:3000/v1/users/myfollowings.json", () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          follower_id: 1,
          followed_id: 2,
          user_name: "test_user",
          avatar_url: null,
          already_following: true,
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

const setupTestRouter = (initialEntries = ["/myfollowings"]) => {
  const rootRoute = createRootRoute();
  const followingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/myfollowings",
    component: () => <Followings />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([followingsRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("Followings Component", () => {
  it("should render followings commponent", async () => {
    setupTestRouter();

    await screen.findByText("test_user");
    screen.getByText("フォロー中");
    screen.getByText("フォローを解除");
  });
});
