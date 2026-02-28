"use client";

interface Props {
  score: number;
  breakdown: {
    gateway: number;
    agents: number;
    memory: number;
    wal: number;
    cron: number;
  };
}

export default function ScoreDetail({ score, breakdown }: Props) {
  const maxBase = 100;
  const bonus = Math.max(0, score - maxBase);
  const items = [
    { label: 'Gateway (online)', value: breakdown.gateway, max: 30 },
    { label: 'Agents (healthy ratio)', value: breakdown.agents, max: 25 },
    { label: 'Memory (docs)', value: breakdown.memory, max: 15 },
    { label: 'WAL (freshness)', value: breakdown.wal, max: 20 },
    { label: 'Cron (jobs)', value: breakdown.cron, max: 10 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4 mt-4">
      <h3 className="font-semibold mb-2">Score breakdown</h3>
      <div className="space-y-2 text-sm">
        {items.map(item => (
          <div key={item.label} className="flex justify-between">
            <span>{item.label}</span>
            <span className={item.value >= item.max ? 'text-green-400' : 'text-yellow-400'}>
              {item.value}/{item.max}
            </span>
          </div>
        ))}
        {bonus > 0 && (
          <div className="flex justify-between text-green-400 font-semibold">
            <span>Bonuses (live, error, a11y, mobile, etc.)</span>
            <span>+{bonus}</span>
          </div>
        )}
        <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className={score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'}>
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}