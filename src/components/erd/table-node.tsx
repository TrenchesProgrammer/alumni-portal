import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const TableNode = memo(({ data }: any) => {
  return (
    <div className="bg-background border rounded-lg shadow-sm min-w-[250px] font-mono text-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 border-b p-2 font-bold flex justify-between items-center text-primary">
        <span>{data.tableName}</span>
      </div>

      {/* Columns */}
      <div className="p-0">
        {data.columns.map((col: any, index: number) => (
          <div key={col.name} className="relative flex justify-between items-center px-3 py-1.5 border-b last:border-b-0 hover:bg-muted/50">
            {/* Left handle for incoming relations */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${col.name}-left`}
              style={{ top: '50%', background: 'transparent', border: 'none', width: '10px', height: '10px', left: '-5px' }}
            />
            
            <div className="flex items-center gap-2">
              {col.isPk && <span className="text-yellow-600 font-bold" title="Primary Key">🔑</span>}
              {col.isFk && <span className="text-blue-500 font-bold" title="Foreign Key">🔗</span>}
              <span className={`font-semibold ${col.isPk || col.isFk ? 'text-foreground' : 'text-foreground/80'}`}>{col.name}</span>
            </div>
            <span className="text-muted-foreground text-xs">{col.type}</span>

            {/* Right handle for outgoing relations */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${col.name}-right`}
              style={{ top: '50%', background: 'transparent', border: 'none', width: '10px', height: '10px', right: '-5px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

TableNode.displayName = 'TableNode';
