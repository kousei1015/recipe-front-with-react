import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import SignUp from "../src/routes/signup/route.lazy";
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

const setupTestRouter = (initialEntries = ["/signup"]) => {
  const rootRoute = createRootRoute();
  const signUpRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/signup",
    component: () => <SignUp />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([signUpRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { router };
};

describe("SignUp Component", () => {
  it("Validate message should disappear when user type peoperty field", async () => {
    setupTestRouter();

    await screen.findByText("新規登録");
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
    setupTestRouter();
    
    await screen.findByText("新規登録");
    const emailInput = screen.getByPlaceholderText("emailを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("passwordを入力してください");

    await userEvent.type(emailInput, "dummy");

    // フォーカスを外さないと(onBlurイベントが走らないと)、エラーメッセージが表示されないことを確認
    expect(
      screen.queryByText("正しいメールアドレスを入力して下さい")
    ).toBeNull();

    // フォーカスを外す
    await userEvent.tab();

    // フォーカスを外した後は、エラーメッセージが表示されることを確認
    expect(
      screen.getByText("正しいメールアドレスを入力して下さい")
    ).toBeTruthy();

    await userEvent.type(passwordInput, "dummy");

    // フォーカスを外さないと(onBlurイベントが走らないと)、エラーメッセージが表示されないことを確認
    expect(
      screen.queryByText("パスワードは6文字以上入力して下さい")
    ).toBeNull();

    // フォーカスを外す
    await userEvent.tab();

    // フォーカスを外した後は、エラーメッセージが表示されることを確認
    expect(
      screen.getByText("パスワードは6文字以上入力して下さい")
    ).toBeTruthy();
  });
});
