import React from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';

const terminalNodeStyle = {
  background: '#0B0B0F',
  border: '1px solid #2a2a35',
  borderRadius: '6px',
  padding: '16px',
  color: '#c9d1d9',
  fontFamily: "'Fira Code', monospace",
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  minWidth: '200px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
};

const Header = ({ id, title, icon, color }) => {
  const { setNodes } = useReactFlow();
  
  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a35', paddingBottom: '8px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color }}>{icon}</span>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{title}</span>
      </div>
      <button 
        onClick={handleDelete}
        style={{ background: 'none', border: 'none', color: '#ff5f56', cursor: 'pointer', display: 'flex', padding: 0 }}
        title="Delete Node"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
      </button>
    </div>
  );
};

export const LinkNode = ({ id, data, selected, isConnectable }) => {
  return (
    <>
      <NodeResizer color="#38bdf8" isVisible={selected} minWidth={300} minHeight={200} />
      <div style={{ ...terminalNodeStyle, minWidth: '300px', minHeight: '200px', padding: '8px' }}>
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
        <Header id={id} title={data.url} icon="language" color="#38bdf8" />
        <div style={{ flexGrow: 1, position: 'relative', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
          {/* We add a transparent overlay when selected to prevent the iframe from stealing mouse events during resize/drag */}
          {selected && <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}></div>}
          <iframe 
            src={data.url} 
            title="External Link"
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      </div>
    </>
  );
};

export const NoteNode = ({ id, data, isConnectable }) => {
  return (
    <div style={{ ...terminalNodeStyle, borderColor: '#facc15' }}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Header id={id} title="Developer Note" icon="edit_note" color="#facc15" />
      <textarea
        defaultValue={data.text || 'Write your note here...'}
        className="terminal-input nodrag"
        style={{ 
          width: '100%', 
          flexGrow: 1,
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

export const ActionNode = ({ id, data, isConnectable }) => {
  return (
    <div style={{ ...terminalNodeStyle, borderColor: '#4ade80' }}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Header id={id} title="Internal Trigger" icon="play_arrow" color="#4ade80" />
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
