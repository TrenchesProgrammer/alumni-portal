'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { TableNode } from './table-node';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const nodeTypes = {
  tableNode: TableNode,
};

const initialNodes = [
  {
    id: 'profiles',
    type: 'tableNode',
    position: { x: 400, y: 150 },
    data: {
      tableName: 'public.profiles',
      columns: [
        { name: 'id', type: 'uuid', isPk: true },
        { name: 'role', type: 'user_role' },
        { name: 'status', type: 'user_status' },
        { name: 'full_name', type: 'text' },
        { name: 'avatar_url', type: 'text' },
        { name: 'bio', type: 'text' },
        { name: 'github_url', type: 'text' },
        { name: 'linkedin_url', type: 'text' },
        { name: 'matric_number', type: 'text' },
        { name: 'graduation_year', type: 'integer' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'auth.users',
    type: 'tableNode',
    position: { x: 50, y: 150 },
    data: {
      tableName: 'auth.users',
      columns: [
        { name: 'id', type: 'uuid', isPk: true },
        { name: 'email', type: 'text' },
        { name: 'raw_user_meta_data', type: 'jsonb' },
      ],
    },
  },
  {
    id: 'tech_stacks',
    type: 'tableNode',
    position: { x: 800, y: 50 },
    data: {
      tableName: 'public.tech_stacks',
      columns: [
        { name: 'id', type: 'uuid', isPk: true },
        { name: 'name', type: 'text' },
      ],
    },
  },
  {
    id: 'user_tech_stacks',
    type: 'tableNode',
    position: { x: 800, y: 250 },
    data: {
      tableName: 'public.user_tech_stacks',
      columns: [
        { name: 'user_id', type: 'uuid', isPk: true, isFk: true },
        { name: 'tech_id', type: 'uuid', isPk: true, isFk: true },
      ],
    },
  },
  {
    id: 'mentorship_requests',
    type: 'tableNode',
    position: { x: 800, y: 450 },
    data: {
      tableName: 'public.mentorship_requests',
      columns: [
        { name: 'id', type: 'uuid', isPk: true },
        { name: 'student_id', type: 'uuid', isFk: true },
        { name: 'alumni_id', type: 'uuid', isFk: true },
        { name: 'status', type: 'request_status' },
        { name: 'message', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'jobs',
    type: 'tableNode',
    position: { x: 400, y: 600 },
    data: {
      tableName: 'public.jobs',
      columns: [
        { name: 'id', type: 'uuid', isPk: true },
        { name: 'alumni_id', type: 'uuid', isFk: true },
        { name: 'title', type: 'text' },
        { name: 'company', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'visibility', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
];

const initialEdges = [
  {
    id: 'e-profiles-users',
    source: 'profiles',
    sourceHandle: 'id-left',
    target: 'auth.users',
    targetHandle: 'id-right',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  },
  {
    id: 'e-user_tech_stacks-profiles',
    source: 'user_tech_stacks',
    sourceHandle: 'user_id-left',
    target: 'profiles',
    targetHandle: 'id-right',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
  },
  {
    id: 'e-user_tech_stacks-tech_stacks',
    source: 'user_tech_stacks',
    sourceHandle: 'tech_id-left',
    target: 'tech_stacks',
    targetHandle: 'id-left',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
  },
  {
    id: 'e-mentorship-student',
    source: 'mentorship_requests',
    sourceHandle: 'student_id-left',
    target: 'profiles',
    targetHandle: 'id-right',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e-mentorship-alumni',
    source: 'mentorship_requests',
    sourceHandle: 'alumni_id-left',
    target: 'profiles',
    targetHandle: 'id-right',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e-jobs-alumni',
    source: 'jobs',
    sourceHandle: 'alumni_id-left',
    target: 'profiles',
    targetHandle: 'id-left',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
  },
];

export default function ERDDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(() => {
    if (reactFlowWrapper.current === null) {
      return;
    }
    
    // Temporarily hide controls/panels for screenshot
    const elementsToHide = reactFlowWrapper.current.querySelectorAll('.react-flow__controls, .react-flow__panel');
    elementsToHide.forEach((el: any) => el.style.display = 'none');

    toPng(reactFlowWrapper.current, {
      filter: (node) => {
        // Exclude UI controls from the image
        if (node?.classList?.contains('react-flow__controls') || node?.classList?.contains('react-flow__panel')) {
          return false;
        }
        return true;
      },
      backgroundColor: '#ffffff',
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'alumni-portal-erd.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download image', err);
      })
      .finally(() => {
        // Restore controls/panels
        elementsToHide.forEach((el: any) => el.style.display = '');
      });
  }, []);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-muted/10"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        <Panel position="top-right" className="bg-background/80 p-2 rounded-md shadow-sm border backdrop-blur-sm">
          <Button onClick={downloadImage} size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download ERD
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
