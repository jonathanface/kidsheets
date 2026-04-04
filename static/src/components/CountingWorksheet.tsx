import { CountingProblem } from "../types/Worksheet";

interface Props {
  problems: CountingProblem[];
  showAnswers: boolean;
}

export const CountingWorksheet = ({ problems, showAnswers }: Props) => {
  return (
    <div className="counting-list">
      {problems.map((p, i) => (
        <div key={i} className="counting-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="counting-content">
            <span className="counting-instruction">{p.instruction}</span>
            <div className="counting-sequence">
              {p.sequence.map((val, j) => (
                <span
                  key={j}
                  className={`counting-cell${j === p.blankIndex ? " counting-blank" : ""}`}
                >
                  {j === p.blankIndex ? (
                    showAnswers ? (
                      <span className="answer">{p.answer}</span>
                    ) : (
                      "?"
                    )
                  ) : (
                    val
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
