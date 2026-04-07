import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorksheetPreview } from "../WorksheetPreview";
import { WorksheetConfig } from "../../types/Worksheet";
import { DEFAULT_ARITHMETIC_BY_GRADE } from "../../utils/generators";

describe("WorksheetPreview", () => {
  it("renders worksheet title when sections exist", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "My Math Test",
      sections: [{ id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 2 } }],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText("My Math Test")).toBeInTheDocument();
  });

  it("renders grade level when sections exist", () => {
    const config: WorksheetConfig = {
      grade: "3",
      title: "Test",
      sections: [{ id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 2 } }],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText("3rd Grade")).toBeInTheDocument();
  });

  it("renders name and date lines when sections exist", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [{ id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 2 } }],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
  });

  it("hides header when no sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(container.querySelector(".worksheet-header")).not.toBeInTheDocument();
  });

  it("renders empty message when no sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText(/Welcome to KidSheets/)).toBeInTheDocument();
  });

  it("renders arithmetic section", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE["1"], problemCount: 5 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // 1. appears in both worksheet and answer key
    expect(screen.getAllByText("1.").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5.").length).toBeGreaterThanOrEqual(1);
  });

  it("renders multiple sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Mixed",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 3 },
        },
        {
          id: "t1",
          type: "tracing",
          tracing: { content: "numbers", repetitions: 2 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // Arithmetic problems exist
    expect(screen.getAllByText("1.").length).toBeGreaterThanOrEqual(1);
    // Tracing numbers exist
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
  });

  it("renders answer key when arithmetic sections exist", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 1, maxNumber: 5, problemCount: 3 },
        },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText("Answer Key")).toBeInTheDocument();
  });

  it("does not render answer key for tracing-only worksheets", () => {
    const config: WorksheetConfig = {
      grade: "k",
      title: "Tracing",
      sections: [
        { id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 3 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.queryByText("Answer Key")).not.toBeInTheDocument();
  });

  it("regenerates problems when regenerateKey changes", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Math",
      sections: [
        {
          id: "a1",
          type: "arithmetic",
          arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 100, problemCount: 1 },
        },
      ],
    };

    const { rerender } = render(
      <WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />
    );

    // Capture the first problem text
    const firstRender = document.querySelector(".problem-text")?.textContent;

    // Rerender with new key many times to find a difference (random, so try a few)
    let changed = false;
    for (let i = 1; i <= 10; i++) {
      rerender(<WorksheetPreview config={config} regenerateKey={i} onRemoveSection={vi.fn()} />);
      const newRender = document.querySelector(".problem-text")?.textContent;
      if (newRender !== firstRender) {
        changed = true;
        break;
      }
    }
    // With range 0-100 and 10 tries, it should almost certainly change
    expect(changed).toBe(true);
  });

  it("does not render answer key for sight-words-only worksheets", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Sight Words",
      sections: [
        { id: "sw1", type: "sight-words", sightWords: { wordCount: 5 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.queryByText("Answer Key")).not.toBeInTheDocument();
  });

  it("does not render answer key for mazes-only worksheets", () => {
    const config: WorksheetConfig = {
      grade: "2",
      title: "Mazes",
      sections: [
        { id: "m1", type: "mazes", mazes: { mazeCount: 1 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.queryByText("Answer Key")).not.toBeInTheDocument();
  });

  it("renders answer key when mixing answerable and non-answerable sections", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Mixed",
      sections: [
        { id: "sw1", type: "sight-words", sightWords: { wordCount: 5 } },
        { id: "f1", type: "fractions", fractions: { problemCount: 3 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getByText("Answer Key")).toBeInTheDocument();
  });

  it("renders remove buttons for each section", () => {
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [
        { id: "a1", type: "arithmetic", arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 3 } },
        { id: "t1", type: "tracing", tracing: { content: "numbers", repetitions: 2 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(screen.getAllByText("Remove").length).toBe(2);
  });

  it("calls onRemoveSection when remove button is clicked", () => {
    const onRemove = vi.fn();
    const config: WorksheetConfig = {
      grade: "1",
      title: "Test",
      sections: [
        { id: "a1", type: "arithmetic", arithmetic: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 3 } },
      ],
    };
    render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={onRemove} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(onRemove).toHaveBeenCalledWith("a1");
  });

  it("renders fractions section", () => {
    const config: WorksheetConfig = {
      grade: "3",
      title: "Fractions",
      sections: [{ id: "f1", type: "fractions", fractions: { problemCount: 3 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // 3 in worksheet + 3 in answer key
    expect(container.querySelectorAll(".fractions-item").length).toBe(6);
  });

  it("renders counting section", () => {
    const config: WorksheetConfig = {
      grade: "2",
      title: "Counting",
      sections: [{ id: "c1", type: "counting", counting: { problemCount: 3 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // 3 in worksheet + 3 in answer key
    expect(container.querySelectorAll(".counting-item").length).toBe(6);
  });

  it("renders telling time section with clocks", () => {
    const config: WorksheetConfig = {
      grade: "2",
      title: "Time",
      sections: [{ id: "tt1", type: "telling-time", tellingTime: { problemCount: 2 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // 2 in worksheet + 2 in answer key
    expect(container.querySelectorAll(".clock-face").length).toBe(4);
  });

  it("renders money section with coins", () => {
    const config: WorksheetConfig = {
      grade: "2",
      title: "Money",
      sections: [{ id: "mo1", type: "money", money: { problemCount: 2 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(container.querySelectorAll(".coin-icon").length).toBeGreaterThan(0);
  });

  it("renders maze section", () => {
    const config: WorksheetConfig = {
      grade: "2",
      title: "Mazes",
      sections: [{ id: "mz1", type: "mazes", mazes: { mazeCount: 1 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    expect(container.querySelectorAll(".maze-svg").length).toBe(1);
  });

  it("renders vocabulary section", () => {
    const config: WorksheetConfig = {
      grade: "3",
      title: "Vocab",
      sections: [{ id: "v1", type: "vocabulary", vocabulary: { wordCount: 3 } }],
    };
    const { container } = render(<WorksheetPreview config={config} regenerateKey={0} onRemoveSection={vi.fn()} />);
    // 3 items x 4 options x 2 (worksheet + answer key)
    expect(container.querySelectorAll(".vocab-option").length).toBe(24);
  });
});
