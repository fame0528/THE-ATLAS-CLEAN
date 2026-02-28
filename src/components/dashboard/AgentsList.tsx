'use client';

export default function AgentsList() {
  const agents = [
    { id: 'atlas', name: 'Atlas', status: 'active' },
    { id: 'prometheus', name: 'Prometheus', status: 'active' },
    { id: 'ares', name: 'Ares', status: 'idle' },
    { id: 'athena', name: 'Athena', status: 'idle' },
    { id: 'epimetheus', name: 'Epimetheus', status: 'idle' },
    { id: 'hephaestus', name: 'Hephaestus', status: 'idle' },
    { id: 'hermes', name: 'Hermes', status: 'idle' },
    { id: 'hyperion', name: 'Hyperion', status: 'idle' },
    { id: 'kronos', name: 'Kronos', status: 'idle' },
    { id: 'mnemosyne', name: 'Mnemosyne', status: 'idle' },
    { id: 'mercury', name: 'Mercury', status: 'idle' },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-xl font-semibold mb-4">Agents</h2>
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li key={agent.id} className="flex justify-between items-center">
            <span>{agent.name}</span>
            <span className={`text-sm ${agent.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
              {agent.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
