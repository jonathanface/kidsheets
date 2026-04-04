import {
  ArithmeticConfig,
  ArithmeticOperation,
  ArithmeticProblem,
  CountingConfig,
  CountingProblem,
  FractionsConfig,
  FractionsProblem,
  GradeLevel,
  LogicConfig,
  LogicMode,
  LogicProblem,
  MazeCell,
  MazeConfig,
  MazeData,
  MoneyConfig,
  MoneyProblem,
  SightWordsConfig,
  SightWordItem,
  SpellingConfig,
  SpellingWord,
  TellingTimeConfig,
  TellingTimeProblem,
  VocabularyConfig,
  VocabularyItem,
} from "../types/Worksheet";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computeAnswer(a: number, b: number, op: ArithmeticOperation): number {
  switch (op) {
    case "addition": return a + b;
    case "subtraction": return a - b;
    case "multiplication": return a * b;
    case "division": return a; // a is the product, b is divisor, answer is quotient
  }
}

function operationSymbol(op: ArithmeticOperation): string {
  switch (op) {
    case "addition": return "+";
    case "subtraction": return "-";
    case "multiplication": return "×";
    case "division": return "÷";
  }
}

export function generateArithmeticProblems(config: ArithmeticConfig): ArithmeticProblem[] {
  const problems: ArithmeticProblem[] = [];

  for (let i = 0; i < config.problemCount; i++) {
    const op = config.operations[randInt(0, config.operations.length - 1)];
    let a: number, b: number, answer: number;

    if (op === "subtraction") {
      // Ensure no negative answers
      a = randInt(config.minNumber, config.maxNumber);
      b = randInt(config.minNumber, Math.min(a, config.maxNumber));
      answer = a - b;
    } else if (op === "division") {
      // Ensure clean division
      b = randInt(Math.max(1, config.minNumber), config.maxNumber);
      const quotient = randInt(1, Math.floor(config.maxNumber / Math.max(b, 1)));
      a = b * quotient;
      answer = quotient;
    } else {
      a = randInt(config.minNumber, config.maxNumber);
      b = randInt(config.minNumber, config.maxNumber);
      answer = computeAnswer(a, b, op);
    }

    problems.push({ a, b, operation: op, answer });
  }

  return problems;
}

export { operationSymbol };

const SPELLING_WORDS: Record<GradeLevel, { word: string; hint: string }[]> = {
  prek: [
    { word: "cat", hint: "A furry pet that says meow" },
    { word: "dog", hint: "A pet that barks" },
    { word: "sun", hint: "It shines in the sky" },
    { word: "hat", hint: "You wear it on your head" },
    { word: "cup", hint: "You drink from it" },
    { word: "red", hint: "The color of a fire truck" },
    { word: "big", hint: "Not small" },
    { word: "run", hint: "Moving fast on your feet" },
    { word: "mom", hint: "Your mother" },
    { word: "dad", hint: "Your father" },
  ],
  k: [
    { word: "fish", hint: "It swims in water" },
    { word: "tree", hint: "It grows leaves" },
    { word: "book", hint: "You read this" },
    { word: "ball", hint: "Round toy you throw" },
    { word: "star", hint: "Twinkles in the night sky" },
    { word: "cake", hint: "A birthday treat" },
    { word: "bird", hint: "It has wings and flies" },
    { word: "frog", hint: "A green animal that hops" },
    { word: "rain", hint: "Water falling from clouds" },
    { word: "hand", hint: "It has five fingers" },
  ],
  "1": [
    { word: "happy", hint: "Feeling glad" },
    { word: "house", hint: "A place to live" },
    { word: "water", hint: "You drink this" },
    { word: "apple", hint: "A round red fruit" },
    { word: "green", hint: "The color of grass" },
    { word: "smile", hint: "A happy face" },
    { word: "sleep", hint: "What you do at night" },
    { word: "light", hint: "It helps you see" },
    { word: "cloud", hint: "White and fluffy in the sky" },
    { word: "plant", hint: "It grows from a seed" },
  ],
  "2": [
    { word: "friend", hint: "Someone you like to play with" },
    { word: "garden", hint: "Where flowers grow" },
    { word: "basket", hint: "You carry things in it" },
    { word: "kitten", hint: "A baby cat" },
    { word: "rabbit", hint: "An animal with long ears" },
    { word: "winter", hint: "The cold season" },
    { word: "summer", hint: "The hot season" },
    { word: "purple", hint: "A color mixed from red and blue" },
    { word: "butter", hint: "Spread on bread" },
    { word: "castle", hint: "Where a king lives" },
  ],
  "3": [
    { word: "because", hint: "Gives a reason why" },
    { word: "example", hint: "A sample of something" },
    { word: "believe", hint: "To think something is true" },
    { word: "picture", hint: "A photo or drawing" },
    { word: "country", hint: "A nation like the USA" },
    { word: "kitchen", hint: "Room where you cook" },
    { word: "weather", hint: "Rain, sun, or snow" },
    { word: "thought", hint: "An idea in your head" },
    { word: "special", hint: "Not ordinary" },
    { word: "another", hint: "One more" },
  ],
  "4": [
    { word: "calendar", hint: "Shows days and months" },
    { word: "question", hint: "Something you ask" },
    { word: "straight", hint: "Not curved or bent" },
    { word: "surprise", hint: "Something unexpected" },
    { word: "language", hint: "English is one of these" },
    { word: "mountain", hint: "Very tall land formation" },
    { word: "dinosaur", hint: "Extinct reptile" },
    { word: "favorite", hint: "The one you like best" },
    { word: "sentence", hint: "A group of words" },
    { word: "together", hint: "With each other" },
  ],
  "5": [
    { word: "character", hint: "A person in a story" },
    { word: "education", hint: "Learning at school" },
    { word: "pollution", hint: "Harmful stuff in the air or water" },
    { word: "continent", hint: "Large land mass like Africa" },
    { word: "invention", hint: "Something new that was created" },
    { word: "knowledge", hint: "What you know" },
    { word: "paragraph", hint: "A section of writing" },
    { word: "important", hint: "Matters a lot" },
    { word: "dangerous", hint: "Could be harmful" },
    { word: "necessary", hint: "You must have it" },
  ],
};

