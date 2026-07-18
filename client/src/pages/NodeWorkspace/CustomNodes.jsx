import React from 'react';
import { Handle, Position } from '@xyflow/react';

const terminalNodeStyle = {
  background: '#0B0B0F',
  border: '1px solid #2a2a35',
  borderRadius: '6px',
  padding: '16px',
  color: '#c9d1d9',
  fontFamily: "'Fira Code', monospace",
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  minWidth: '200px'
};

const Header = ({ title, icon, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #2a2a35', paddingBottom: '8px', marginBottom: '12px' }}>
    <span className="material-symbols-outlined" style={{ fontSize: '18px', color }}>{icon}</span>
    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{title}</span>
  </div>
);

export const LinkNode = ({ data, isConnectable }) => {
  return (
    <div style={terminalNodeStyle}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Header title="External Link" icon="link" color="#38bdf8" />
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '12px', wordBreak: 'break-all' }}>
        {data.url || 'No URL configured'}
      </div>
      <button 
        className="terminal-btn" 
        onClick={() => data.url && window.open(data.url, '_blank')}
        style={{ width: '100%', padding: '4px 8px', fontSize: '0.8rem', borderColor: '#38bdf8', color: '#38bdf8' }}
      >
        [&gt;] OPEN_LINK
      </button>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};

export const NoteNode = ({ data, isConnectable }) => {
  return (
    <div style={{ ...terminalNodeStyle, borderColor: '#facc15' }}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Header title="Developer Note" icon="edit_note" color="#facc15" />
      <textarea
        defaultValue={data.text || 'Write your note here...'}
        className="terminal-input"
        style={{ 
          width: '100%', 
          minHeight: '80px', 
          resize: 'none', 
          background: '#111116',
          border: '1px solid #2a2a35',
          color: '#c9d1d9',
          fontFamily: "'Fira Code', monospace",
          padding: '8px',
          fontSize: '0.8rem'
        }}
        onChange={(e) => {
          if(data.onChange) data.onChange(e.target.value);
        }}
      />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};

export const ActionNode = ({ data, isConnectable }) => {
  return (
    <div style={{ ...terminalNodeStyle, borderColor: '#4ade80' }}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Header title="Internal Trigger" icon="play_arrow" color="#4ade80" />
      <div style={{ fontSize: '0.8rem', marginBottom: '12px' }}>
        {data.label || 'Action'}
      </div>
      <button 
        className="terminal-btn" 
        onClick={() => data.action && data.action()}
        style={{ width: '100%', padding: '4px 8px', fontSize: '0.8rem', borderColor: '#4ade80', color: '#4ade80' }}
      >
        [!] EXECUTE
      </button>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};
