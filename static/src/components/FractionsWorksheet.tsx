import { FractionsProblem } from "../types/Worksheet";

interface Props {
  problems: FractionsProblem[];
  showAnswers: boolean;
}

export const FractionsWorksheet = ({ problems, showAnswers }: Props) => {
  return (
    <div className="fractions-list">
      {problems.map((p, i) => (
        <div key={i} className="fractions-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="fractions-content">
            <span className="fractions-instruction">{p.instruction}</span>
            <span className="fractions-display">{p.display}</span>
            {showAnswers ? (
              <span className="answer">{p.answer}</span>
            ) : (
              <span className="answer-line" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
