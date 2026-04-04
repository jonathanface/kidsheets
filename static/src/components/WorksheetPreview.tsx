import { useMemo } from "react";
import {
  WorksheetConfig,
  WorksheetSection,
  LogicMode,
  ArithmeticProblem,
  FractionsProblem,
  CountingProblem,
  TellingTimeProblem,
  MoneyProblem,
  SpellingWord,
  SightWordItem,
  VocabularyItem,
  MazeData,
  LogicProblem,
} from "../types/Worksheet";
import {
  generateArithmeticProblems,
  generateFractionsProblems,
  generateCountingProblems,
  generateTellingTimeProblems,
  generateMoneyProblems,
  generateSpellingWords,
  generateSightWords,
  generateVocabulary,
  generateMazes,
  generateLogicProblems,
  GRADE_LABELS,
} from "../utils/generators";
import { ArithmeticWorksheet } from "./ArithmeticWorksheet";
import { FractionsWorksheet } from "./FractionsWorksheet";
import { CountingWorksheet } from "./CountingWorksheet";
import { TellingTimeWorksheet } from "./TellingTimeWorksheet";
import { MoneyWorksheet } from "./MoneyWorksheet";
import { TracingWorksheet } from "./TracingWorksheet";
import { MazeWorksheet } from "./MazeWorksheet";
import { SpellingWorksheet } from "./SpellingWorksheet";
import { SightWordsWorksheet } from "./SightWordsWorksheet";
import { VocabularyWorksheet } from "./VocabularyWorksheet";
import { LogicWorksheet } from "./LogicWorksheet";

interface Props {
  config: WorksheetConfig;
  regenerateKey: number;
  onRemoveSection: (id: string) => void;
}

interface GeneratedData {
  arithmetic: Map<string, ArithmeticProblem[]>;
  fractions: Map<string, FractionsProblem[]>;
  counting: Map<string, CountingProblem[]>;
  tellingTime: Map<string, TellingTimeProblem[]>;
  money: Map<string, MoneyProblem[]>;
  spelling: Map<string, SpellingWord[]>;
  sightWords: Map<string, SightWordItem[]>;
  vocabulary: Map<string, VocabularyItem[]>;
  mazes: Map<string, MazeData[]>;
  logic: Map<string, LogicProblem[]>;
}

