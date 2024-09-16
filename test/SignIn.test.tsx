import React from "react";
import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
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
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});


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
  http.get("http://localhost:3000/v1/auth/sign_in", () => {
    return HttpResponse.json(
      {
        data: {
          email: "bbbb@gmail.com",
          provider: "email",
          uid: "bbbb@gmail.com",
          id: 2,
          allow_password_change: false,
          name: "テストユーザー",
          nickname: null,
          image: null,
        },
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

    // フォーカスを外さないと(onBlurイベントが走らないと)、エラーメッセージが表示されないことを確認
    expect(screen.queryByText("正しいメールアドレスを入力して下さい")).toBeNull();
    
    // フォーカスを外す
    await userEvent.tab()
    
    // フォーカスを外した後は、エラーメッセージが表示されることを確認
    expect(
      screen.getByText("正しいメールアドレスを入力して下さい")
    ).toBeTruthy();

    await userEvent.type(passwordInput, "dummy");

    // フォーカスを外さないと(onBlurイベントが走らないと)、エラーメッセージが表示されないことを確認
    expect(screen.queryByText("パスワードは6文字以上入力して下さい")).toBeNull();
    
    // フォーカスを外す
    await userEvent.tab()

    // フォーカスを外した後は、エラーメッセージが表示されることを確認
    expect(
      screen.getByText("パスワードは6文字以上入力して下さい")
    ).toBeTruthy();
  });

  it("An alert should appear when a 401 error is returned", async () => {
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
    server.use(
      http.post("http://localhost:3000/v1/auth/sign_in", () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await screen.findByText("ログインフォーム");
    const emailInput = screen.getByPlaceholderText("emailを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("passwordを入力してください");

    await userEvent.type(emailInput, "UnregisteredUser@gmail.com");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(screen.getByText("送信する"));

    expect(alertMock).toHaveBeenCalledWith(
      "ログイン情報が正しくありません。再度お試しください。"
    );
  });

  it("An alert should appear when a 500 error is returned", async () => {
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
    server.use(
      http.post("http://localhost:3000/v1/auth/sign_in", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await screen.findByText("ログインフォーム");
    const emailInput = screen.getByPlaceholderText("emailを入力してください");
    const passwordInput =
      screen.getByPlaceholderText("passwordを入力してください");

    await userEvent.type(emailInput, "UnregisteredUser@gmail.com");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(screen.getByText("送信する"));

    expect(alertMock).toHaveBeenCalledWith(
      "エラーが発生しました。時間をおいて試してみてください"
    );
  });
});
