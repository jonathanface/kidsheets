import { VocabularyItem } from "../types/Worksheet";

interface Props {
  items: VocabularyItem[];
  showAnswers: boolean;
}

export const VocabularyWorksheet = ({ items, showAnswers }: Props) => {
  return (
    <div className="vocab-list">
      {items.map((item, i) => (
        <div key={i} className="vocab-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="vocab-content">
            <span className="vocab-word">{item.word}</span>
            <div className="vocab-options">
              {item.options.map((opt, j) => (
                <span
                  key={j}
                  className={`vocab-option${showAnswers && opt === item.answer ? " vocab-correct" : ""}`}
                >
                  <span className="vocab-option-letter">{String.fromCharCode(65 + j)}.</span>
                  {opt}
                </span>
              ))}
            </div>
            {showAnswers && (
              <span className="answer">{item.answer}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
