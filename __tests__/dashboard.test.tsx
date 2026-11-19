import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DashboardPage from "@/app/(app)/dashboard/page";

describe("Dashboard & Inbox Page (Requirement 3)", () => {
  it("renders key stats cards for the salon", () => {
    render(<DashboardPage />);

    expect(screen.getByText(/Doorgestuurd deze maand/i)).toBeInTheDocument();
    expect(screen.getByText(/Bespaarde administratietijd/i)).toBeInTheDocument();
    expect(screen.getByText(/Gekoppelde mailboxen/i)).toBeInTheDocument();
    expect(screen.getByText(/Aandacht vereist \(Gemist\)/i)).toBeInTheDocument();
  });

  it("renders the 4 most recent supplier invoices on the dashboard", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Davines Nederland B.V.")).toBeInTheDocument();
    expect(screen.getByText("Keune Haircosmetics")).toBeInTheDocument();
    expect(screen.getByText("Nespresso Professional")).toBeInTheDocument();
    expect(screen.getByText("Salon Ambience Benelux")).toBeInTheDocument();

    const allInvoicesLink = screen.getByRole("link", { name: /Bekijk alle facturen/i });
    expect(allInvoicesLink).toBeInTheDocument();
    expect(allInvoicesLink).toHaveAttribute("href", "/facturen");
  });

  it("allows searching invoices by supplier name", () => {
    render(<DashboardPage />);

    const searchInput = screen.getByPlaceholderText(/Zoek op leverancier of nummer.../i);
    fireEvent.change(searchInput, { target: { value: "Keune" } });

    expect(screen.getByText("Keune Haircosmetics")).toBeInTheDocument();
    expect(screen.queryByText("Davines Nederland B.V.")).not.toBeInTheDocument();
  });

  it("allows filtering to show only missed / review required invoices", () => {
    render(<DashboardPage />);

    // Click on 'Aandacht vereist' tab
    const filterTabs = screen.getAllByRole("button", { name: /Aandacht vereist/i });
    fireEvent.click(filterTabs[0]);

    // Should only show missed items (Nespresso & Zettle)
    expect(screen.getByText("Nespresso Professional")).toBeInTheDocument();
    expect(screen.getByText("Zettle by PayPal")).toBeInTheDocument();
    expect(screen.queryByText("Davines Nederland B.V.")).not.toBeInTheDocument();
  });

  it("allows clicking a missed email to open modal and mark as invoice", async () => {
    render(<DashboardPage />);

    // Click on Nespresso Professional card
    const nespressoCard = screen.getByText("Nespresso Professional");
    fireEvent.click(nespressoCard);

    // Verify modal appears
    expect(screen.getByText(/Markeer als Factuur & Doorsturen/i)).toBeInTheDocument();
    expect(screen.getAllByText("Nespresso Professional").length).toBeGreaterThanOrEqual(2);

    // Confirm forwarding via "Ja, is een factuur"
    const confirmButton = screen.getByRole("button", { name: /Ja, is een factuur/i });
    fireEvent.click(confirmButton);

    // Modal closes and item status updates
    await waitFor(() => {
      expect(screen.queryByText(/Markeer als Factuur & Doorsturen/i)).not.toBeInTheDocument();
    });

    // Check success toast appears
    expect(screen.getByText(/is gemarkeerd als factuur en doorgestuurd/i)).toBeInTheDocument();

    // Check that "Handmatig gemarkeerd" badge is now shown
    expect(screen.getByText(/Handmatig gemarkeerd/i)).toBeInTheDocument();
  });

  it("renders Zen Barometer and displays compact invoice cards with link to all invoices", () => {
    render(<DashboardPage />);

    // Check Zen Barometer attention message is present initially (2 missed items)
    expect(screen.getByText(/e-mails vragen om een snelle blik/i)).toBeInTheDocument();

    // Check link to all invoices is present
    const allInvoicesLink = screen.getByRole("link", { name: /Bekijk alle facturen/i });
    expect(allInvoicesLink).toBeInTheDocument();
    expect(allInvoicesLink).toHaveAttribute("href", "/facturen");
  });

  it("shows serene Zen state when all attention items are marked", async () => {
    render(<DashboardPage />);

    // Filter to attention items
    const filterTabs = screen.getAllByRole("button", { name: /Aandacht vereist/i });
    fireEvent.click(filterTabs[0]);

    // Mark first item (Nespresso)
    fireEvent.click(screen.getByText("Nespresso Professional"));
    fireEvent.click(screen.getByRole("button", { name: /Ja, is een factuur/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Markeer als Factuur & Doorsturen/i)).not.toBeInTheDocument();
    });

    // Mark second item (Zettle)
    fireEvent.click(screen.getByText("Zettle by PayPal"));
    fireEvent.click(screen.getByRole("button", { name: /Ja, is een factuur/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Markeer als Factuur & Doorsturen/i)).not.toBeInTheDocument();
    });

    // Both items marked -> Serene "Alles is rustig" barometer and "Totale rust" empty state shown
    expect(screen.getByText(/Alles is rustig in de salon/i)).toBeInTheDocument();
    expect(screen.getByText(/Totale rust — Geen openstaande facturen/i)).toBeInTheDocument();
  });
});
