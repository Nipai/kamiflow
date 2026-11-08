import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SettingsPage from "@/app/dashboard/settings/page";

describe("Settings Page (Requirement 4)", () => {
  it("renders mailbox integrations section", () => {
    render(<SettingsPage />);

    expect(screen.getByText("Gekoppelde Mailboxen")).toBeInTheDocument();
    expect(screen.getByText("inkoop@haarstudiopuur.nl")).toBeInTheDocument();
    expect(screen.getByText("administratie@haarstudiopuur.nl")).toBeInTheDocument();
  });

  it("renders accounting software integrations and allows toggling", () => {
    render(<SettingsPage />);

    expect(screen.getByText("Boekhoudpakket Koppeling")).toBeInTheDocument();
    expect(screen.getByText("Moneybird")).toBeInTheDocument();
    expect(screen.getByText("Exact Online")).toBeInTheDocument();
    expect(screen.getByText("e-Boekhouden.nl")).toBeInTheDocument();
    expect(screen.getByText("Yuki")).toBeInTheDocument();

    // Moneybird is initially connected; click 'Ontkoppelen'
    const disconnectBtn = screen.getByRole("button", { name: /Ontkoppelen/i });
    fireEvent.click(disconnectBtn);

    // It should now offer 'Koppelen'
    expect(screen.queryByRole("button", { name: /Ontkoppelen/i })).not.toBeInTheDocument();
  });

  it("renders automation and zen rules", () => {
    render(<SettingsPage />);

    expect(screen.getByText(/Automatiserings- & Zen Regels/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Automatisch doorsturen bij hoge betrouwbaarheid/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wekelijkse rust-samenvatting op zondagavond/i)
    ).toBeInTheDocument();
  });

  it("allows updating salon profile and shows success feedback", async () => {
    render(<SettingsPage />);

    const saveBtn = screen.getByRole("button", { name: /Wijzigingen Opslaan/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Instellingen zijn succesvol opgeslagen!/i)
      ).toBeInTheDocument();
    });
  });
});
