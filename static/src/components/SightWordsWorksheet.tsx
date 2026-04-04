import { SightWordItem } from "../types/Worksheet";

interface Props {
  words: SightWordItem[];
  showAnswers: boolean;
}

export const SightWordsWorksheet = ({ words, showAnswers }: Props) => {
  return (
    <div className="sight-words-grid">
      {words.map((w, i) => (
        <div key={i} className="sight-word-item">
          <span className="sight-word-model">{w.word}</span>
          <div className="sight-word-practice">
            {showAnswers ? (
              <span className="sight-word-written">{w.word}</span>
            ) : (
              <span className="sight-word-line" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
