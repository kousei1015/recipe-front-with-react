import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import SignIn from "../src/routes/signin/route.lazy";
import {
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

describe("SignIn Component", () => {
  it("Validate message should disappear when user type peoperty field", async () => {
    const rootRoute = createRootRoute();
    const SignInRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/signin",
      component: () => <SignIn />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([SignInRoute]),
      history: createMemoryHistory({ initialEntries: ["/signin"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("ログインフォーム");
    const emailInput = screen.getByPlaceholderText("emailを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("passwordを入力してください");

    await userEvent.type(emailInput, "dummy@gmail.com");
    await userEvent.type(passwordInput, "aaaaaa");
    screen.debug();
    expect(
      screen.queryByText("正しいメールアドレスを入力して下さい")
    ).toBeNull();
    expect(
      screen.queryByText("パスワードは6文字以上入力して下さい")
    ).toBeNull();
  });

  it("Validate message should appear", async () => {
    const rootRoute = createRootRoute();
    const SignInRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/signin",
      component: () => <SignIn />,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([SignInRoute]),
      history: createMemoryHistory({ initialEntries: ["/signin"] }),
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    await screen.findByText("ログインフォーム");
    const emailInput = screen.getByPlaceholderText("emailを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("passwordを入力してください");

    await userEvent.type(emailInput, "dummy");
    await userEvent.type(passwordInput, "dummy");
    screen.debug();
    expect(
      screen.getByText("正しいメールアドレスを入力して下さい")
    ).toBeTruthy();
    expect(
      screen.getByText("パスワードは6文字以上入力して下さい")
    ).toBeTruthy();
  });
});