function scrambleWord(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const result = chars.join("");
  return result === word ? scrambleWord(word) : result;
}

function blankWord(word: string): string {
  const chars = word.split("");
  const blankCount = Math.max(1, Math.floor(chars.length * 0.4));
  const indices = new Set<number>();
  while (indices.size < blankCount) {
    indices.add(randInt(0, chars.length - 1));
  }
  return chars.map((c, i) => (indices.has(i) ? "_" : c)).join("");
}

export function generateSpellingWords(
  config: SpellingConfig,
  grade: GradeLevel
): SpellingWord[] {
  const pool = [...SPELLING_WORDS[grade]];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, config.wordCount).map(({ word, hint }) => ({
    word,
    hint,
    scrambled: config.mode === "word-scramble" ? scrambleWord(word) : undefined,
    blanked: config.mode === "fill-in-blank" ? blankWord(word) : undefined,
  }));
}

export const GRADE_LABELS: Record<GradeLevel, string> = {
  prek: "Pre-K",
  k: "Kindergarten",
  "1": "1st Grade",
  "2": "2nd Grade",
  "3": "3rd Grade",
  "4": "4th Grade",
  "5": "5th Grade",
};

// --- Sight Words generators ---

const SIGHT_WORDS: Record<GradeLevel, string[]> = {
  prek: ["a", "I", "the", "is", "it", "my", "to", "we", "go", "no", "up", "am", "an", "at", "be", "do", "he", "in", "me", "so"],
  k: ["and", "can", "for", "has", "his", "how", "man", "new", "not", "old", "our", "out", "put", "ran", "red", "run", "saw", "say", "she", "ten", "too", "was", "who", "you", "all", "are", "ate", "but", "did", "get"],
  "1": ["after", "again", "came", "come", "could", "done", "every", "first", "from", "give", "going", "good", "have", "here", "just", "know", "like", "little", "long", "look", "made", "many", "more", "much", "must", "name", "open", "over", "play", "said"],
  "2": ["about", "always", "around", "because", "been", "before", "being", "below", "between", "both", "called", "carry", "clean", "does", "drink", "eight", "enough", "fall", "found", "great", "group", "happen", "high", "keep", "learn", "leave", "night", "often", "only", "shall"],
  "3": ["accept", "already", "begin", "brought", "caught", "certain", "change", "clothes", "course", "during", "except", "famous", "finally", "follow", "heavy", "instead", "known", "laugh", "listen", "minute", "mountain", "notice", "probably", "question", "remember", "sentence", "several", "special", "straight", "though"],
  "4": ["although", "announce", "average", "behavior", "calendar", "capture", "certain", "consider", "curious", "describe", "different", "discover", "enormous", "exercise", "familiar", "favorite", "imagine", "interest", "knowledge", "language", "measure", "natural", "opposite", "pleasant", "popular", "realize", "receive", "separate", "surprise", "weather"],
  "5": ["accomplish", "advantage", "apparently", "awkward", "characteristic", "collaborate", "communicate", "conscience", "demonstrate", "discipline", "emphasize", "environment", "essential", "exaggerate", "extraordinary", "guarantee", "immediately", "independent", "intelligent", "negotiate", "occurrence", "particular", "possession", "prejudice", "privilege", "reference", "responsible", "sufficient", "thoroughly", "vocabulary"],
};

export function generateSightWords(config: SightWordsConfig, grade: GradeLevel): SightWordItem[] {
  const pool = [...SIGHT_WORDS[grade]];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, config.wordCount).map((word) => ({ word }));
}

// --- Vocabulary generators ---

