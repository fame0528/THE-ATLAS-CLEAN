'use client';

import { useState } from 'react';
import type { Agent } from '@/types';

interface AgentModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export function AgentModal({ agent, onClose }: AgentModalProps) {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{agent.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Role:</span> {agent.role}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{' '}
            <span className={`px-2 py-1 rounded text-white text-xs ${
              agent.status === 'idle' || agent.status === 'running' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {agent.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Workspace:</span>{' '}
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-1 rounded">{agent.workspacePath}</code>
          </div>
          <div>
            <span className="font-semibold">Last Message:</span>{' '}
            {agent.lastMessageTime ? new Date(agent.lastMessageTime).toLocaleString() : 'Never'}
          </div>
          {agent.memoryHealth && (
            <div>
              <span className="font-semibold">Memory Health:</span> {agent.memoryHealth.indexStatus}
              {agent.memoryHealth.lastIndexTime && (
                <span className="text-gray-500 text-sm ml-2">
                  (last index: {new Date(agent.memoryHealth.lastIndexTime).toLocaleString()})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
