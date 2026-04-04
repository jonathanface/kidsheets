import { TellingTimeProblem } from "../types/Worksheet";

interface Props {
  problems: TellingTimeProblem[];
  showAnswers: boolean;
}

function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = minute * 6 - 90;
  const cx = 50;
  const cy = 50;
  const hourLen = 22;
  const minuteLen = 32;

  const hourX = cx + hourLen * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = cy + hourLen * Math.sin((hourAngle * Math.PI) / 180);
  const minX = cx + minuteLen * Math.cos((minuteAngle * Math.PI) / 180);
  const minY = cy + minuteLen * Math.sin((minuteAngle * Math.PI) / 180);

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const r = 38;
    return {
      num,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <svg viewBox="0 0 100 100" className="clock-face">
      <circle cx={cx} cy={cy} r={44} fill="#fff" stroke="var(--cat-math)" strokeWidth="2.5" />
      {/* Tick marks */}
      {Array.from({ length: 60 }, (_, i) => {
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const isHour = i % 5 === 0;
        const r1 = isHour ? 40 : 42;
        const r2 = 44;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(angle)}
            y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)}
            y2={cy + r2 * Math.sin(angle)}
            stroke="var(--text-muted)"
            strokeWidth={isHour ? 1.5 : 0.5}
          />
        );
      })}
      {/* Numbers */}
      {numbers.map(({ num, x, y }) => (
        <text
          key={num}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="600"
          fontFamily="var(--font-display)"
          fill="var(--text)"
        >
          {num}
        </text>
      ))}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourX} y2={hourY} stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minX} y2={minY} stroke="var(--cat-math)" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill="var(--text)" />
    </svg>
  );
}

export const TellingTimeWorksheet = ({ problems, showAnswers }: Props) => {
  return (
    <div className="time-grid">
      {problems.map((p, i) => (
        <div key={i} className="time-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="time-content">
            <ClockFace hour={p.hour} minute={p.minute} />
            <span className="time-instruction">{p.instruction}</span>
            {showAnswers ? (
              <span className="answer">{p.answer}</span>
            ) : (
              <span className="time-blank">__:__</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
