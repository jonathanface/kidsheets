import { useState } from "react";
import {
  WorksheetConfig,
  WorksheetSection,
  GradeLevel,
  WorksheetType,
  WorksheetCategory,
  ArithmeticOperation,
  WORKSHEET_CATEGORIES,
} from "../types/Worksheet";
import { GRADE_LABELS, DEFAULT_ARITHMETIC_BY_GRADE, DEFAULT_LOGIC_PROBLEM_COUNT } from "../utils/generators";

interface Props {
  config: WorksheetConfig;
  onChange: (config: WorksheetConfig) => void;
  onRegenerate: () => void;
  onPrint: (withAnswers: boolean) => void;
}

let nextSectionId = 1;

function createSection(type: WorksheetType, grade: GradeLevel): WorksheetSection {
  const id = `section-${nextSectionId++}`;
  switch (type) {
    case "arithmetic":
      return { id, type, arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE[grade] } };
    case "fractions":
      return { id, type, fractions: { problemCount: 8 } };
    case "counting":
      return { id, type, counting: { problemCount: 8 } };
    case "telling-time":
      return { id, type, tellingTime: { problemCount: 6 } };
    case "money":
      return { id, type, money: { problemCount: 6 } };
    case "tracing":
      return { id, type, tracing: { content: "uppercase", repetitions: 4 } };
    case "mazes":
      return { id, type, mazes: { mazeCount: 2 } };
    case "spelling":
      return { id, type, spelling: { wordCount: 8, mode: "fill-in-blank" } };
    case "sight-words":
      return { id, type, sightWords: { wordCount: 10 } };
    case "vocabulary":
      return { id, type, vocabulary: { wordCount: 6 } };
    case "logic-puzzle":
    case "logic-sorting":
    case "logic-sequencing":
      return { id, type, logic: { problemCount: DEFAULT_LOGIC_PROBLEM_COUNT[grade] } };
  }
}

const TYPE_LABELS: Record<WorksheetType, string> = {
  arithmetic: "Arithmetic",
  fractions: "Fractions",
  counting: "Counting",
  "telling-time": "Telling Time",
  money: "Money",
  "sight-words": "Sight Words",
  vocabulary: "Vocabulary",
  tracing: "Tracing",
  mazes: "Mazes",
  spelling: "Spelling",
  "logic-puzzle": "Odd One Out",
  "logic-sorting": "Sorting",
  "logic-sequencing": "What Comes Next",
};

function categoryForType(type: WorksheetType): WorksheetCategory {
  for (const [cat, def] of Object.entries(WORKSHEET_CATEGORIES)) {
    if (def.types.includes(type)) return cat as WorksheetCategory;
  }
  return "math";
}

