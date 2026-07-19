import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

const terminalNodeStyle = {
  background: '#0B0B0F',
  color: '#c9d1d9',
  fontFamily: "'Fira Code', monospace",
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

export const NoteNode = ({ id, data, isConnectable }) => {
  return (
    <div style={{ ...terminalNodeStyle, border: '1px solid #facc15', borderRadius: '6px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Header id={id} title="Developer Note" icon="edit_note" color="#facc15" />
      <textarea
        defaultValue={data.text || ''}
        placeholder="Write your note here..."
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
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export const FeatureNode = ({ id, data, isConnectable }) => {
  const { setNodes } = useReactFlow();
  
  return (
    <div style={{ ...terminalNodeStyle, border: '2px solid #a855f7', borderRadius: '8px', padding: '12px', boxShadow: '0 0 15px rgba(168,85,247,0.3)', minWidth: '180px', textAlign: 'center' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
        <button 
          onClick={() => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
          }}
          style={{ background: 'none', border: 'none', color: '#ff5f56', cursor: 'pointer', display: 'flex', padding: 0 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      </div>

      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>
        {data.label || 'Feature Node'}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#a855f7' }}>FEATURE</div>
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export const ToolNode = ({ id, data, isConnectable }) => {
  const { setNodes } = useReactFlow();

  return (
    <div style={{ ...terminalNodeStyle, border: '2px solid #f97316', borderRadius: '8px', padding: '12px', boxShadow: '0 0 15px rgba(249,115,22,0.3)', minWidth: '180px', textAlign: 'center' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
        <button 
          onClick={() => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
          }}
          style={{ background: 'none', border: 'none', color: '#ff5f56', cursor: 'pointer', display: 'flex', padding: 0 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      </div>

      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>
        {data.label || 'Tool Node'}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#f97316' }}>TOOL / TECH</div>
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};
