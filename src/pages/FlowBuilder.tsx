import { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  ReactFlowProvider,
  type BuiltInNode // Import BuiltInNode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Save } from 'lucide-react';
// Import the component AND the type we just created
import CustomNode, { type CustomNodeType } from '../components/CustomNode';

// 1. Define the Union Type for all nodes in your app
// This tells TS: "A node can be a default node OR our custom node"
type AppNode = BuiltInNode | CustomNodeType;

const initialNodes: AppNode[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Start Trigger' }, type: 'custom' },
];

function FlowBuilderContent() {
  // 2. Use AppNode[] for state
  const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  // 3. Register the custom node type
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onNodesChange: OnNodesChange<AppNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const addNewNode = () => {
    const newNode: CustomNodeType = {
      id: Math.random().toString(), 
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: 'New Action' }, 
      type: 'custom', 
    };
    // We cast to AppNode[] to keep TS happy with the concat
    setNodes((nds) => nds.concat(newNode as AppNode));
  };

  const handleSave = () => {
    localStorage.setItem('flow-nodes', JSON.stringify(nodes));
    localStorage.setItem('flow-edges', JSON.stringify(edges));
    alert('Workflow Saved to Local Storage!');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
           <div>
             <h1 className="font-bold text-gray-800 text-sm">Demanual Automation</h1>
             <p className="text-xs text-gray-500">Production Workflow</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 text-gray-600 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition">
            <Save size={16} /> Save
          </button>
          <button onClick={addNewNode} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition shadow-lg">
            <Plus size={16} /> Add Node
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#e1e1e1" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  );
}