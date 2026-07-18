import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// We define initial node generation based on project details
const generateInitialElements = (project) => {
  const nodes = [];
  const edges = [];

  // Project Core Node
  nodes.push({
    id: 'project-core',
    position: { x: 400, y: 100 },
    data: { label: project.projectname || 'Project Core' },
    style: {
      background: '#141419',
      color: '#fff',
      border: '2px solid var(--accent-primary)',
      borderRadius: '8px',
      padding: '16px',
      fontWeight: 'bold',
      boxShadow: '0 0 20px rgba(217,119,87,0.3)',
      width: 250,
      textAlign: 'center'
    }
  });

  // Skills / Roles Nodes
  const skills = project.requiredSkill || [];
  skills.forEach((skill, index) => {
    const skillId = `skill-${index}`;
    nodes.push({
      id: skillId,
      position: { x: 200 + index * 220, y: 300 },
      data: { label: skill },
      style: {
        background: '#0B0B0F',
        color: '#fff',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '12px',
        width: 180,
        textAlign: 'center'
      }
    });

    edges.push({
      id: `e-core-${skillId}`,
      source: 'project-core',
      target: skillId,
      animated: true,
      style: { stroke: 'var(--accent-primary)', strokeWidth: 2 }
    });
  });

  // Members Nodes (distribute them below skills)
  const members = project.members || [];
  members.forEach((member, index) => {
    const memberId = `member-${member._id}`;
    nodes.push({
      id: memberId,
      position: { x: 200 + (index * 150), y: 500 },
      data: { label: member.username },
      style: {
        background: 'var(--accent-secondary)',
        color: '#111',
        border: 'none',
        borderRadius: '24px',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: 120
      }
    });
    
    // We leave member nodes unconnected initially so the user can drag and drop 
    // connections to map members to specific roles!
  });

  return { nodes, edges };
};

const WorkspaceCanvas = ({ project, onClose }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (project) {
      const storageKey = `collabspace-workspace-${project._id}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        try {
          const { savedNodes, savedEdges } = JSON.parse(savedData);
          setNodes(savedNodes);
          setEdges(savedEdges);
        } catch (e) {
          const initial = generateInitialElements(project);
          setNodes(initial.nodes);
          setEdges(initial.edges);
        }
      } else {
        const initial = generateInitialElements(project);
        setNodes(initial.nodes);
        setEdges(initial.edges);
      }
      setIsLoaded(true);
    }
  }, [project, setNodes, setEdges]);

  // Save to local storage whenever nodes or edges change
  useEffect(() => {
    if (isLoaded && project) {
      const storageKey = `collabspace-workspace-${project._id}`;
      localStorage.setItem(storageKey, JSON.stringify({ savedNodes: nodes, savedEdges: edges }));
    }
  }, [nodes, edges, isLoaded, project]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } }, eds)), [setEdges]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#0B0B0F' }}>
      <div style={{ position: 'absolute', top: '24px', right: '32px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Changes saved locally</span>
        <button onClick={onClose} className="ceramic-btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '12px 24px' }}>
          <span className="material-symbols-outlined">close</span> Close Workspace
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#333" />
        <Controls style={{ backgroundColor: '#141419', borderColor: '#333' }} />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id === 'project-core') return 'var(--accent-primary)';
            if (node.id.startsWith('member')) return 'var(--accent-secondary)';
            return '#333';
          }}
          style={{ backgroundColor: '#141419' }}
          maskColor="rgba(0,0,0,0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export default WorkspaceCanvas;