const VOCABULARY_WORDS: Record<GradeLevel, { word: string; definition: string }[]> = {
  prek: [
    { word: "big", definition: "Very large in size" },
    { word: "happy", definition: "Feeling glad or pleased" },
    { word: "fast", definition: "Moving quickly" },
    { word: "soft", definition: "Smooth and gentle to touch" },
    { word: "loud", definition: "Making a lot of noise" },
    { word: "cold", definition: "Low temperature, not warm" },
    { word: "tall", definition: "High up, not short" },
    { word: "wet", definition: "Covered with water" },
    { word: "dark", definition: "Without light" },
    { word: "full", definition: "No more room inside" },
  ],
  k: [
    { word: "brave", definition: "Not afraid of danger" },
    { word: "gentle", definition: "Soft and careful" },
    { word: "tiny", definition: "Very very small" },
    { word: "shiny", definition: "Bright and sparkling" },
    { word: "empty", definition: "Nothing inside" },
    { word: "huge", definition: "Extremely big" },
    { word: "quiet", definition: "Making very little noise" },
    { word: "sleepy", definition: "Feeling tired and ready for bed" },
    { word: "silly", definition: "Funny in a playful way" },
    { word: "yummy", definition: "Tasting very good" },
  ],
  "1": [
    { word: "curious", definition: "Wanting to learn or know more" },
    { word: "enormous", definition: "Extremely large" },
    { word: "delicious", definition: "Very pleasing to taste" },
    { word: "dangerous", definition: "Likely to cause harm" },
    { word: "beautiful", definition: "Very pleasing to look at" },
    { word: "furious", definition: "Extremely angry" },
    { word: "ancient", definition: "Very very old" },
    { word: "fragile", definition: "Easy to break" },
    { word: "brilliant", definition: "Very bright or very smart" },
    { word: "peaceful", definition: "Calm and quiet" },
  ],
  "2": [
    { word: "adventure", definition: "An exciting experience" },
    { word: "impressed", definition: "Feeling admiration for something" },
    { word: "compare", definition: "Look at how things are alike or different" },
    { word: "cooperate", definition: "Work together with others" },
    { word: "predict", definition: "Guess what will happen next" },
    { word: "examine", definition: "Look at something very carefully" },
    { word: "organize", definition: "Put things in order" },
    { word: "celebrate", definition: "Do something fun for a special event" },
    { word: "frustrated", definition: "Feeling upset when things are hard" },
    { word: "create", definition: "Make something new" },
  ],
  "3": [
    { word: "consequence", definition: "What happens as a result of an action" },
    { word: "determination", definition: "Not giving up on something" },
    { word: "observation", definition: "Something you notice by watching" },
    { word: "majority", definition: "More than half of a group" },
    { word: "flexible", definition: "Able to bend or change easily" },
    { word: "transform", definition: "Change completely" },
    { word: "gradually", definition: "Slowly, little by little" },
    { word: "scarce", definition: "Hard to find, not enough" },
    { word: "ignore", definition: "Pay no attention to" },
    { word: "evaluate", definition: "Judge how good something is" },
  ],
  "4": [
    { word: "collaborate", definition: "Work with others on a project" },
    { word: "anticipate", definition: "Expect something to happen" },
    { word: "sufficient", definition: "Enough for what is needed" },
    { word: "elaborate", definition: "Add more detail or explanation" },
    { word: "perspective", definition: "A way of thinking about something" },
    { word: "indicate", definition: "Point out or show" },
    { word: "frequent", definition: "Happening often" },
    { word: "accumulate", definition: "Gather or collect over time" },
    { word: "demolish", definition: "Destroy completely" },
    { word: "reluctant", definition: "Unwilling or hesitant" },
  ],
  "5": [
    { word: "ambiguous", definition: "Having more than one meaning" },
    { word: "contemplate", definition: "Think deeply about" },
    { word: "inevitable", definition: "Certain to happen" },
    { word: "controversial", definition: "Causing disagreement" },
    { word: "predominant", definition: "Most common or important" },
    { word: "deteriorate", definition: "Get worse over time" },
    { word: "hypothetical", definition: "Based on an imagined situation" },
    { word: "unprecedented", definition: "Never happened before" },
    { word: "substantiate", definition: "Provide evidence to prove" },
    { word: "miscellaneous", definition: "A mixture of different things" },
  ],
};

export function generateVocabulary(config: VocabularyConfig, grade: GradeLevel): VocabularyItem[] {
  const pool = [...VOCABULARY_WORDS[grade]];
  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = pool.slice(0, config.wordCount);

  return selected.map(({ word, definition }) => {
    // Pick 3 wrong definitions from other words in the full pool
    const wrongDefs = pool
      .filter((w) => w.word !== word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.definition);

    const options = [definition, ...wrongDefs].sort(() => Math.random() - 0.5);

    return { word, definition, options, answer: definition };
  });
}

// --- Maze generators ---

const MAZE_SIZES: Record<GradeLevel, { rows: number; cols: number }> = {
  prek: { rows: 4, cols: 4 },
  k: { rows: 5, cols: 5 },
  "1": { rows: 6, cols: 6 },
  "2": { rows: 8, cols: 8 },
  "3": { rows: 10, cols: 10 },
  "4": { rows: 12, cols: 12 },
  "5": { rows: 14, cols: 14 },
};

function generateSingleMaze(rows: number, cols: number): MazeData {
  // Initialize grid with all walls closed
  const grid: MazeCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      top: false,
      right: false,
      bottom: false,
      left: false,
    }))
  );

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  // Recursive backtracker
  const stack: [number, number][] = [];
  const startR = 0;
  const startC = 0;
  visited[startR][startC] = true;
  stack.push([startR, startC]);

  const directions: [number, number, keyof MazeCell, keyof MazeCell][] = [
    [-1, 0, "top", "bottom"],    // up
    [1, 0, "bottom", "top"],     // down
    [0, -1, "left", "right"],    // left
    [0, 1, "right", "left"],     // right
  ];

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const neighbors: [number, number, keyof MazeCell, keyof MazeCell][] = [];

    for (const [dr, dc, wall, opposite] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        neighbors.push([nr, nc, wall, opposite]);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nr, nc, wall, opposite] = neighbors[randInt(0, neighbors.length - 1)];
      grid[r][c][wall] = true;
      grid[nr][nc][opposite] = true;
      visited[nr][nc] = true;
      stack.push([nr, nc]);
    }
  }

  // Solve with BFS for the solution path
  const endR = rows - 1;
  const endC = cols - 1;
  const parent = new Map<string, [number, number] | null>();
  const queue: [number, number][] = [[startR, startC]];
  parent.set(`${startR},${startC}`, null);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === endR && c === endC) break;

    const moves: [number, number, keyof MazeCell][] = [
      [-1, 0, "top"],
      [1, 0, "bottom"],
      [0, -1, "left"],
      [0, 1, "right"],
    ];

    for (const [dr, dc, wall] of moves) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
        grid[r][c][wall] &&
        !parent.has(`${nr},${nc}`)
      ) {
        parent.set(`${nr},${nc}`, [r, c]);
        queue.push([nr, nc]);
      }
    }
  }

  // Reconstruct path
  const solution: [number, number][] = [];
  let cur: [number, number] | null = [endR, endC];
  while (cur) {
    solution.unshift(cur);
    cur = parent.get(`${cur[0]},${cur[1]}`) ?? null;
  }

  return { rows, cols, grid, solution };
}

