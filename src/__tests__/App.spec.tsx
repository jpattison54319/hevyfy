import { render, screen } from "@testing-library/react";
import { describe, test } from "vitest";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import userEvents from "@testing-library/user-event";

describe("App", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
  test("renders header", () => {
    expect(screen.getByAltText("J.P. Morgan Logo")).toBeInTheDocument();
    expect(screen.getByText("App Name")).toBeInTheDocument();

    // Links in the middle
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();

    // Action buttons on the right
    expect(
      screen.getByRole("button", { name: "notification" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "call" })).toBeInTheDocument();
  });

  test("renders Home page by default", () => {
    expect(
      screen.getByRole("link", { name: "go/salt-ds" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "go/community-index",
      })
    ).toBeInTheDocument();
  });

  test("switches to About page when clicking the navigation item", async () => {
    await userEvents.click(screen.getByRole("link", { name: "About" }));
    expect(screen.getByText("About Page")).toBeInTheDocument();
  });
});