export const ConfigPanel = ({ config, onChange, onRegenerate, onPrint }: Props) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<WorksheetCategory>>(new Set());

  const toggleCategory = (cat: WorksheetCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const updateSection = (id: string, updated: Partial<WorksheetSection>) => {
    onChange({
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, ...updated } : s
      ),
    });
  };

  const removeSection = (id: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== id),
    });
  };

  const addSection = (type: WorksheetType) => {
    onChange({
      ...config,
      sections: [...config.sections, createSection(type, config.grade)],
    });
  };

  const updateGrade = (grade: GradeLevel) => {
    onChange({
      ...config,
      grade,
      sections: config.sections.map((s) => {
        if (s.type === "arithmetic") return { ...s, arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE[grade] } };
        if (s.type.startsWith("logic-")) return { ...s, logic: { problemCount: DEFAULT_LOGIC_PROBLEM_COUNT[grade] } };
        return s;
      }),
    });
  };

  return (
    <div className="config-panel">
      <h2>Configure Worksheet</h2>

      <label>
        Title
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="My Worksheet"
        />
      </label>

      <label>
        Grade Level
        <select
          value={config.grade}
          onChange={(e) => updateGrade(e.target.value as GradeLevel)}
        >
          {Object.entries(GRADE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>

      <div className="sections-header">
        <h3>Sections</h3>
        <div className="add-section-categories">
          {Object.entries(WORKSHEET_CATEGORIES).map(([key, cat]) => {
            const catKey = key as WorksheetCategory;
            const isExpanded = expandedCategories.has(catKey);
            return (
              <div key={key} className={`category-group${isExpanded ? " expanded" : ""}`} data-category={key}>
                <button
                  className="category-toggle"
                  onClick={() => toggleCategory(catKey)}
                >
                  <span className="category-chevron">{isExpanded ? "▾" : "▸"}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
                {isExpanded && (
                  <div className="category-buttons">
                    {cat.types.map((type) => (
                      <button
                        key={type}
                        className="btn btn-small"
                        onClick={() => addSection(type)}
                      >
                        + {TYPE_LABELS[type]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {config.sections.length === 0 && (
        <p className="empty-hint">Add a section to get started.</p>
      )}

      {config.sections.map((section) => (
        <div key={section.id} className="section-config" data-category={categoryForType(section.type)}>
          <div className="section-header">
            <span className="section-type-badge" data-category={categoryForType(section.type)}>{TYPE_LABELS[section.type]}</span>
            <button
              className="btn-remove"
              onClick={() => removeSection(section.id)}
              title="Remove section"
            >
              &times;
            </button>
          </div>

          {section.type === "arithmetic" && section.arithmetic && (
            <SectionArithmetic
              config={section.arithmetic}
              onChange={(arithmetic) => updateSection(section.id, { arithmetic })}
            />
          )}
          {section.type === "fractions" && section.fractions && (
            <SectionProblemCount
              config={section.fractions}
              onChange={(fractions) => updateSection(section.id, { fractions })}
              max={12}
            />
          )}
          {section.type === "counting" && section.counting && (
            <SectionProblemCount
              config={section.counting}
              onChange={(counting) => updateSection(section.id, { counting })}
              max={12}
            />
          )}
          {section.type === "telling-time" && section.tellingTime && (
            <SectionProblemCount
              config={section.tellingTime}
              onChange={(tellingTime) => updateSection(section.id, { tellingTime })}
              max={12}
            />
          )}
          {section.type === "money" && section.money && (
            <SectionProblemCount
              config={section.money}
              onChange={(money) => updateSection(section.id, { money })}
              max={12}
            />
          )}
          {section.type === "tracing" && section.tracing && (
            <SectionTracing
              config={section.tracing}
              onChange={(tracing) => updateSection(section.id, { tracing })}
            />
          )}
          {section.type === "mazes" && section.mazes && (
            <SectionMazeCount
              config={section.mazes}
              onChange={(mazes) => updateSection(section.id, { mazes })}
            />
          )}
          {section.type === "spelling" && section.spelling && (
            <SectionSpelling
              config={section.spelling}
              onChange={(spelling) => updateSection(section.id, { spelling })}
            />
          )}
          {section.type === "sight-words" && section.sightWords && (
            <SectionWordCount
              config={section.sightWords}
              onChange={(sightWords) => updateSection(section.id, { sightWords })}
              max={20}
            />
          )}
          {section.type === "vocabulary" && section.vocabulary && (
            <SectionWordCount
              config={section.vocabulary}
              onChange={(vocabulary) => updateSection(section.id, { vocabulary })}
              max={10}
            />
          )}
          {section.type.startsWith("logic-") && section.logic && (
            <SectionProblemCount
              config={section.logic}
              onChange={(logic) => updateSection(section.id, { logic })}
              max={6}
            />
          )}
        </div>
      ))}

      <div className="button-group">
        <button onClick={onRegenerate} className="btn btn-secondary">
          Regenerate
        </button>
      </div>
      <div className="button-group">
        <button
          onClick={() => onPrint(false)}
          className="btn btn-primary"
          disabled={config.sections.length === 0}
        >
          Print
        </button>
        <button
          onClick={() => onPrint(true)}
          className="btn btn-primary"
          disabled={config.sections.length === 0}
        >
          Print with Answers
        </button>
      </div>
    </div>
  );
};

function SectionArithmetic({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["arithmetic"]>;
  onChange: (c: NonNullable<WorksheetSection["arithmetic"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Problems
        <input
          type="number"
          min={1}
          max={50}
          value={config.problemCount}
          onChange={(e) => onChange({ ...config, problemCount: parseInt(e.target.value) || 10 })}
        />
      </label>
      <div className="inline-fields">
        <label>
          Min
          <input
            type="number"
            min={0}
            value={config.minNumber}
            onChange={(e) => onChange({ ...config, minNumber: parseInt(e.target.value) || 0 })}
          />
        </label>
        <label>
          Max
          <input
            type="number"
            min={1}
            value={config.maxNumber}
            onChange={(e) => onChange({ ...config, maxNumber: parseInt(e.target.value) || 10 })}
          />
        </label>
      </div>
      <div className="checkbox-group">
        <span>Operations</span>
        {(["addition", "subtraction", "multiplication", "division"] as ArithmeticOperation[]).map((op) => (
          <label key={op} className="checkbox-label">
            <input
              type="checkbox"
              checked={config.operations.includes(op)}
              onChange={(e) => {
                const ops = e.target.checked
                  ? [...config.operations, op]
                  : config.operations.filter((o) => o !== op);
                if (ops.length === 0) return;
                onChange({ ...config, operations: ops });
              }}
            />
            {op}
          </label>
        ))}
      </div>
    </div>
  );
}

function SectionTracing({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["tracing"]>;
  onChange: (c: NonNullable<WorksheetSection["tracing"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Content
        <select
          value={config.content}
          onChange={(e) =>
            onChange({ ...config, content: e.target.value as typeof config.content })
          }
        >
          <option value="uppercase">Uppercase Letters</option>
          <option value="lowercase">Lowercase Letters</option>
          <option value="numbers">Numbers 0-9</option>
          <option value="shapes">Shapes</option>
        </select>
      </label>
      <label>
        Repetitions
        <input
          type="number"
          min={1}
          max={10}
          value={config.repetitions}
          onChange={(e) => onChange({ ...config, repetitions: parseInt(e.target.value) || 4 })}
        />
      </label>
    </div>
  );
}

function SectionSpelling({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["spelling"]>;
  onChange: (c: NonNullable<WorksheetSection["spelling"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Words
        <input
          type="number"
          min={1}
          max={10}
          value={config.wordCount}
          onChange={(e) => onChange({ ...config, wordCount: parseInt(e.target.value) || 8 })}
        />
      </label>
      <label>
        Mode
        <select
          value={config.mode}
          onChange={(e) =>
            onChange({ ...config, mode: e.target.value as typeof config.mode })
          }
        >
          <option value="fill-in-blank">Fill in the Blank</option>
          <option value="word-scramble">Word Scramble</option>
          <option value="write-word">Write the Word</option>
        </select>
      </label>
    </div>
  );
}

function SectionProblemCount({
  config,
  onChange,
  max = 12,
}: {
  config: { problemCount: number };
  onChange: (c: { problemCount: number }) => void;
  max?: number;
}) {
  return (
    <div className="section-options">
      <label>
        Problems
        <input
          type="number"
          min={1}
          max={max}
          value={config.problemCount}
          onChange={(e) => onChange({ ...config, problemCount: parseInt(e.target.value) || 4 })}
        />
      </label>
    </div>
  );
}

function SectionWordCount({
  config,
  onChange,
  max = 10,
}: {
  config: { wordCount: number };
  onChange: (c: { wordCount: number }) => void;
  max?: number;
}) {
  return (
    <div className="section-options">
      <label>
        Words
        <input
          type="number"
          min={1}
          max={max}
          value={config.wordCount}
          onChange={(e) => onChange({ ...config, wordCount: parseInt(e.target.value) || 8 })}
        />
      </label>
    </div>
  );
}

function SectionMazeCount({
  config,
  onChange,
}: {
  config: { mazeCount: number };
  onChange: (c: { mazeCount: number }) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Mazes
        <input
          type="number"
          min={1}
          max={4}
          value={config.mazeCount}
          onChange={(e) => onChange({ ...config, mazeCount: parseInt(e.target.value) || 2 })}
        />
      </label>
    </div>
  );
}
