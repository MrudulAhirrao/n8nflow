import React, { memo } from 'react';
import { Handle, Position, useReactFlow, type NodeProps, type Node } from '@xyflow/react';
import { X } from 'lucide-react';

export type CustomNodeData = {
  label: string;
};

export type CustomNodeType = Node<CustomNodeData, 'custom'>;

const CustomNode = ({ id, data }: NodeProps<CustomNodeType>) => {
  const { setNodes, deleteElements } = useReactFlow();

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const handleLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = evt.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      })
    );
  };

  return (
    <div className="min-w-[180px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden group hover:border-teal-500 transition-colors">
      <div className="h-2 bg-teal-500 w-full" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
           {/* FIX: Merged className and nodrag into one string */}
           <input 
             className="nodrag font-bold text-gray-700 text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-teal-500 outline-none w-full mr-2"
             value={data.label}
             onChange={handleLabelChange}
             placeholder="Node Name"
           />
           <button 
             onClick={handleDelete}
             className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
           >
             <X size={14} />
           </button>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
          Processor
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white" />
    </div>
  );
};

export default memo(CustomNode);