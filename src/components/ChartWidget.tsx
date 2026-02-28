interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function ChartWidget({ data, width = 200, height = 60, color = "#3b82f6" }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={`${points} ${width},${height} 0,${height}`} fill={`${color}20`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}