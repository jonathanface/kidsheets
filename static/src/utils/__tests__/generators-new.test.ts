import { describe, it, expect } from "vitest";
import {
  generateFractionsProblems,
  generateCountingProblems,
  generateTellingTimeProblems,
  generateMoneyProblems,
  generateSightWords,
  generateVocabulary,
  generateMazes,
  generateLogicProblems,
  DEFAULT_LOGIC_PROBLEM_COUNT,
} from "../generators";
import { GradeLevel } from "../../types/Worksheet";

const ALL_GRADES: GradeLevel[] = ["prek", "k", "1", "2", "3", "4", "5"];

describe("generateFractionsProblems", () => {
  it("generates the correct number of problems", () => {
    const problems = generateFractionsProblems({ problemCount: 6 }, "3");
    expect(problems).toHaveLength(6);
  });

  it("generates problems for all grades without errors", () => {
    ALL_GRADES.forEach((grade) => {
      const problems = generateFractionsProblems({ problemCount: 4 }, grade);
      expect(problems.length).toBeGreaterThan(0);
      problems.forEach((p) => {
        expect(p.instruction).toBeTruthy();
        expect(p.display).toBeTruthy();
        expect(p.answer).toBeTruthy();
      });
    });
  });

  it("generates simplify problems for grade 3", () => {
    const problems = generateFractionsProblems({ problemCount: 10 }, "3");
    problems.forEach((p) => {
      expect(p.instruction).toContain("Simplify");
    });
  });

  it("generates addition problems for grade 4", () => {
    const problems = generateFractionsProblems({ problemCount: 10 }, "4");
    problems.forEach((p) => {
      expect(p.instruction).toContain("Add");
    });
  });
});

describe("generateCountingProblems", () => {
  it("generates the correct number of problems", () => {
    const problems = generateCountingProblems({ problemCount: 8 }, "1");
    expect(problems).toHaveLength(8);
  });

  it("generates problems with a blank index within the sequence", () => {
    const problems = generateCountingProblems({ problemCount: 10 }, "2");
    problems.forEach((p) => {
      expect(p.blankIndex).toBeGreaterThanOrEqual(1);
      expect(p.blankIndex).toBeLessThan(p.sequence.length - 1);
      expect(p.answer).toBe(p.sequence[p.blankIndex]);
    });
  });

  it("generates problems for all grades without errors", () => {
    ALL_GRADES.forEach((grade) => {
      const problems = generateCountingProblems({ problemCount: 4 }, grade);
      expect(problems.length).toBeGreaterThan(0);
      problems.forEach((p) => {
        expect(p.instruction).toBeTruthy();
        expect(p.sequence.length).toBeGreaterThanOrEqual(5);
      });
    });
  });
});

describe("generateTellingTimeProblems", () => {
  it("generates the correct number of problems", () => {
    const problems = generateTellingTimeProblems({ problemCount: 6 }, "2");
    expect(problems).toHaveLength(6);
  });

  it("generates on-the-hour for pre-k", () => {
    const problems = generateTellingTimeProblems({ problemCount: 20 }, "prek");
    problems.forEach((p) => {
      expect(p.minute).toBe(0);
      expect(p.hour).toBeGreaterThanOrEqual(1);
      expect(p.hour).toBeLessThanOrEqual(12);
    });
  });

  it("generates hour/half-hour for grade 1", () => {
    const problems = generateTellingTimeProblems({ problemCount: 20 }, "1");
    problems.forEach((p) => {
      expect([0, 30]).toContain(p.minute);
    });
  });

  it("generates quarter-hour for grade 2", () => {
    const problems = generateTellingTimeProblems({ problemCount: 20 }, "2");
    problems.forEach((p) => {
      expect([0, 15, 30, 45]).toContain(p.minute);
    });
  });

  it("formats answer as H:MM", () => {
    const problems = generateTellingTimeProblems({ problemCount: 10 }, "3");
    problems.forEach((p) => {
      expect(p.answer).toMatch(/^\d{1,2}:\d{2}$/);
    });
  });
});

describe("generateMoneyProblems", () => {
  it("generates the correct number of problems", () => {
    const problems = generateMoneyProblems({ problemCount: 6 }, "2");
    expect(problems).toHaveLength(6);
  });

  it("generates problems with valid coin types", () => {
    const validTypes = new Set(["penny", "nickel", "dime", "quarter"]);
    ALL_GRADES.forEach((grade) => {
      const problems = generateMoneyProblems({ problemCount: 4 }, grade);
      problems.forEach((p) => {
        expect(p.coins.length).toBeGreaterThan(0);
        p.coins.forEach((c) => {
          expect(validTypes.has(c.type)).toBe(true);
          expect(c.count).toBeGreaterThan(0);
        });
        expect(p.answer).toBeTruthy();
      });
    });
  });

  it("formats answer with cent or dollar sign", () => {
    const problems = generateMoneyProblems({ problemCount: 10 }, "4");
    problems.forEach((p) => {
      expect(p.answer).toMatch(/^\d+¢$|^\$\d+\.\d{2}$/);
    });
  });
});

