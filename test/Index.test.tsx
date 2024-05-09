import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import {
  render,
  cleanup,
  screen,
} from "@testing-library/react";
import Index from "../src/routes/index";
import SinglePost from "../src/routes/$recipeId/route";
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
  rest.get("http://localhost:3000/v1/recipes.json", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            id: 1,
            recipe_name: "test",
            user_name: "user",
            cooking_time: 3,
          },
        ],
      })
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
  it("should render component", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await rendered.findByText("レシピ一覧");
  });

  it("should render component", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await screen.findByText("test");
    await screen.findByText("20分未満");
  });

  it("firstly, should render skeletons", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await rendered.findByText("レシピ一覧");
    expect(rendered.getAllByTestId("skeletonsTest")).toHaveLength(9);
  });

  it("Should jump to detail URL successfully work when click recipe", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <Index />,
    });
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/$recipeId",
      component: SinglePost,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute, detailRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await screen.findByText("test");
    await screen.findByText("20分未満");

    await userEvent.click(screen.getByText("test"));

    expect(router.state.location.pathname).toBe("/1")
  });
});