export function generateMazes(config: MazeConfig, grade: GradeLevel): MazeData[] {
  const { rows, cols } = MAZE_SIZES[grade];
  return Array.from({ length: config.mazeCount }, () => generateSingleMaze(rows, cols));
}

// --- Fractions generators ---

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function fractionToString(num: number, den: number): string {
  return `${num}/${den}`;
}

export function generateFractionsProblems(config: FractionsConfig, grade: GradeLevel): FractionsProblem[] {
  const problems: FractionsProblem[] = [];
  const gradeNum = grade === "prek" ? 0 : grade === "k" ? 0 : parseInt(grade);

  for (let i = 0; i < config.problemCount; i++) {
    if (gradeNum <= 1) {
      // Identify fractions from a shape
      const den = [2, 3, 4][randInt(0, 2)];
      const num = randInt(1, den - 1);
      problems.push({
        instruction: `What fraction is shaded? (${num} of ${den} parts)`,
        display: `${num}/${den}`,
        answer: fractionToString(num, den),
      });
    } else if (gradeNum === 2) {
      // Compare fractions
      const den = [2, 3, 4, 6][randInt(0, 3)];
      const a = randInt(1, den - 1);
      const b = randInt(1, den - 1);
      const symbol = a > b ? ">" : a < b ? "<" : "=";
      problems.push({
        instruction: `Compare: ${a}/${den} ___ ${b}/${den}`,
        display: `${a}/${den}  ○  ${b}/${den}`,
        answer: `${a}/${den} ${symbol} ${b}/${den}`,
      });
    } else if (gradeNum === 3) {
      // Simplify fractions
      const factor = randInt(2, 4);
      const simpleNum = randInt(1, 3);
      const simpleDen = randInt(simpleNum + 1, 6);
      const num = simpleNum * factor;
      const den = simpleDen * factor;
      problems.push({
        instruction: `Simplify: ${num}/${den}`,
        display: `${num}/${den} = ___`,
        answer: fractionToString(simpleNum, simpleDen),
      });
    } else if (gradeNum === 4) {
      // Add fractions with same denominator
      const den = [4, 6, 8, 10][randInt(0, 3)];
      const a = randInt(1, den - 2);
      const b = randInt(1, den - a - 1);
      const sum = a + b;
      const g = gcd(sum, den);
      problems.push({
        instruction: `Add: ${a}/${den} + ${b}/${den}`,
        display: `${a}/${den} + ${b}/${den} = ___`,
        answer: fractionToString(sum / g, den / g),
      });
    } else {
      // Add/subtract fractions with different denominators
      const den1 = [2, 3, 4, 5, 6][randInt(0, 4)];
      const den2 = [2, 3, 4, 5, 6][randInt(0, 4)];
      const lcd = (den1 * den2) / gcd(den1, den2);
      const a = randInt(1, den1 - 1);
      const b = randInt(1, den2 - 1);
      const isAdd = randInt(0, 1) === 1;
      const resultNum = isAdd
        ? a * (lcd / den1) + b * (lcd / den2)
        : Math.abs(a * (lcd / den1) - b * (lcd / den2));
      const g = gcd(resultNum, lcd);
      const op = isAdd ? "+" : "−";
      problems.push({
        instruction: `${isAdd ? "Add" : "Subtract"}: ${a}/${den1} ${op} ${b}/${den2}`,
        display: `${a}/${den1} ${op} ${b}/${den2} = ___`,
        answer: resultNum === 0 ? "0" : fractionToString(resultNum / g, lcd / g),
      });
    }
  }

  return problems;
}

// --- Counting generators ---

