import { MazeData } from "../types/Worksheet";

interface Props {
  mazes: MazeData[];
  showAnswers: boolean;
}

function MazeRenderer({ maze, showAnswers }: { maze: MazeData; showAnswers: boolean }) {
  const cellSize = 24;
  const wallWidth = 2;
  const padding = cellSize;
  const width = maze.cols * cellSize + padding * 2;
  const height = maze.rows * cellSize + padding * 2;
  const ox = padding;
  const oy = padding;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="maze-svg">
      {/* Background */}
      <rect x="0" y="0" width={width} height={height} fill="#fff" />

      {/* Walls */}
      {maze.grid.map((row, r) =>
        row.map((cell, c) => {
          const x = ox + c * cellSize;
          const y = oy + r * cellSize;
          const walls: React.ReactElement[] = [];

          // Top wall (skip for entrance at top-left)
          if (!cell.top && !(r === 0 && c === 0)) {
            walls.push(
              <line key={`${r}-${c}-t`} x1={x} y1={y} x2={x + cellSize} y2={y}
                stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
            );
          }

          // Left wall (skip for entrance at top-left)
          if (!cell.left && !(r === 0 && c === 0)) {
            walls.push(
              <line key={`${r}-${c}-l`} x1={x} y1={y} x2={x} y2={y + cellSize}
                stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
            );
          }

          // Bottom wall (skip for exit at bottom-right)
          if (!cell.bottom && !(r === maze.rows - 1 && c === maze.cols - 1)) {
            walls.push(
              <line key={`${r}-${c}-b`} x1={x} y1={y + cellSize} x2={x + cellSize} y2={y + cellSize}
                stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
            );
          }

          // Right wall (skip for exit at bottom-right)
          if (!cell.right && !(r === maze.rows - 1 && c === maze.cols - 1)) {
            walls.push(
              <line key={`${r}-${c}-r`} x1={x + cellSize} y1={y} x2={x + cellSize} y2={y + cellSize}
                stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
            );
          }

          return walls;
        })
      )}

      {/* Outer border (with entrance/exit gaps) */}
      {/* Top edge: gap at col 0 */}
      <line x1={ox + cellSize} y1={oy} x2={ox + maze.cols * cellSize} y2={oy}
        stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
      {/* Bottom edge: gap at last col */}
      <line x1={ox} y1={oy + maze.rows * cellSize} x2={ox + (maze.cols - 1) * cellSize} y2={oy + maze.rows * cellSize}
        stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
      {/* Left edge: gap at row 0 */}
      <line x1={ox} y1={oy + cellSize} x2={ox} y2={oy + maze.rows * cellSize}
        stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />
      {/* Right edge: gap at last row */}
      <line x1={ox + maze.cols * cellSize} y1={oy} x2={ox + maze.cols * cellSize} y2={oy + (maze.rows - 1) * cellSize}
        stroke="var(--text)" strokeWidth={wallWidth} strokeLinecap="round" />

      {/* Start/End labels */}
      <text x={ox + cellSize * 0.5} y={oy - 6} textAnchor="middle" fontSize="10"
        fontWeight="600" fontFamily="var(--font-display)" fill="var(--cat-motor)">
        Start
      </text>
      <text x={ox + (maze.cols - 0.5) * cellSize} y={oy + maze.rows * cellSize + 14} textAnchor="middle"
        fontSize="10" fontWeight="600" fontFamily="var(--font-display)" fill="var(--cat-motor)">
        End
      </text>

      {/* Solution path */}
      {showAnswers && maze.solution.length > 1 && (
        <polyline
          points={maze.solution
            .map(([r, c]) => `${ox + c * cellSize + cellSize / 2},${oy + r * cellSize + cellSize / 2}`)
            .join(" ")}
          fill="none"
          stroke="var(--cat-motor)"
          strokeWidth={Math.max(cellSize * 0.3, 3)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      )}
    </svg>
  );
}

export const MazeWorksheet = ({ mazes, showAnswers }: Props) => {
  return (
    <div className="maze-grid">
      {mazes.map((maze, i) => (
        <div key={i} className="maze-item">
          <MazeRenderer maze={maze} showAnswers={showAnswers} />
        </div>
      ))}
    </div>
  );
};
