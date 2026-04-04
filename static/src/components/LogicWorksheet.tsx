import { LogicMode, LogicProblem } from "../types/Worksheet";

interface Props {
  mode: LogicMode;
  problems: LogicProblem[];
  showAnswers: boolean;
}

export const LogicWorksheet = ({ mode, problems, showAnswers }: Props) => {
  return (
    <div className="logic-list">
      {problems.map((p, i) => (
        <div key={i} className="logic-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="logic-content">
            <span className="logic-instruction">{p.instruction}</span>

            {mode === "puzzle" && (
              <div className="logic-choices">
                {p.items.map((item, j) => (
                  <span
                    key={j}
                    className={`logic-choice${showAnswers && p.answer.includes(item) ? " logic-answer-highlight" : ""}`}
                  >
                    {item}
                  </span>
                ))}
                {showAnswers && (
                  <span className="answer">Answer: {p.answer[0]}</span>
                )}
              </div>
            )}

            {mode === "sorting" && (
              <div className="logic-sorting">
                <div className="logic-choices">
                  {p.items.map((item, j) => (
                    <span key={j} className="logic-choice">{item}</span>
                  ))}
                </div>
                {showAnswers ? (
                  <div className="logic-answer-row">
                    <span className="answer">
                      {p.answer.join(" → ")}
                    </span>
                  </div>
                ) : (
                  <div className="logic-blanks">
                    {p.answer.map((_, j) => (
                      <span key={j} className="logic-blank-slot">
                        {j + 1}. ________
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === "sequencing" && (
              <div className="logic-sequence">
                <div className="logic-sequence-items">
                  {p.items.map((item, j) => (
                    <span key={j} className="logic-sequence-item">{item}</span>
                  ))}
                  <span className="logic-sequence-item logic-sequence-blank">
                    {showAnswers ? (
                      <span className="answer">{p.answer[0]}</span>
                    ) : (
                      "?"
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