export function generateCountingProblems(config: CountingConfig, grade: GradeLevel): CountingProblem[] {
  const problems: CountingProblem[] = [];
  const gradeNum = grade === "prek" ? 0 : grade === "k" ? 0.5 : parseInt(grade);

  for (let i = 0; i < config.problemCount; i++) {
    let step: number;
    let start: number;
    let length: number;

    if (gradeNum <= 0) {
      // Count by 1s, small numbers
      step = 1;
      start = randInt(1, 5);
      length = 5;
    } else if (gradeNum <= 1) {
      // Count by 1s, 2s, or 5s
      step = [1, 2, 5][randInt(0, 2)];
      start = randInt(0, 10) * step;
      length = 6;
    } else if (gradeNum <= 2) {
      // Count by 2s, 5s, 10s
      step = [2, 5, 10][randInt(0, 2)];
      start = randInt(0, 5) * step;
      length = 7;
    } else if (gradeNum <= 3) {
      // Count by 3s, 4s, 6s, backward
      const forward = randInt(0, 1) === 1;
      step = [3, 4, 6][randInt(0, 2)] * (forward ? 1 : -1);
      start = forward ? randInt(0, 5) * Math.abs(step) : randInt(8, 15) * Math.abs(step);
      length = 7;
    } else {
      // Larger steps, negatives possible
      const forward = randInt(0, 1) === 1;
      step = [7, 8, 9, 11, 12, 25][randInt(0, 5)] * (forward ? 1 : -1);
      start = forward ? randInt(0, 3) * Math.abs(step) : randInt(10, 20) * Math.abs(step);
      length = 6;
    }

    const sequence: string[] = [];
    for (let j = 0; j < length; j++) {
      sequence.push(String(start + j * step));
    }

    const blankIndex = randInt(1, length - 2);
    const answer = sequence[blankIndex];
    const label = step > 0 ? `counting by ${step}s` : `counting backward by ${Math.abs(step)}s`;

    problems.push({
      instruction: `Fill in the missing number (${label})`,
      sequence,
      blankIndex,
      answer,
    });
  }

  return problems;
}

// --- Telling Time generators ---

export function generateTellingTimeProblems(config: TellingTimeConfig, grade: GradeLevel): TellingTimeProblem[] {
  const problems: TellingTimeProblem[] = [];
  const gradeNum = grade === "prek" ? 0 : grade === "k" ? 0.5 : parseInt(grade);

  for (let i = 0; i < config.problemCount; i++) {
    const hour = randInt(1, 12);
    let minute: number;

    if (gradeNum <= 0.5) {
      // On the hour only
      minute = 0;
    } else if (gradeNum <= 1) {
      // Hour and half hour
      minute = [0, 30][randInt(0, 1)];
    } else if (gradeNum <= 2) {
      // Quarter hours
      minute = [0, 15, 30, 45][randInt(0, 3)];
    } else if (gradeNum <= 3) {
      // 5-minute intervals
      minute = randInt(0, 11) * 5;
    } else {
      // Any minute
      minute = randInt(0, 59);
    }

    const timeStr = `${hour}:${minute.toString().padStart(2, "0")}`;

    problems.push({
      hour,
      minute,
      answer: timeStr,
      instruction: "What time is shown on the clock?",
    });
  }

  return problems;
}

// --- Money generators ---

const COIN_VALUES: Record<string, number> = {
  penny: 1,
  nickel: 5,
  dime: 10,
  quarter: 25,
};

function formatCents(cents: number): string {
  if (cents >= 100) {
    const dollars = Math.floor(cents / 100);
    const remaining = cents % 100;
    return remaining === 0 ? `$${dollars}.00` : `$${dollars}.${remaining.toString().padStart(2, "0")}`;
  }
  return `${cents}¢`;
}

export function generateMoneyProblems(config: MoneyConfig, grade: GradeLevel): MoneyProblem[] {
  const problems: MoneyProblem[] = [];
  const gradeNum = grade === "prek" ? 0 : grade === "k" ? 0.5 : parseInt(grade);

  for (let i = 0; i < config.problemCount; i++) {
    const coins: { type: string; count: number }[] = [];
    let total = 0;

    if (gradeNum <= 0.5) {
      // Just pennies and nickels, small amounts
      const pennies = randInt(1, 5);
      coins.push({ type: "penny", count: pennies });
      total = pennies;
    } else if (gradeNum <= 1) {
      // Pennies, nickels, dimes
      const types = ["penny", "nickel", "dime"];
      const numTypes = randInt(1, 2);
      for (let j = 0; j < numTypes; j++) {
        const type = types[randInt(0, 2)];
        const count = randInt(1, 3);
        const existing = coins.find((c) => c.type === type);
        if (existing) {
          existing.count += count;
        } else {
          coins.push({ type, count });
        }
        total += COIN_VALUES[type] * count;
      }
    } else if (gradeNum <= 2) {
      // All coins
      const types = ["penny", "nickel", "dime", "quarter"];
      const numTypes = randInt(2, 3);
      for (let j = 0; j < numTypes; j++) {
        const type = types[j];
        const count = randInt(1, 3);
        coins.push({ type, count });
        total += COIN_VALUES[type] * count;
      }
    } else if (gradeNum <= 3) {
      // Making change: given an amount, what coins?
      const target = randInt(3, 20) * 5; // multiples of 5 up to $1
      const quarters = Math.min(randInt(0, 3), Math.floor(target / 25));
      let remaining = target - quarters * 25;
      const dimes = Math.min(randInt(0, 4), Math.floor(remaining / 10));
      remaining -= dimes * 10;
      const nickels = Math.min(randInt(0, 2), Math.floor(remaining / 5));
      remaining -= nickels * 5;
      const pennies = remaining;

      if (quarters > 0) coins.push({ type: "quarter", count: quarters });
      if (dimes > 0) coins.push({ type: "dime", count: dimes });
      if (nickels > 0) coins.push({ type: "nickel", count: nickels });
      if (pennies > 0) coins.push({ type: "penny", count: pennies });
      total = target;
    } else {
      // Larger amounts, making change from a dollar
      const quarters = randInt(1, 4);
      const dimes = randInt(0, 5);
      const nickels = randInt(0, 3);
      const pennies = randInt(0, 4);
      coins.push({ type: "quarter", count: quarters });
      if (dimes > 0) coins.push({ type: "dime", count: dimes });
      if (nickels > 0) coins.push({ type: "nickel", count: nickels });
      if (pennies > 0) coins.push({ type: "penny", count: pennies });
      total = quarters * 25 + dimes * 10 + nickels * 5 + pennies;
    }

    problems.push({
      instruction: "How much money is shown?",
      coins,
      answer: formatCents(total),
    });
  }

  return problems;
}

