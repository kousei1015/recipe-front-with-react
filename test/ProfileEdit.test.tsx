import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { waitFor, render, cleanup, screen } from "@testing-library/react";
import Index from "../src/routes/profile/route.lazy";
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
  http.get("http://localhost:3000/v1/users/current_user_info.json", () => {
    return HttpResponse.json(
      {
        is_login: true,
        user_id: 2,
        user_name: "テストユーザー",
        avatar_url: "",
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

describe("Index Component", () => {
  it("Should render profile edit page ui", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/profile",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/profile"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("プロフィール編集");
    // user-name の input 要素が存在することを確認
    const userNameInput = screen.getByTestId("user-name");
    expect(userNameInput).toBeInTheDocument();

    // avatar の file input 要素が存在することを確認
    const avatarInput = screen.getByTestId("avatar");
    expect(avatarInput).toBeInTheDocument();
    screen.getByText("送信する");
  });

  it("Should render current username ", async () => {
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/profile",
      component: () => <Index />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/profile"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await screen.findByText("プロフィール編集");
    await screen.findByDisplayValue("テストユーザー");
  });
});
