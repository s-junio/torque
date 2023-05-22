type GaugeProps = {
  value: number; /* Number between 0 and 1 */
  label: string;
  context?: string;
};

export function Gauge({ value, label, context }: GaugeProps) {
  const PATH_START = 100;
  const PATH_END = 150;
  const width = 230;
  const strokeWidth = 20;

  const circlePosition = width / 2;
  const radius = width / 2 - strokeWidth / 2;

  const calculatePath = () => {
    const pct = value * PATH_START;
    return `${pct} ${PATH_END}`;
  };

  return (
    <svg width={width} height={width} fill="transparent" stroke-linecap="round">
      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#a55" />
          <stop offset="100%" stop-color="#0a5" />
        </linearGradient>
      </defs>
      <circle
        stroke="#2a2a2a"
        cx={circlePosition}
        cy={circlePosition}
        r={radius}
        pathLength={PATH_END}
        stroke-width={strokeWidth - 2}
        style={{
          strokeDasharray: "100 150" /* calculatePath() */,
          transformOrigin: "center center",
          transform: "rotate(150deg)",
        }}
      />
      <text
        x={circlePosition}
        y={circlePosition}
        fill="white"
        text-anchor="middle"
        style={{
          fontWeight: "500",
          fontSize: "2rem",
        }}
      >
        {label}
      </text>
      {context && (
        <text
          x={circlePosition}
          y={circlePosition + 40}
          fill="#A3A3A3"
          text-anchor="middle"
          style={{
            fontWeight: "500",
          }}
        >
          {context}
        </text>
      )}
      <circle
        stroke="url(#linear)"
        style={{
          strokeDasharray: calculatePath(),
          transformOrigin: "center center",
          transform: "rotate(150deg)",
          transition: "stroke-dasharray .3s ease-in",
        }}
        cx={circlePosition}
        cy={circlePosition}
        stroke-width={strokeWidth}
        r={radius}
        pathLength={PATH_END}
      />
    </svg>
  );
}