// --- Logic generators ---

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const PUZZLE_DATA: Record<GradeLevel, { group: string[]; oddOne: string; category: string }[]> = {
  prek: [
    { group: ["apple", "banana", "grape"], oddOne: "car", category: "fruits" },
    { group: ["dog", "cat", "fish"], oddOne: "chair", category: "animals" },
    { group: ["red", "blue", "green"], oddOne: "ball", category: "colors" },
    { group: ["circle", "square", "triangle"], oddOne: "apple", category: "shapes" },
    { group: ["shirt", "pants", "hat"], oddOne: "tree", category: "clothes" },
    { group: ["mom", "dad", "baby"], oddOne: "book", category: "family" },
  ],
  k: [
    { group: ["cow", "pig", "horse"], oddOne: "airplane", category: "farm animals" },
    { group: ["spoon", "fork", "knife"], oddOne: "shoe", category: "utensils" },
    { group: ["sun", "moon", "star"], oddOne: "flower", category: "things in the sky" },
    { group: ["bus", "car", "truck"], oddOne: "banana", category: "vehicles" },
    { group: ["rain", "snow", "wind"], oddOne: "table", category: "weather" },
    { group: ["eye", "ear", "nose"], oddOne: "clock", category: "body parts" },
  ],
  "1": [
    { group: ["piano", "guitar", "drum"], oddOne: "pencil", category: "instruments" },
    { group: ["football", "basketball", "soccer"], oddOne: "lamp", category: "sports" },
    { group: ["Earth", "Mars", "Jupiter"], oddOne: "ocean", category: "planets" },
    { group: ["winter", "spring", "summer"], oddOne: "Monday", category: "seasons" },
    { group: ["breakfast", "lunch", "dinner"], oddOne: "pillow", category: "meals" },
    { group: ["oak", "pine", "maple"], oddOne: "river", category: "trees" },
  ],
  "2": [
    { group: ["penny", "nickel", "dime"], oddOne: "crayon", category: "coins" },
    { group: ["noun", "verb", "adjective"], oddOne: "hammer", category: "parts of speech" },
    { group: ["Atlantic", "Pacific", "Indian"], oddOne: "Sahara", category: "oceans" },
    { group: ["inch", "foot", "yard"], oddOne: "pound", category: "length units" },
    { group: ["rose", "daisy", "tulip"], oddOne: "eagle", category: "flowers" },
    { group: ["whale", "dolphin", "shark"], oddOne: "robin", category: "sea creatures" },
  ],
  "3": [
    { group: ["simile", "metaphor", "alliteration"], oddOne: "fraction", category: "figurative language" },
    { group: ["rectangle", "rhombus", "trapezoid"], oddOne: "sphere", category: "quadrilaterals" },
    { group: ["solid", "liquid", "gas"], oddOne: "color", category: "states of matter" },
    { group: ["Senate", "House", "Supreme Court"], oddOne: "school", category: "government branches" },
    { group: ["igneous", "sedimentary", "metamorphic"], oddOne: "cumulus", category: "rock types" },
    { group: ["mercury", "iron", "gold"], oddOne: "oxygen", category: "metals" },
  ],
  "4": [
    { group: ["photosynthesis", "respiration", "transpiration"], oddOne: "erosion", category: "plant processes" },
    { group: ["conductor", "insulator", "semiconductor"], oddOne: "predator", category: "electrical terms" },
    { group: ["numerator", "denominator", "fraction bar"], oddOne: "exponent", category: "fraction parts" },
    { group: ["peninsula", "island", "archipelago"], oddOne: "canyon", category: "landforms with water" },
    { group: ["cello", "violin", "viola"], oddOne: "flute", category: "string instruments" },
    { group: ["democracy", "monarchy", "oligarchy"], oddOne: "economy", category: "government types" },
  ],
  "5": [
    { group: ["variable", "coefficient", "constant"], oddOne: "diameter", category: "algebra terms" },
    { group: ["mitochondria", "nucleus", "ribosome"], oddOne: "habitat", category: "cell parts" },
    { group: ["revolution", "rotation", "orbit"], oddOne: "evaporation", category: "Earth's movements" },
    { group: ["thesis", "evidence", "conclusion"], oddOne: "stanza", category: "essay parts" },
    { group: ["latitude", "longitude", "equator"], oddOne: "altitude", category: "map terms" },
    { group: ["proton", "neutron", "electron"], oddOne: "molecule", category: "subatomic particles" },
  ],
};

