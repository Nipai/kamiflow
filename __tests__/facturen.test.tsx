import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FacturenPage from "@/app/(app)/facturen/page";

describe("Facturen Logboek & Bottom Sheet Flow", () => {
  it("renders ultra-clean invoice cards with suppliers, dates, amounts and status pills", () => {
    render(<FacturenPage />);

    expect(screen.getByText(/Facturen Logboek/i)).toBeInTheDocument();
    expect(screen.getByText("Davines Nederland B.V.")).toBeInTheDocument();
    expect(screen.getByText("Keune Haircosmetics")).toBeInTheDocument();
    expect(screen.getByText("Nespresso Professional")).toBeInTheDocument();
  });

  it("allows searching scanned emails", () => {
    render(<FacturenPage />);

    const searchInput = screen.getByPlaceholderText(/Zoek op afzender of onderwerp.../i);
    fireEvent.change(searchInput, { target: { value: "Keune" } });

    expect(screen.getByText("Keune Haircosmetics")).toBeInTheDocument();
    expect(screen.queryByText("Davines Nederland B.V.")).not.toBeInTheDocument();
  });

  it("opens Bottom Sheet/Modal upon clicking card and records user confirmation as 'Ja, is een factuur'", async () => {
    render(<FacturenPage />);

    // Click invoice card for Nespresso
    const nespressoCard = screen.getByRole("button", { name: /Factuur Nespresso Professional/i });
    fireEvent.click(nespressoCard);

    // Verify Bottom Sheet / Modal is open with details
    expect(screen.getByText(/Is dit een factuur voor de salon\?/i)).toBeInTheDocument();
    expect(screen.getByText("Nespresso_Bestelling_omgezet.pdf")).toBeInTheDocument();

    // Click the large thumb-friendly button "Ja, is een factuur"
    const confirmInvoiceBtn = screen.getByRole("button", { name: /Ja, is een factuur/i });
    fireEvent.click(confirmInvoiceBtn);

    // Verify toast appears
    await waitFor(() => {
      expect(screen.getByText(/Feedback opgeslagen/i)).toBeInTheDocument();
    });
  });

  it("allows recording user correction as 'Nee, geen factuur'", async () => {
    render(<FacturenPage />);

    const cards = screen.getAllByRole("button", { name: /Factuur/i });
    fireEvent.click(cards[0]);

    const notInvoiceBtn = screen.getByRole("button", { name: /Nee, geen factuur/i });
    fireEvent.click(notInvoiceBtn);

    await waitFor(() => {
      expect(screen.getByText(/Feedback opgeslagen/i)).toBeInTheDocument();
    });
  });
});
