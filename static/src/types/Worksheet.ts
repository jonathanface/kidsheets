export type GradeLevel = "prek" | "k" | "1" | "2" | "3" | "4" | "5";

export type WorksheetType =
  | "arithmetic"
  | "fractions"
  | "counting"
  | "telling-time"
  | "money"
  | "tracing"
  | "spelling"
  | "sight-words"
  | "vocabulary"
  | "logic-puzzle"
  | "logic-sorting"
  | "logic-sequencing"
  | "mazes";

export type WorksheetCategory = "math" | "reading" | "motor-skills" | "logic";

export interface CategoryDefinition {
  label: string;
  types: WorksheetType[];
}

export const WORKSHEET_CATEGORIES: Record<WorksheetCategory, CategoryDefinition> = {
  math: { label: "Math", types: ["arithmetic", "fractions", "counting", "telling-time", "money"] },
  reading: { label: "Reading", types: ["spelling", "sight-words", "vocabulary"] },
  "motor-skills": { label: "Motor Skills", types: ["tracing", "mazes"] },
  logic: { label: "Logic", types: ["logic-puzzle", "logic-sorting", "logic-sequencing"] },
};

export type ArithmeticOperation = "addition" | "subtraction" | "multiplication" | "division";

export interface ArithmeticConfig {
  operations: ArithmeticOperation[];
  minNumber: number;
  maxNumber: number;
  problemCount: number;
}

export interface FractionsConfig {
  problemCount: number;
}

export interface FractionsProblem {
  instruction: string;
  display: string;
  answer: string;
}

export interface CountingConfig {
  problemCount: number;
}

export interface CountingProblem {
  instruction: string;
  sequence: string[];
  blankIndex: number;
  answer: string;
}

export interface TellingTimeConfig {
  problemCount: number;
}

export interface TellingTimeProblem {
  hour: number;
  minute: number;
  answer: string;
  instruction: string;
}

export interface MoneyConfig {
  problemCount: number;
}

export interface MoneyProblem {
  instruction: string;
  coins: { type: string; count: number }[];
  answer: string;
}

export interface TracingConfig {
  content: "uppercase" | "lowercase" | "numbers" | "shapes";
  repetitions: number;
}

export interface SpellingConfig {
  wordCount: number;
  mode: "fill-in-blank" | "word-scramble" | "write-word";
}

export interface SightWordsConfig {
  wordCount: number;
}

export interface SightWordItem {
  word: string;
}

export interface VocabularyConfig {
  wordCount: number;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  options: string[];
  answer: string;
}

export interface MazeConfig {
  mazeCount: number;
}

// Each cell stores which walls are open (true = passage, false = wall)
export interface MazeCell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface MazeData {
  rows: number;
  cols: number;
  grid: MazeCell[][];
  solution: [number, number][];
}

export type LogicMode = "puzzle" | "sorting" | "sequencing";

export interface LogicConfig {
  problemCount: number;
}

export interface LogicProblem {
  instruction: string;
  items: string[];
  answer: string[];
}

export interface WorksheetSection {
  id: string;
  type: WorksheetType;
  arithmetic?: ArithmeticConfig;
  fractions?: FractionsConfig;
  counting?: CountingConfig;
  tellingTime?: TellingTimeConfig;
  money?: MoneyConfig;
  tracing?: TracingConfig;
  mazes?: MazeConfig;
  spelling?: SpellingConfig;
  sightWords?: SightWordsConfig;
  vocabulary?: VocabularyConfig;
  logic?: LogicConfig;
}

export interface WorksheetConfig {
  grade: GradeLevel;
  title: string;
  sections: WorksheetSection[];
}

export interface ArithmeticProblem {
  a: number;
  b: number;
  operation: ArithmeticOperation;
  answer: number;
}

export interface SpellingWord {
  word: string;
  hint: string;
  scrambled?: string;
  blanked?: string;
}
