import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Index from "../src/routes/index";
import {
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";
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

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("http://localhost:3000/v1/recipes.json", () => {
    return HttpResponse.json(
      {
        data: [
          {
            id: 1,
            recipe_name: "test",
            user_name: "user",
            cooking_time: 3,
          },
        ],
        pagination: {
          total_pages: 1,
          current_page: 1
        }
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
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

const setupTestRouter = (initialEntries = ["/"]) => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <Index />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("Index Component", () => {
  it("should render recipes", async () => {
    setupTestRouter();

    await screen.findByText("レシピ一覧");
    await screen.findByText("test");
    await screen.findByText("20分未満");
  });

  it("firstly, should render skeletons", async () => {
    setupTestRouter();
    await screen.findByText("レシピ一覧");
    expect(screen.getAllByTestId("skeletonsTest")).toHaveLength(9);
  });

  it("Should jump to detail URL successfully work when click recipe", async () => {
    const { router } = setupTestRouter();

    await screen.findByText("test");
    await screen.findByText("20分未満");

    await userEvent.click(screen.getByText("test"));

    expect(router.state.location.pathname).toBe("/1");
  });
});