export const WorksheetPreview = ({ config, regenerateKey, onRemoveSection }: Props) => {
  const generated = useMemo<GeneratedData>(() => {
    const arithmetic = new Map<string, ArithmeticProblem[]>();
    const fractions = new Map<string, FractionsProblem[]>();
    const counting = new Map<string, CountingProblem[]>();
    const tellingTime = new Map<string, TellingTimeProblem[]>();
    const money = new Map<string, MoneyProblem[]>();
    const spelling = new Map<string, SpellingWord[]>();
    const sightWords = new Map<string, SightWordItem[]>();
    const vocabulary = new Map<string, VocabularyItem[]>();
    const mazes = new Map<string, MazeData[]>();
    const logic = new Map<string, LogicProblem[]>();

    for (const section of config.sections) {
      if (section.type === "arithmetic" && section.arithmetic) {
        arithmetic.set(section.id, generateArithmeticProblems(section.arithmetic));
      }
      if (section.type === "fractions" && section.fractions) {
        fractions.set(section.id, generateFractionsProblems(section.fractions, config.grade));
      }
      if (section.type === "counting" && section.counting) {
        counting.set(section.id, generateCountingProblems(section.counting, config.grade));
      }
      if (section.type === "telling-time" && section.tellingTime) {
        tellingTime.set(section.id, generateTellingTimeProblems(section.tellingTime, config.grade));
      }
      if (section.type === "money" && section.money) {
        money.set(section.id, generateMoneyProblems(section.money, config.grade));
      }
      if (section.type === "spelling" && section.spelling) {
        spelling.set(section.id, generateSpellingWords(section.spelling, config.grade));
      }
      if (section.type === "sight-words" && section.sightWords) {
        sightWords.set(section.id, generateSightWords(section.sightWords, config.grade));
      }
      if (section.type === "vocabulary" && section.vocabulary) {
        vocabulary.set(section.id, generateVocabulary(section.vocabulary, config.grade));
      }
      if (section.type === "mazes" && section.mazes) {
        mazes.set(section.id, generateMazes(section.mazes, config.grade));
      }
      if (section.type.startsWith("logic-") && section.logic) {
        const mode = section.type.replace("logic-", "") as LogicMode;
        logic.set(section.id, generateLogicProblems(mode, section.logic, config.grade));
      }
    }

    return { arithmetic, fractions, counting, tellingTime, money, spelling, sightWords, vocabulary, mazes, logic };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.sections, config.grade, regenerateKey]);

  const NO_ANSWER_TYPES = new Set(["tracing", "sight-words", "mazes"]);
  const hasAnswers = config.sections.some(
    (s) => !NO_ANSWER_TYPES.has(s.type)
  );

  return (
    <div className="worksheet-preview" id="worksheet-print-area">
      <div className="worksheet-header">
        <h1 className="worksheet-title">{config.title || "Worksheet"}</h1>
        <p className="worksheet-grade">{GRADE_LABELS[config.grade]}</p>
        <div className="worksheet-name-line">
          Name: <span className="name-underline" />
          Date: <span className="name-underline short" />
        </div>
      </div>

      <div className="worksheet-body">
        {config.sections.map((section) => (
          <div key={section.id} className="worksheet-section-wrapper">
            <button
              className="worksheet-section-remove no-print"
              onClick={() => onRemoveSection(section.id)}
            >
              Remove
            </button>
            <SectionRenderer
              section={section}
              generated={generated}
              showAnswers={false}
            />
          </div>
        ))}
        {config.sections.length === 0 && (
          <p className="empty-worksheet">Add sections from the config panel to build your worksheet.</p>
        )}
      </div>

      {hasAnswers && (
        <div className="answer-key">
          <h2>Answer Key</h2>
          {config.sections.map((section) => {
            if (NO_ANSWER_TYPES.has(section.type)) return null;
            return (
              <SectionRenderer
                key={`answer-${section.id}`}
                section={section}
                generated={generated}
                showAnswers={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

function SectionRenderer({
  section,
  generated,
  showAnswers,
}: {
  section: WorksheetSection;
  generated: GeneratedData;
  showAnswers: boolean;
}) {
  return (
    <div className="worksheet-section">
      {section.type === "arithmetic" && section.arithmetic && generated.arithmetic.get(section.id) && (
        <ArithmeticWorksheet problems={generated.arithmetic.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "fractions" && section.fractions && generated.fractions.get(section.id) && (
        <FractionsWorksheet problems={generated.fractions.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "counting" && section.counting && generated.counting.get(section.id) && (
        <CountingWorksheet problems={generated.counting.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "telling-time" && section.tellingTime && generated.tellingTime.get(section.id) && (
        <TellingTimeWorksheet problems={generated.tellingTime.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "money" && section.money && generated.money.get(section.id) && (
        <MoneyWorksheet problems={generated.money.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "tracing" && section.tracing && (
        <TracingWorksheet config={section.tracing} />
      )}
      {section.type === "mazes" && section.mazes && generated.mazes.get(section.id) && (
        <MazeWorksheet mazes={generated.mazes.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "spelling" && section.spelling && generated.spelling.get(section.id) && (
        <SpellingWorksheet
          words={generated.spelling.get(section.id)!}
          config={section.spelling}
          showAnswers={showAnswers}
        />
      )}
      {section.type === "sight-words" && section.sightWords && generated.sightWords.get(section.id) && (
        <SightWordsWorksheet words={generated.sightWords.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type === "vocabulary" && section.vocabulary && generated.vocabulary.get(section.id) && (
        <VocabularyWorksheet items={generated.vocabulary.get(section.id)!} showAnswers={showAnswers} />
      )}
      {section.type.startsWith("logic-") && section.logic && generated.logic.get(section.id) && (
        <LogicWorksheet
          mode={section.type.replace("logic-", "") as LogicMode}
          problems={generated.logic.get(section.id)!}
          showAnswers={showAnswers}
        />
      )}
    </div>
  );
}
