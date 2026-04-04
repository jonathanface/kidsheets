import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfigPanel } from "../ConfigPanel";
import { WorksheetConfig } from "../../types/Worksheet";
import { DEFAULT_ARITHMETIC_BY_GRADE } from "../../utils/generators";

const defaultConfig: WorksheetConfig = {
  grade: "1",
  title: "Test Worksheet",
  sections: [
    {
      id: "test-1",
      type: "arithmetic",
      arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE["1"] },
    },
  ],
};

describe("ConfigPanel", () => {
  it("renders title input", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("Test Worksheet")).toBeInTheDocument();
  });

  it("renders grade selector with all grades", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Pre-K")).toBeInTheDocument();
    expect(screen.getByText("5th Grade")).toBeInTheDocument();
  });

  it("renders add section buttons after expanding categories", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Math"));
    expect(screen.getByText("+ Arithmetic")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Motor Skills"));
    expect(screen.getByText("+ Tracing")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reading"));
    expect(screen.getByText("+ Spelling")).toBeInTheDocument();
  });

  it("calls onChange when title changes", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.change(screen.getByDisplayValue("Test Worksheet"), {
      target: { value: "New Title" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New Title" })
    );
  });

  it("calls onChange when adding a section", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Reading"));
    fireEvent.click(screen.getByText("+ Spelling"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({ type: "spelling" }),
        ]),
      })
    );
  });

  it("calls onChange when removing a section", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTitle("Remove section"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ sections: [] })
    );
  });

  it("calls onRegenerate when clicking regenerate", () => {
    const onRegenerate = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={onRegenerate}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Regenerate"));
    expect(onRegenerate).toHaveBeenCalled();
  });

  it("calls onPrint with false for Print button", () => {
    const onPrint = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={onPrint}
      />
    );
    fireEvent.click(screen.getByText("Print"));
    expect(onPrint).toHaveBeenCalledWith(false);
  });

  it("calls onPrint with true for Print with Answers button", () => {
    const onPrint = vi.fn();
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={onPrint}
      />
    );
    fireEvent.click(screen.getByText("Print with Answers"));
    expect(onPrint).toHaveBeenCalledWith(true);
  });

  it("shows empty hint when no sections", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Add a section to get started.")).toBeInTheDocument();
  });

  it("renders arithmetic section options", () => {
    render(
      <ConfigPanel
        config={defaultConfig}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("addition")).toBeInTheDocument();
    expect(screen.getByText("subtraction")).toBeInTheDocument();
  });

  it("renders tracing section options when tracing is added", () => {
    const configWithTracing: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "t1", type: "tracing", tracing: { content: "uppercase", repetitions: 4 } }],
    };
    render(
      <ConfigPanel
        config={configWithTracing}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Tracing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Uppercase Letters")).toBeInTheDocument();
  });

  it("renders spelling section options when spelling is added", () => {
    const configWithSpelling: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "s1", type: "spelling", spelling: { wordCount: 8, mode: "fill-in-blank" } }],
    };
    render(
      <ConfigPanel
        config={configWithSpelling}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    expect(screen.getByText("Spelling")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fill in the Blank")).toBeInTheDocument();
  });

  it("shows all math subtypes when Math category is expanded", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Math"));
    expect(screen.getByText("+ Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("+ Fractions")).toBeInTheDocument();
    expect(screen.getByText("+ Counting")).toBeInTheDocument();
    expect(screen.getByText("+ Telling Time")).toBeInTheDocument();
    expect(screen.getByText("+ Money")).toBeInTheDocument();
  });

  it("shows all reading subtypes when Reading category is expanded", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Reading"));
    expect(screen.getByText("+ Spelling")).toBeInTheDocument();
    expect(screen.getByText("+ Sight Words")).toBeInTheDocument();
    expect(screen.getByText("+ Vocabulary")).toBeInTheDocument();
  });

  it("shows all motor skills subtypes when expanded", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Motor Skills"));
    expect(screen.getByText("+ Tracing")).toBeInTheDocument();
    expect(screen.getByText("+ Mazes")).toBeInTheDocument();
  });

  it("shows all logic subtypes when Logic category is expanded", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Logic"));
    expect(screen.getByText("+ Odd One Out")).toBeInTheDocument();
    expect(screen.getByText("+ Sorting")).toBeInTheDocument();
    expect(screen.getByText("+ What Comes Next")).toBeInTheDocument();
  });

  it("adds a fractions section when button is clicked", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Math"));
    fireEvent.click(screen.getByText("+ Fractions"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({ type: "fractions", fractions: expect.any(Object) }),
        ]),
      })
    );
  });

  it("adds a mazes section when button is clicked", () => {
    const onChange = vi.fn();
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={onChange}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Motor Skills"));
    fireEvent.click(screen.getByText("+ Mazes"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({ type: "mazes", mazes: expect.any(Object) }),
        ]),
      })
    );
  });

  it("renders problem count config for fractions section", () => {
    const config: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "f1", type: "fractions", fractions: { problemCount: 8 } }],
    };
    render(
      <ConfigPanel config={config} onChange={vi.fn()} onRegenerate={vi.fn()} onPrint={vi.fn()} />
    );
    expect(screen.getByText("Fractions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8")).toBeInTheDocument();
  });

  it("renders maze count config for mazes section", () => {
    const config: WorksheetConfig = {
      ...defaultConfig,
      sections: [{ id: "m1", type: "mazes", mazes: { mazeCount: 2 } }],
    };
    render(
      <ConfigPanel config={config} onChange={vi.fn()} onRegenerate={vi.fn()} onPrint={vi.fn()} />
    );
    // "Mazes" appears in both the badge and the label input
    expect(screen.getAllByText("Mazes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });

  it("collapses category when clicked again", () => {
    render(
      <ConfigPanel
        config={{ ...defaultConfig, sections: [] }}
        onChange={vi.fn()}
        onRegenerate={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Math"));
    expect(screen.getByText("+ Arithmetic")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Math"));
    expect(screen.queryByText("+ Arithmetic")).not.toBeInTheDocument();
  });
});
