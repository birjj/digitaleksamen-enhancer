import React from "react";

type CircularSegmentsProps = {
  segments: string[];
  /** A fractional value for how large the inner radius should be (e.g. .5 to make it half as big as the outer radius) */
  innerRadius?: number;
  /** A value from 1-100, how large the lines should be */
  strokeWidth?: number;
} & React.SVGProps<SVGSVGElement>;
const CircularSegments = ({
  segments,
  innerRadius = 0.5,
  strokeWidth = 16,
  ...props
}: CircularSegmentsProps) => {
  const actualOuterRadius = 100 - strokeWidth / 2;
  const actualInnerRadius = 100 * innerRadius - strokeWidth / 2;
  const outerGap = Math.atan2(strokeWidth, actualOuterRadius);
  const innerGap = Math.atan2(strokeWidth, actualInnerRadius);

  const arcPoint = (radian: number, radius: number) => {
    return `${100 + Math.sin(radian) * radius} ${
      100 + Math.cos(radian) * radius
    }`;
  };
  const indexToPath = (index: number) => {
    const segmentSize = (Math.PI * 2) / segments.length;
    const fromRadian = Math.PI - segmentSize * index;
    const toRadian = Math.PI - segmentSize * (index + 1);
    const points = [
      arcPoint(fromRadian - outerGap, actualOuterRadius),
      arcPoint(toRadian + outerGap, actualOuterRadius),
      arcPoint(toRadian + innerGap, actualInnerRadius),
      arcPoint(fromRadian - innerGap, actualInnerRadius),
    ];
    return `M ${points[0]} A ${actualOuterRadius} ${actualOuterRadius} 0 0 1 ${points[1]} L ${points[2]} A ${actualInnerRadius} ${actualInnerRadius} 0 0 0 ${points[3]} z`;
  };
  return (
    <svg viewBox="0 0 200 200" {...props}>
      {segments.map((segment, i) => (
        <path
          key={i}
          d={indexToPath(i)}
          fill={segment || "gray"}
          stroke={segment || "gray"}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
export default CircularSegments;
