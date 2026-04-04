import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FractionsWorksheet } from "../FractionsWorksheet";
import { CountingWorksheet } from "../CountingWorksheet";
import { TellingTimeWorksheet } from "../TellingTimeWorksheet";
import { MoneyWorksheet } from "../MoneyWorksheet";
import { MazeWorksheet } from "../MazeWorksheet";
import { SightWordsWorksheet } from "../SightWordsWorksheet";
import { VocabularyWorksheet } from "../VocabularyWorksheet";
import { LogicWorksheet } from "../LogicWorksheet";
import {
  generateFractionsProblems,
  generateCountingProblems,
  generateTellingTimeProblems,
  generateMoneyProblems,
  generateMazes,
  generateSightWords,
  generateVocabulary,
  generateLogicProblems,
} from "../../utils/generators";

describe("FractionsWorksheet", () => {
  const problems = generateFractionsProblems({ problemCount: 3 }, "3");

  it("renders all problems", () => {
    render(<FractionsWorksheet problems={problems} showAnswers={false} />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("3.")).toBeInTheDocument();
  });

  it("shows answer lines when not showing answers", () => {
    const { container } = render(<FractionsWorksheet problems={problems} showAnswers={false} />);
    expect(container.querySelectorAll(".answer-line").length).toBe(3);
  });

  it("shows answers when showAnswers is true", () => {
    const { container } = render(<FractionsWorksheet problems={problems} showAnswers={true} />);
    expect(container.querySelectorAll(".answer").length).toBe(3);
  });

  it("handles empty problems list", () => {
    const { container } = render(<FractionsWorksheet problems={[]} showAnswers={false} />);
    expect(container.querySelector(".fractions-list")).toBeInTheDocument();
  });
});

describe("CountingWorksheet", () => {
  const problems = generateCountingProblems({ problemCount: 3 }, "2");

  it("renders all problems", () => {
    render(<CountingWorksheet problems={problems} showAnswers={false} />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("3.")).toBeInTheDocument();
  });

  it("shows question mark for blank cell", () => {
    render(<CountingWorksheet problems={problems} showAnswers={false} />);
    expect(screen.getAllByText("?").length).toBe(3);
  });

  it("shows answers when showAnswers is true", () => {
    render(<CountingWorksheet problems={problems} showAnswers={true} />);
    expect(screen.queryByText("?")).not.toBeInTheDocument();
  });

  it("handles empty problems list", () => {
    const { container } = render(<CountingWorksheet problems={[]} showAnswers={false} />);
    expect(container.querySelector(".counting-list")).toBeInTheDocument();
  });
});

describe("TellingTimeWorksheet", () => {
  const problems = generateTellingTimeProblems({ problemCount: 3 }, "2");

  it("renders all problems with clock faces", () => {
    const { container } = render(<TellingTimeWorksheet problems={problems} showAnswers={false} />);
    expect(container.querySelectorAll(".clock-face").length).toBe(3);
  });

  it("shows time blanks when not showing answers", () => {
    render(<TellingTimeWorksheet problems={problems} showAnswers={false} />);
    expect(screen.getAllByText("__:__").length).toBe(3);
  });

  it("shows time answers when showAnswers is true", () => {
    const { container } = render(<TellingTimeWorksheet problems={problems} showAnswers={true} />);
    expect(container.querySelectorAll(".answer").length).toBe(3);
    expect(screen.queryByText("__:__")).not.toBeInTheDocument();
  });
});

describe("MoneyWorksheet", () => {
  const problems = generateMoneyProblems({ problemCount: 3 }, "2");

  it("renders all problems", () => {
    render(<MoneyWorksheet problems={problems} showAnswers={false} />);
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("3.")).toBeInTheDocument();
  });

  it("renders coin SVGs", () => {
    const { container } = render(<MoneyWorksheet problems={problems} showAnswers={false} />);
    expect(container.querySelectorAll(".coin-icon").length).toBeGreaterThan(0);
  });

  it("shows answers when showAnswers is true", () => {
    const { container } = render(<MoneyWorksheet problems={problems} showAnswers={true} />);
    expect(container.querySelectorAll(".answer").length).toBe(3);
  });
});

