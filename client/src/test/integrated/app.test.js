import { render, screen, fireEvent, cleanup, act, waitFor } from "@testing-library/react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../App';

afterEach(() => {
    cleanup();
});

describe.skip("application test", () => {
    it('renders without crashing (smoke test)', () => {
        act(() => {
            const root = ReactDOM.createRoot(document.createElement('root'));
            root.render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            );
        });

    });

    it("physical keyboard reponds", () => {
        render(<App />);
        const gamePageDiv = screen.getByTestId("game-page");
        fireEvent.keyPress(gamePageDiv, { key: 'a', charCode: 97 });
        fireEvent.keyPress(gamePageDiv, { key: 'Enter', charCode: 13 });
        expect(gamePageDiv).toBeInTheDocument();
    });

    it("virtual keyboard responds not enough letters (client check)", () => {
        mockMatchMedia();

        render(<App />);
        const enterKey = screen.getByTestId("enter-key");
        fireEvent.click(enterKey);
        expect(enterKey).toBeInTheDocument();
        expect(screen.getByText("Not enough letters")).toBeInTheDocument();
        // expect(toast.mock.calls).toHaveLength(1);
    });

    it("virtual keyboard responds not enough letters (api check)", async () => {
        mockMatchMedia();

        render(<App />);
        fireEvent.click(screen.getByText("E"));
        fireEvent.click(screen.getByText("Enter"));
        expect(await screen.findByText("Not enough letters")).toBeInTheDocument();
    });

    it("virtual keyboard responds word not in list (api check)", async () => {
        mockMatchMedia();

        render(<App />);
        fireEvent.click(screen.getByText("A"));
        fireEvent.click(screen.getByText("B"));
        fireEvent.click(screen.getByText("C"));
        fireEvent.click(screen.getByText("D"));
        fireEvent.click(screen.getByText("E"));
        fireEvent.click(screen.getByText("Enter"));

        expect(await screen.findByText("Not in word list")).toBeInTheDocument();
    });

    // needs improvement: sometimes C is matched, sometimes not-matched
    it("virtual keyboard responds  (api check)", async () => {
        mockMatchMedia();

        render(<App />);
        fireEvent.click(screen.getByText("C"));
        fireEvent.click(screen.getByText("R"));
        fireEvent.click(screen.getByText("A"));
        fireEvent.click(screen.getByText("T"));
        fireEvent.click(screen.getByText("E"));
        fireEvent.click(screen.getByText("Enter"));

        await waitFor(() => {
            const result = screen.getAllByText("C");
            const cKey = result[0];
            expect(cKey).toContainHTML("<div class='tile flip-not-matched' style='animation-delay: 0s;'>C</div>");
        });

    });

    it("deletes with the delete key", () => {
        mockMatchMedia();

        render(<App />);
        fireEvent.click(screen.getByText("C"));
        expect(screen.getAllByText("C").length).toEqual(2);
        fireEvent.click(screen.getByTestId("delete-key"));
        expect(screen.getAllByText("C").length).toEqual(1);
    })

    it("resets grid when link is clicked", () => {
        mockMatchMedia();

        render(<App />);
        expect(screen.getAllByText("C").length).toBe(1);
        fireEvent.click(screen.getByText("C"));
        expect(screen.getAllByText("C").length).toBe(2);
        const link = screen.getByText("Reset");
        fireEvent.click(link);
        expect(screen.getAllByText("C").length).toBe(1);
    });

    it("changes date when random is clicked", () => {
        mockMatchMedia();

        render(<App />);
        const dateElement = screen.getByRole("textbox");
        // should be today's date, kindof
        const originalDate = dateElement.value;
        const link = screen.getByText("Random");
        fireEvent.click(link);
        // should be a different date
        expect(dateElement.value).not.toEqual(originalDate);

    });

    it("get answer when clicked", async () => {
        mockMatchMedia();

        render(<App />);
        const link = screen.getByText("Answer");
        fireEvent.click(link);

        await waitFor(() => {
            expect(screen.getByText(/Answer:/i)).toBeInTheDocument();
        });

    });

    it("show about dialog when clicked", async () => {
        mockMatchMedia();

        render(<App />);
        const link = screen.getByText("About");
        fireEvent.click(link);

        await waitFor(() => {
            expect(screen.getByText(/Core Software Design/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Close"));
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

    });

    // helper function to work around missing matchMedia
    function mockMatchMedia() {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // deprecated
                removeListener: jest.fn(), // deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    }
});
