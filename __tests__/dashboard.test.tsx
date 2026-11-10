import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DashboardPage from "@/app/dashboard/page";

describe("Dashboard & Inbox Page (Requirement 3)", () => {
  it("renders key stats cards for the salon", () => {
    render(<DashboardPage />);

    expect(screen.getByText(/Doorgestuurd deze maand/i)).toBeInTheDocument();
    expect(screen.getByText(/Bespaarde administratietijd/i)).toBeInTheDocument();
    expect(screen.getByText(/Gekoppelde mailboxen/i)).toBeInTheDocument();
    expect(screen.getByText(/Aandacht vereist \(Gemist\)/i)).toBeInTheDocument();
  });

  it("renders the inbox table with supplier invoices", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Davines Nederland B.V.")).toBeInTheDocument();
    expect(screen.getByText("Keune Haircosmetics")).toBeInTheDocument();
    expect(screen.getByText("Nespresso Professional")).toBeInTheDocument();
    expect(screen.getByText("Salon Ambience Benelux")).toBeInTheDocument();
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

  it("allows marking a missed email as invoice and forwarding it", async () => {
    render(<DashboardPage />);

    // Find the 'Markeer als factuur' button for Nespresso
    const markButtons = screen.getAllByRole("button", { name: /Markeer als factuur/i });
    expect(markButtons.length).toBeGreaterThan(0);

    // Click the first one (Nespresso)
    fireEvent.click(markButtons[0]);

    // Verify modal appears
    expect(screen.getByText(/Markeer als Factuur & Doorsturen/i)).toBeInTheDocument();
    expect(screen.getAllByText("Nespresso Professional").length).toBeGreaterThanOrEqual(2);

    // Confirm forwarding
    const confirmButton = screen.getByRole("button", { name: /Bevestig & Direct Doorsturen/i });
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

  it("renders Zen Barometer and allows toggling between Zen Feed and Table view", () => {
    render(<DashboardPage />);

    // Check Zen Barometer attention message is present initially (2 missed items)
    expect(screen.getByText(/e-mails vragen om een snelle blik/i)).toBeInTheDocument();

    // Switch to Table view
    const tableViewBtn = screen.getByTitle("Overzicht Tabel");
    fireEvent.click(tableViewBtn);
    expect(screen.getByRole("table")).toBeInTheDocument();

    // Switch back to Zen Feed
    const feedViewBtn = screen.getByTitle("Zen Kaarten Feed");
    fireEvent.click(feedViewBtn);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows serene Zen state when all attention items are marked", async () => {
    render(<DashboardPage />);

    // Filter to attention items
    const filterTabs = screen.getAllByRole("button", { name: /Aandacht vereist/i });
    fireEvent.click(filterTabs[0]);

    // Mark first item (Nespresso)
    let markButtons = screen.getAllByRole("button", { name: /Markeer als factuur/i });
    fireEvent.click(markButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: /Bevestig & Direct Doorsturen/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Markeer als Factuur & Doorsturen/i)).not.toBeInTheDocument();
    });

    // Mark second item (Zettle)
    markButtons = screen.getAllByRole("button", { name: /Markeer als factuur/i });
    fireEvent.click(markButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: /Bevestig & Direct Doorsturen/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Markeer als Factuur & Doorsturen/i)).not.toBeInTheDocument();
    });

    // Both items marked -> Serene "Alles is rustig" barometer and "Totale rust" empty state shown
    expect(screen.getByText(/Alles is rustig in de salon/i)).toBeInTheDocument();
    expect(screen.getByText(/Totale rust — Geen openstaande facturen/i)).toBeInTheDocument();
  });
});
