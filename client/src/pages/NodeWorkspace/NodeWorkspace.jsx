import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LinkNode, NoteNode, ActionNode } from './CustomNodes';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  linkNode: LinkNode,
  noteNode: NoteNode,
  actionNode: ActionNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'actionNode',
    position: { x: 250, y: 200 },
    data: { label: 'Go to Profile', action: null }, // action bound in component
  }
];

const initialEdges = [];

const NodeWorkspace = () => {
  const navigate = useNavigate();
  
  // Try to load from localStorage
  const savedNodes = JSON.parse(localStorage.getItem('collabspace_nodes'));
  const savedEdges = JSON.parse(localStorage.getItem('collabspace_edges'));

  const [nodes, setNodes, onNodesChange] = useNodesState(savedNodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedEdges || initialEdges);
  
  const [menu, setMenu] = useState(null);
  const reactFlowWrapper = useRef(null);

  // Bind actions to action nodes (since functions can't be saved in localStorage)
  const processedNodes = nodes.map(node => {
    if (node.type === 'actionNode') {
      return {
        ...node,
        data: {
          ...node.data,
          action: () => navigate('/profile') // Hardcoded for demo, could be dynamic
        }
      };
    }
    return node;
  });

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({ ...params, animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } }, edges);
      setEdges(newEdges);
      localStorage.setItem('collabspace_edges', JSON.stringify(newEdges));
    },
    [edges, setEdges],
  );

  const onNodeDragStop = useCallback(() => {
    localStorage.setItem('collabspace_nodes', JSON.stringify(nodes));
  }, [nodes]);

  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        top: event.clientY - bounds.top,
        left: event.clientX - bounds.left,
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const addNode = (type) => {
    if (!menu) return;

    // A real implementation would project the mouse coordinates to the react flow instance coordinates
    // but for this prototype, simple offset is okay
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: { x: menu.left, y: menu.top },
      data: type === 'linkNode' 
        ? { url: prompt('Enter URL (e.g., https://github.com):') || 'https://google.com' }
        : type === 'noteNode' 
          ? { text: '' }
          : { label: 'Go to Profile' }
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    localStorage.setItem('collabspace_nodes', JSON.stringify(updatedNodes));
    setMenu(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={processedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="dark-theme"
        style={{ background: '#050508' }}
      >
        <Controls style={{ fill: '#c9d1d9', color: '#c9d1d9', backgroundColor: '#111116', borderColor: '#2a2a35' }} />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'linkNode') return '#38bdf8';
            if (node.type === 'noteNode') return '#facc15';
            return '#4ade80';
          }}
          style={{ backgroundColor: '#0B0B0F', border: '1px solid #2a2a35' }}
          maskColor="rgba(0,0,0,0.7)"
        />
        <Background variant="dots" gap={20} size={1} color="#2a2a35" />
      </ReactFlow>

      {menu && (
        <div
          style={{
            position: 'absolute',
            top: menu.top,
            left: menu.left,
            background: '#111116',
            border: '1px solid #38bdf8',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            borderRadius: '4px',
            zIndex: 1000,
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '180px'
          }}
        >
          <div style={{ color: '#888', fontSize: '0.75rem', paddingBottom: '4px', borderBottom: '1px solid #2a2a35' }}>
            [ SPAWN NODE ]
          </div>
          <button className="terminal-btn" style={{ borderColor: '#38bdf8', color: '#38bdf8', fontSize: '0.8rem' }} onClick={() => addNode('linkNode')}>
            + External Link
          </button>
          <button className="terminal-btn" style={{ borderColor: '#facc15', color: '#facc15', fontSize: '0.8rem' }} onClick={() => addNode('noteNode')}>
            + Developer Note
          </button>
          <button className="terminal-btn" style={{ borderColor: '#4ade80', color: '#4ade80', fontSize: '0.8rem' }} onClick={() => addNode('actionNode')}>
            + Profile Action
          </button>
        </div>
      )}

      {/* Mode Indicator overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '8px 16px', borderRadius: '4px', fontFamily: "'Fira Code', monospace", fontWeight: 700, pointerEvents: 'none' }}>
        &gt;&gt; ADVANCED NODE WORKSPACE ACTIVE
        <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px', fontWeight: 400 }}>Right-click anywhere to spawn blocks</div>
      </div>
    </div>
  );
};

export default NodeWorkspace;