const SORTING_DATA: Record<GradeLevel, { instruction: string; sorted: string[] }[]> = {
  prek: [
    { instruction: "Put these from smallest to biggest", sorted: ["ant", "cat", "dog", "horse"] },
    { instruction: "Put these from shortest to tallest", sorted: ["mouse", "rabbit", "child", "giraffe"] },
    { instruction: "Put these from lightest to heaviest", sorted: ["feather", "apple", "book", "car"] },
    { instruction: "Put these from coldest to hottest", sorted: ["ice cream", "water", "soup", "fire"] },
    { instruction: "Put these from slowest to fastest", sorted: ["snail", "turtle", "rabbit", "cheetah"] },
  ],
  k: [
    { instruction: "Put these numbers in order (small to big)", sorted: ["1", "3", "5", "8", "10"] },
    { instruction: "Put these from youngest to oldest", sorted: ["baby", "child", "teenager", "adult", "grandparent"] },
    { instruction: "Put these from shortest to longest", sorted: ["ant", "pencil", "baseball bat", "car", "bus"] },
    { instruction: "Put these days in order", sorted: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { instruction: "Put these from softest to loudest", sorted: ["whisper", "talking", "yelling", "siren"] },
  ],
  "1": [
    { instruction: "Put these months in order", sorted: ["January", "March", "June", "September", "December"] },
    { instruction: "Put these from least to most legs", sorted: ["snake", "human", "dog", "spider", "centipede"] },
    { instruction: "Put these from smallest to biggest", sorted: ["grape", "apple", "melon", "pumpkin"] },
    { instruction: "Put these from shortest to tallest", sorted: ["flower", "fence", "house", "tree", "skyscraper"] },
    { instruction: "Sort from fewest to most wheels", sorted: ["unicycle", "bicycle", "tricycle", "car", "truck"] },
  ],
  "2": [
    { instruction: "Sort these fractions from smallest to biggest", sorted: ["1/4", "1/3", "1/2", "3/4", "1"] },
    { instruction: "Put in order from closest to farthest from Earth", sorted: ["Moon", "Mars", "Jupiter", "Neptune"] },
    { instruction: "Sort these units from smallest to biggest", sorted: ["inch", "foot", "yard", "mile"] },
    { instruction: "Put these in order of a plant's life", sorted: ["seed", "sprout", "stem", "flower", "fruit"] },
    { instruction: "Sort from fewest to most sides", sorted: ["triangle", "square", "pentagon", "hexagon", "octagon"] },
  ],
  "3": [
    { instruction: "Sort from smallest to biggest unit of time", sorted: ["second", "minute", "hour", "day", "week", "year"] },
    { instruction: "Put these in order of the water cycle", sorted: ["evaporation", "condensation", "precipitation", "collection"] },
    { instruction: "Sort these decimals from smallest to biggest", sorted: ["0.1", "0.25", "0.5", "0.75", "1.0"] },
    { instruction: "Sort from least to most sides", sorted: ["triangle", "quadrilateral", "pentagon", "hexagon", "octagon"] },
    { instruction: "Put these events in historical order", sorted: ["dinosaurs", "pyramids", "Columbus", "moon landing"] },
  ],
  "4": [
    { instruction: "Sort these metric units from smallest to biggest", sorted: ["millimeter", "centimeter", "meter", "kilometer"] },
    { instruction: "Sort these from least to most dense", sorted: ["air", "wood", "water", "iron", "gold"] },
    { instruction: "Sort by number of syllables (fewest to most)", sorted: ["cat", "tiger", "elephant", "hippopotamus"] },
    { instruction: "Put these in the order of the digestive system", sorted: ["mouth", "esophagus", "stomach", "small intestine", "large intestine"] },
    { instruction: "Sort these numbers from smallest to biggest", sorted: ["0.05", "1/4", "0.33", "1/2", "0.9"] },
  ],
  "5": [
    { instruction: "Sort these by distance from the Sun", sorted: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn"] },
    { instruction: "Put these geological eras in order", sorted: ["Paleozoic", "Mesozoic", "Cenozoic"] },
    { instruction: "Sort from smallest to largest data unit", sorted: ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] },
    { instruction: "Put these in order of the scientific method", sorted: ["question", "hypothesis", "experiment", "analyze", "conclusion"] },
    { instruction: "Sort these temperatures from coldest to hottest", sorted: ["-40°F", "32°F", "72°F", "212°F", "1000°F"] },
  ],
};

const SEQUENCE_DATA: Record<GradeLevel, { shown: string[]; answer: string; hint: string }[]> = {
  prek: [
    { shown: ["1", "2", "3", "4"], answer: "5", hint: "counting up by 1" },
    { shown: ["A", "B", "C", "D"], answer: "E", hint: "letters in order" },
    { shown: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", hint: "red blue pattern" },
    { shown: ["😊", "😊", "⭐", "😊", "😊"], answer: "⭐", hint: "two smiles then a star" },
    { shown: ["1", "1", "2", "2", "3"], answer: "3", hint: "each number twice" },
  ],
  k: [
    { shown: ["2", "4", "6", "8"], answer: "10", hint: "counting by 2s" },
    { shown: ["5", "10", "15", "20"], answer: "25", hint: "counting by 5s" },
    { shown: ["🔴", "🔵", "🟢", "🔴", "🔵"], answer: "🟢", hint: "three-color pattern" },
    { shown: ["Z", "Y", "X", "W"], answer: "V", hint: "letters going backward" },
    { shown: ["10", "9", "8", "7"], answer: "6", hint: "counting down by 1" },
  ],
  "1": [
    { shown: ["3", "6", "9", "12"], answer: "15", hint: "counting by 3s" },
    { shown: ["10", "20", "30", "40"], answer: "50", hint: "counting by 10s" },
    { shown: ["1", "2", "4", "8"], answer: "16", hint: "doubling each time" },
    { shown: ["20", "18", "16", "14"], answer: "12", hint: "subtracting 2 each time" },
    { shown: ["1", "4", "7", "10"], answer: "13", hint: "adding 3 each time" },
    { shown: ["100", "90", "80", "70"], answer: "60", hint: "subtracting 10 each time" },
  ],
  "2": [
    { shown: ["1", "1", "2", "3", "5"], answer: "8", hint: "add the last two numbers" },
    { shown: ["2", "6", "18", "54"], answer: "162", hint: "multiply by 3 each time" },
    { shown: ["1", "4", "9", "16"], answer: "25", hint: "perfect squares" },
    { shown: ["50", "45", "40", "35"], answer: "30", hint: "subtracting 5 each time" },
    { shown: ["1", "3", "6", "10"], answer: "15", hint: "add 2, then 3, then 4..." },
    { shown: ["64", "32", "16", "8"], answer: "4", hint: "divide by 2 each time" },
  ],
  "3": [
    { shown: ["1", "8", "27", "64"], answer: "125", hint: "perfect cubes" },
    { shown: ["2", "3", "5", "7", "11"], answer: "13", hint: "prime numbers" },
    { shown: ["1", "2", "4", "7", "11"], answer: "16", hint: "add 1, then 2, then 3..." },
    { shown: ["100", "81", "64", "49"], answer: "36", hint: "perfect squares going down" },
    { shown: ["3", "5", "9", "15", "23"], answer: "33", hint: "add 2, then 4, then 6..." },
    { shown: ["1000", "500", "250", "125"], answer: "62.5", hint: "divide by 2 each time" },
  ],
  "4": [
    { shown: ["1", "1", "2", "3", "5", "8"], answer: "13", hint: "Fibonacci sequence" },
    { shown: ["2", "6", "12", "20", "30"], answer: "42", hint: "differences increase by 2" },
    { shown: ["1", "3", "7", "15", "31"], answer: "63", hint: "double and add 1" },
    { shown: ["256", "128", "64", "32"], answer: "16", hint: "powers of 2 going down" },
    { shown: ["1", "2", "6", "24", "120"], answer: "720", hint: "multiply by 2, then 3, then 4..." },
    { shown: ["0", "1", "1", "2", "4", "7"], answer: "13", hint: "add the last three numbers" },
  ],
  "5": [
    { shown: ["1", "4", "27", "256"], answer: "3125", hint: "n^n pattern" },
    { shown: ["2", "5", "11", "23", "47"], answer: "95", hint: "double and add 1" },
    { shown: ["1", "2", "3", "5", "8", "13", "21"], answer: "34", hint: "Fibonacci" },
    { shown: ["0.5", "0.25", "0.125", "0.0625"], answer: "0.03125", hint: "divide by 2 each time" },
    { shown: ["1", "3", "6", "10", "15", "21"], answer: "28", hint: "triangular numbers" },
    { shown: ["3", "7", "15", "31", "63"], answer: "127", hint: "2^n - 1" },
  ],
};

function generatePuzzleProblems(count: number, grade: GradeLevel): LogicProblem[] {
  const pool = shuffleArray(PUZZLE_DATA[grade]);
  return pool.slice(0, Math.min(count, pool.length)).map((data) => {
    const items = shuffleArray([...data.group, data.oddOne]);
    return {
      instruction: `Which one does NOT belong with the others? (They are all ${data.category})`,
      items,
      answer: [data.oddOne],
    };
  });
}

function generateSortingProblems(count: number, grade: GradeLevel): LogicProblem[] {
  const pool = shuffleArray(SORTING_DATA[grade]);
  return pool.slice(0, Math.min(count, pool.length)).map((data) => ({
    instruction: data.instruction,
    items: shuffleArray(data.sorted),
    answer: data.sorted,
  }));
}

function generateSequenceProblems(count: number, grade: GradeLevel): LogicProblem[] {
  const pool = shuffleArray(SEQUENCE_DATA[grade]);
  return pool.slice(0, Math.min(count, pool.length)).map((data) => ({
    instruction: `What comes next? (Hint: ${data.hint})`,
    items: data.shown,
    answer: [data.answer],
  }));
}

export function generateLogicProblems(mode: LogicMode, config: LogicConfig, grade: GradeLevel): LogicProblem[] {
  switch (mode) {
    case "puzzle":
      return generatePuzzleProblems(config.problemCount, grade);
    case "sorting":
      return generateSortingProblems(config.problemCount, grade);
    case "sequencing":
      return generateSequenceProblems(config.problemCount, grade);
  }
}

export const DEFAULT_LOGIC_PROBLEM_COUNT: Record<GradeLevel, number> = {
  prek: 4,
  k: 4,
  "1": 5,
  "2": 5,
  "3": 4,
  "4": 4,
  "5": 5,
};

export const DEFAULT_ARITHMETIC_BY_GRADE: Record<GradeLevel, ArithmeticConfig> = {
  prek: { operations: ["addition"], minNumber: 0, maxNumber: 5, problemCount: 10 },
  k: { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 10, problemCount: 12 },
  "1": { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 20, problemCount: 15 },
  "2": { operations: ["addition", "subtraction"], minNumber: 0, maxNumber: 100, problemCount: 15 },
  "3": { operations: ["addition", "subtraction", "multiplication"], minNumber: 0, maxNumber: 12, problemCount: 20 },
  "4": { operations: ["addition", "subtraction", "multiplication", "division"], minNumber: 1, maxNumber: 12, problemCount: 20 },
  "5": { operations: ["addition", "subtraction", "multiplication", "division"], minNumber: 1, maxNumber: 20, problemCount: 24 },
};
