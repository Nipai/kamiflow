import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";

describe("Landing Page (Requirement 1)", () => {
  it("renders the hero section with set & forget proposition", () => {
    render(<HomePage />);

    // Brand and headline
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Rust in je salon/i);
    expect(screen.getByText(/Set & Forget factuurverwerking/i)).toBeInTheDocument();
    expect(screen.getByText(/Nooit meer handmatig facturen doorsturen/i)).toBeInTheDocument();
  });

  it("contains navigation links to login and dashboard", () => {
    render(<HomePage />);

    const loginLinks = screen.getAllByRole("link", { name: /inloggen/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");

    const dashboardLinks = screen.getAllByRole("link", { name: /dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });

  it("highlights beauty sector suppliers and value propositions", () => {
    render(<HomePage />);

    expect(screen.getByText(/Gebouwd voor de beautybranche/i)).toBeInTheDocument();
    expect(screen.getByText(/Echte zondagrust/i)).toBeInTheDocument();
    expect(screen.getByText(/Keune Haircosmetics/i)).toBeInTheDocument();
  });

  it("displays testimonials from salon owners", () => {
    render(<HomePage />);

    expect(screen.getByText(/Emma van Leeuwen/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Haarstudio Puur/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Barbershop & Spa De Meester/i)).toBeInTheDocument();
  });
});