describe("generateSightWords", () => {
  it("generates the correct number of words", () => {
    const words = generateSightWords({ wordCount: 8 }, "1");
    expect(words).toHaveLength(8);
  });

  it("generates words for all grades", () => {
    ALL_GRADES.forEach((grade) => {
      const words = generateSightWords({ wordCount: 5 }, grade);
      expect(words).toHaveLength(5);
      words.forEach((w) => {
        expect(w.word).toBeTruthy();
        expect(typeof w.word).toBe("string");
      });
    });
  });

  it("caps at available words", () => {
    const words = generateSightWords({ wordCount: 100 }, "prek");
    expect(words.length).toBeLessThanOrEqual(100);
    expect(words.length).toBeGreaterThan(0);
  });
});

describe("generateVocabulary", () => {
  it("generates the correct number of items", () => {
    const items = generateVocabulary({ wordCount: 5 }, "2");
    expect(items).toHaveLength(5);
  });

  it("each item has 4 options including the correct answer", () => {
    const items = generateVocabulary({ wordCount: 6 }, "3");
    items.forEach((item) => {
      expect(item.options).toHaveLength(4);
      expect(item.options).toContain(item.answer);
      expect(item.answer).toBe(item.definition);
    });
  });

  it("generates items for all grades", () => {
    ALL_GRADES.forEach((grade) => {
      const items = generateVocabulary({ wordCount: 4 }, grade);
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item.word).toBeTruthy();
        expect(item.definition).toBeTruthy();
      });
    });
  });
});

describe("generateMazes", () => {
  it("generates the correct number of mazes", () => {
    const mazes = generateMazes({ mazeCount: 3 }, "2");
    expect(mazes).toHaveLength(3);
  });

  it("generates mazes with correct grid dimensions per grade", () => {
    const mazes = generateMazes({ mazeCount: 1 }, "prek");
    expect(mazes[0].rows).toBe(4);
    expect(mazes[0].cols).toBe(4);

    const mazes5 = generateMazes({ mazeCount: 1 }, "5");
    expect(mazes5[0].rows).toBe(14);
    expect(mazes5[0].cols).toBe(14);
  });

  it("generates a solvable maze with a solution path", () => {
    const mazes = generateMazes({ mazeCount: 1 }, "3");
    const maze = mazes[0];
    expect(maze.solution.length).toBeGreaterThan(1);
    // Path starts at top-left
    expect(maze.solution[0]).toEqual([0, 0]);
    // Path ends at bottom-right
    expect(maze.solution[maze.solution.length - 1]).toEqual([maze.rows - 1, maze.cols - 1]);
  });

  it("grid cells have correct wall structure", () => {
    const mazes = generateMazes({ mazeCount: 1 }, "1");
    const maze = mazes[0];
    expect(maze.grid.length).toBe(maze.rows);
    maze.grid.forEach((row) => {
      expect(row.length).toBe(maze.cols);
      row.forEach((cell) => {
        expect(typeof cell.top).toBe("boolean");
        expect(typeof cell.right).toBe("boolean");
        expect(typeof cell.bottom).toBe("boolean");
        expect(typeof cell.left).toBe("boolean");
      });
    });
  });
});

describe("generateLogicProblems", () => {
  it("generates puzzle problems", () => {
    const problems = generateLogicProblems("puzzle", { problemCount: 4 }, "2");
    expect(problems).toHaveLength(4);
    problems.forEach((p) => {
      expect(p.instruction).toContain("NOT belong");
      expect(p.items.length).toBeGreaterThanOrEqual(4);
      expect(p.answer).toHaveLength(1);
    });
  });

  it("generates sorting problems", () => {
    const problems = generateLogicProblems("sorting", { problemCount: 3 }, "3");
    expect(problems).toHaveLength(3);
    problems.forEach((p) => {
      expect(p.items.length).toBeGreaterThanOrEqual(3);
      expect(p.answer.length).toBe(p.items.length);
    });
  });

  it("generates sequencing problems", () => {
    const problems = generateLogicProblems("sequencing", { problemCount: 4 }, "1");
    expect(problems).toHaveLength(4);
    problems.forEach((p) => {
      expect(p.instruction).toContain("What comes next");
      expect(p.answer).toHaveLength(1);
    });
  });

  it("generates problems for all grades and modes", () => {
    const modes = ["puzzle", "sorting", "sequencing"] as const;
    ALL_GRADES.forEach((grade) => {
      modes.forEach((mode) => {
        const problems = generateLogicProblems(mode, { problemCount: 2 }, grade);
        expect(problems.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("DEFAULT_LOGIC_PROBLEM_COUNT", () => {
  it("has counts for all grades", () => {
    ALL_GRADES.forEach((grade) => {
      expect(DEFAULT_LOGIC_PROBLEM_COUNT[grade]).toBeGreaterThan(0);
    });
  });
});