describe("MazeWorksheet", () => {
  const mazes = generateMazes({ mazeCount: 2 }, "2");

  it("renders the correct number of mazes", () => {
    const { container } = render(<MazeWorksheet mazes={mazes} showAnswers={false} />);
    expect(container.querySelectorAll(".maze-svg").length).toBe(2);
  });

  it("renders start and end labels", () => {
    render(<MazeWorksheet mazes={mazes} showAnswers={false} />);
    expect(screen.getAllByText("Start").length).toBe(2);
    expect(screen.getAllByText("End").length).toBe(2);
  });

  it("shows solution path when showAnswers is true", () => {
    const { container } = render(<MazeWorksheet mazes={mazes} showAnswers={true} />);
    expect(container.querySelectorAll("polyline").length).toBe(2);
  });

  it("hides solution path when showAnswers is false", () => {
    const { container } = render(<MazeWorksheet mazes={mazes} showAnswers={false} />);
    expect(container.querySelectorAll("polyline").length).toBe(0);
  });
});

describe("SightWordsWorksheet", () => {
  const words = generateSightWords({ wordCount: 5 }, "1");

  it("renders all words", () => {
    render(<SightWordsWorksheet words={words} showAnswers={false} />);
    words.forEach((w) => {
      expect(screen.getByText(w.word)).toBeInTheDocument();
    });
  });

  it("shows practice lines when not showing answers", () => {
    const { container } = render(<SightWordsWorksheet words={words} showAnswers={false} />);
    expect(container.querySelectorAll(".sight-word-line").length).toBe(5);
  });

  it("shows written words when showAnswers is true", () => {
    const { container } = render(<SightWordsWorksheet words={words} showAnswers={true} />);
    expect(container.querySelectorAll(".sight-word-written").length).toBe(5);
  });
});

describe("VocabularyWorksheet", () => {
  const items = generateVocabulary({ wordCount: 3 }, "3");

  it("renders all items with words", () => {
    render(<VocabularyWorksheet items={items} showAnswers={false} />);
    items.forEach((item) => {
      expect(screen.getByText(item.word)).toBeInTheDocument();
    });
  });

  it("renders 4 options per item", () => {
    const { container } = render(<VocabularyWorksheet items={items} showAnswers={false} />);
    expect(container.querySelectorAll(".vocab-option").length).toBe(12);
  });

  it("highlights correct option when showAnswers is true", () => {
    const { container } = render(<VocabularyWorksheet items={items} showAnswers={true} />);
    expect(container.querySelectorAll(".vocab-correct").length).toBe(3);
  });

  it("renders option letters A-D", () => {
    render(<VocabularyWorksheet items={items} showAnswers={false} />);
    expect(screen.getAllByText("A.").length).toBe(3);
    expect(screen.getAllByText("D.").length).toBe(3);
  });
});

describe("LogicWorksheet", () => {
  it("renders puzzle mode with choices", () => {
    const problems = generateLogicProblems("puzzle", { problemCount: 2 }, "2");
    const { container } = render(<LogicWorksheet mode="puzzle" problems={problems} showAnswers={false} />);
    expect(container.querySelectorAll(".logic-choice").length).toBeGreaterThan(0);
  });

  it("renders sorting mode with blank slots", () => {
    const problems = generateLogicProblems("sorting", { problemCount: 2 }, "2");
    const { container } = render(<LogicWorksheet mode="sorting" problems={problems} showAnswers={false} />);
    expect(container.querySelectorAll(".logic-blank-slot").length).toBeGreaterThan(0);
  });

  it("renders sequencing mode with question mark blank", () => {
    const problems = generateLogicProblems("sequencing", { problemCount: 2 }, "2");
    render(<LogicWorksheet mode="sequencing" problems={problems} showAnswers={false} />);
    expect(screen.getAllByText("?").length).toBe(2);
  });

  it("shows answers for puzzle mode", () => {
    const problems = generateLogicProblems("puzzle", { problemCount: 2 }, "2");
    render(<LogicWorksheet mode="puzzle" problems={problems} showAnswers={true} />);
    problems.forEach((p) => {
      expect(screen.getByText(`Answer: ${p.answer[0]}`)).toBeInTheDocument();
    });
  });

  it("shows solution for sorting mode", () => {
    const problems = generateLogicProblems("sorting", { problemCount: 1 }, "2");
    render(<LogicWorksheet mode="sorting" problems={problems} showAnswers={true} />);
    const expectedText = problems[0].answer.join(" → ");
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
