import { MoneyProblem } from "../types/Worksheet";

function CoinIcon({ type }: { type: string }) {
  const config: Record<string, { color: string; accent: string; label: string; value: string }> = {
    penny: { color: "#b87333", accent: "#8B5A2B", label: "1¢", value: "1¢" },
    nickel: { color: "#a8a8a8", accent: "#777", label: "5¢", value: "5¢" },
    dime: { color: "#c0c0c0", accent: "#888", label: "10¢", value: "10¢" },
    quarter: { color: "#d4d4d4", accent: "#999", label: "25¢", value: "25¢" },
  };
  const c = config[type] || config.penny;
  const size = type === "dime" ? 28 : type === "penny" ? 30 : type === "nickel" ? 32 : 36;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="coin-icon">
      <circle cx="20" cy="20" r="18" fill={c.color} stroke={c.accent} strokeWidth="2" />
      <circle cx="20" cy="20" r="15" fill="none" stroke={c.accent} strokeWidth="0.5" opacity="0.5" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-display)"
        fill="#fff"
      >
        {c.label}
      </text>
    </svg>
  );
}

interface Props {
  problems: MoneyProblem[];
  showAnswers: boolean;
}

export const MoneyWorksheet = ({ problems, showAnswers }: Props) => {
  return (
    <div className="money-list">
      {problems.map((p, i) => (
        <div key={i} className="money-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="money-content">
            <span className="money-instruction">{p.instruction}</span>
            <div className="money-coins">
              {p.coins.map((coin, j) =>
                Array.from({ length: coin.count }, (_, k) => (
                  <CoinIcon key={`${j}-${k}`} type={coin.type} />
                ))
              )}
            </div>
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
