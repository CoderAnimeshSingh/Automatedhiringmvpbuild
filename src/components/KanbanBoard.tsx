import { useState, DragEvent } from 'react';
import { MoreHorizontal, Clock, AlertCircle, CheckCircle, XCircle, User, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Candidate {
  id: string;
  name: string;
  job_role_applied: string;
  status: string;
  ai_fit_score: number;
}

interface KanbanBoardProps {
  candidates: Candidate[];
  onStatusChange: (id: string, newStatus: string) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

const COLUMNS = [
  { id: 'new', label: 'New', color: 'bg-blue-50 border-blue-200' },
  { id: 'screening', label: 'Screening', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'screened', label: 'Screened', color: 'bg-purple-50 border-purple-200' },
  { id: 'interview', label: 'Interview', color: 'bg-indigo-50 border-indigo-200' },
  { id: 'offer', label: 'Offer', color: 'bg-green-50 border-green-200' },
  { id: 'hired', label: 'Hired', color: 'bg-teal-50 border-teal-200' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-50 border-red-200' },
];

export function KanbanBoard({ candidates, onStatusChange, onCandidateClick }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    if (draggedId) {
      onStatusChange(draggedId, status);
      setDraggedId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)] min-w-full">
      {COLUMNS.map((column) => {
        const columnCandidates = candidates.filter((c) => c.status === column.id);

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 rounded-xl border ${column.color} flex flex-col h-full`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                {column.label}
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {columnCandidates.length}
                </span>
              </h3>
            </div>

            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {columnCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    onClick={() => onCandidateClick(candidate)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all active:scale-95 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {candidate.name}
                      </h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">{candidate.job_role_applied}</p>
                    
                    <div className="flex items-center justify-between">
                      {candidate.ai_fit_score > 0 ? (
                        <Badge variant="secondary" className={getScoreColor(candidate.ai_fit_score)}>
                          {candidate.ai_fit_score}% Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Pending
                        </Badge>
                      )}
                      
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
