import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KoppelingenPage from "@/app/(app)/koppelingen/page";
import InstellingenPage from "@/app/(app)/instellingen/page";

describe("Koppelingen & Instellingen Pages", () => {
  it("renders mailbox integrations section and allows toggling in Koppelingen", () => {
    render(<KoppelingenPage />);

    expect(screen.getByText(/Gekoppelde Mailboxen/i)).toBeInTheDocument();
    expect(screen.getByText("inkoop@haarstudiopuur.nl")).toBeInTheDocument();
    expect(screen.getByText("administratie@haarstudiopuur.nl")).toBeInTheDocument();

    // Toggle mailbox active status
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
    fireEvent.click(checkboxes[0]);
  });

  it("validates and saves bookkeeping upload email in Koppelingen", async () => {
    render(<KoppelingenPage />);

    expect(screen.getByText(/Boekhoud-upload E-mailadres/i)).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: /Upload-e-mailadres Opslaan/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/succesvol bijgewerkt|lokaal opgeslagen/i)
      ).toBeInTheDocument();
    });
  });

  it("renders Gmail and Outlook connect buttons in Koppelingen", () => {
    render(<KoppelingenPage />);

    const gmailLinks = screen.getAllByRole("link", { name: /Gmail koppelen/i });
    expect(gmailLinks.length).toBeGreaterThan(0);
    expect(gmailLinks[0]).toHaveAttribute("href", "/api/oauth/gmail/connect");

    const outlookLinks = screen.getAllByRole("link", { name: /Outlook koppelen/i });
    expect(outlookLinks.length).toBeGreaterThan(0);
    expect(outlookLinks[0]).toHaveAttribute("href", "/api/oauth/outlook/connect");
  });

  it("opens confirmation modal and disconnects a mailbox in Koppelingen", async () => {
    render(<KoppelingenPage />);

    const disconnectBtns = screen.getAllByRole("button", { name: /Ontkoppelen/i });
    expect(disconnectBtns.length).toBeGreaterThan(0);

    // Click disconnect on first mailbox
    fireEvent.click(disconnectBtns[0]);

    // Modal should appear
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Weet je zeker dat je deze mailbox wilt loskoppelen van KamiFlow\?/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /Ja, mailbox ontkoppelen/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/is ontkoppeld/i)).toBeInTheDocument();
    });
  });

  it("renders company profile form and saves in Instellingen", async () => {
    render(<InstellingenPage />);

    expect(screen.getAllByText(/Bedrijfsgegevens/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText(/Haarstudio & Spa Puur B.V./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Prinsengracht 412/i)).toBeInTheDocument();

    const saveProfileBtn = screen.getByRole("button", { name: /Bedrijfsgegevens Opslaan/i });
    fireEvent.click(saveProfileBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Bedrijfsgegevens zijn succesvol opgeslagen/i)
      ).toBeInTheDocument();
    });
  });

  it("renders Mollie subscription tier cards and upgrade options", () => {
    render(<InstellingenPage />);

    expect(screen.getByText(/Abonnement & Betalingen/i)).toBeInTheDocument();
    expect(screen.getByText("Actief (Pro)")).toBeInTheDocument();
    expect(screen.getByText("iDEAL & SEPA-incasso")).toBeInTheDocument();

    // Open de abonnement wijzigen modal
    const changePlanBtn = screen.getByRole("button", { name: /Abonnement wijzigen/i });
    expect(changePlanBtn).toBeInTheDocument();
    fireEvent.click(changePlanBtn);

    expect(screen.getAllByText(/KamiFlow Starter/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/KamiFlow Pro/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/KamiFlow Accountant/i).length).toBeGreaterThanOrEqual(1);
  });
});
