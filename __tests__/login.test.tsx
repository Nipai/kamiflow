import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/login/page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Login Page (Requirement 2)", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders login form with tranquil branding", () => {
    render(<LoginPage />);

    expect(screen.getByText(/Welkom terug in de rust/i)).toBeInTheDocument();
    expect(screen.getByText(/Verder met Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Verder met Microsoft 365/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zakelijk e-mailadres/i)).toBeInTheDocument();
  });

  it("submits the form and navigates to the dashboard", async () => {
    render(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /Naar Salon Dashboard/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("allows switching to magic link login mode", async () => {
    render(<LoginPage />);

    const switchBtn = screen.getByText(/Inloggen zonder wachtwoord\?/i);
    fireEvent.click(switchBtn);

    expect(
      screen.getByRole("button", { name: /Stuur mij een magische inloglink/i })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Stuur mij een magische inloglink/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Check je inbox!/i)).toBeInTheDocument();
    });
  });
});
