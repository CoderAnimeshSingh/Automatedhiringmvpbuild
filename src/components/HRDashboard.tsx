import { useState, useEffect } from 'react';
import { Bot, Users, TrendingUp, Clock, Search, Filter, LogOut, LayoutGrid, List as ListIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { KanbanBoard } from './KanbanBoard';
import { CandidateDetailModal } from './CandidateDetailModal';
import { Button } from './ui/button';

const supabase = getSupabaseClient();

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_role_applied: string;
  experience_years: string;
  linkedin_url: string;
  resume_url: string;
  ai_fit_score: number;
  ai_summary: string;
  skills: string;
  missing_skills?: string[];
  interview_questions?: string[];
  status: string;
  created_at: string;
}

export function HRDashboard({ session, onLogout }: { session: any; onLogout: () => void }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadCandidates();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('candidates-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kv_store_45c854cf' },
        (payload) => {
          loadCandidates();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, statusFilter, scoreFilter]);

  const loadCandidates = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-45c854cf/candidates`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load candidates');
      }

      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error('Error loading candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-45c854cf/candidates/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      // Revert on error
      loadCandidates();
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.job_role_applied?.toLowerCase().includes(term)
      );
    }

    // Status filter (Only for List view, Kanban shows all columns)
    if (viewMode === 'list' && statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Score filter
    if (scoreFilter === 'high') {
      filtered = filtered.filter(c => c.ai_fit_score >= 70);
    } else if (scoreFilter === 'medium') {
      filtered = filtered.filter(c => c.ai_fit_score >= 40 && c.ai_fit_score < 70);
    } else if (scoreFilter === 'low') {
      filtered = filtered.filter(c => c.ai_fit_score < 40);
    }

    // Sort by score descending
    filtered.sort((a, b) => (b.ai_fit_score || 0) - (a.ai_fit_score || 0));

    setFilteredCandidates(filtered);
  };

  const stats = {
    total: candidates.length,
    screened: candidates.filter(c => c.status === 'screened').length,
    highScore: candidates.filter(c => c.ai_fit_score >= 70).length,
    avgScore: candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + (c.ai_fit_score || 0), 0) / candidates.length)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  HRFlow AI
                </h1>
                <p className="text-xs text-gray-500 font-medium">ENTERPRISE EDITION</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                  List
                </button>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden flex flex-col">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Candidates"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Screened"
            value={stats.screened}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Top Talent (70%+)"
            value={stats.highScore}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Avg Fit Score"
            value={`${stats.avgScore}%`}
            color="orange"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
             {viewMode === 'list' && (
               <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="screening">Screening</option>
                <option value="screened">Screened</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
             )}
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="high">High Match (70+)</option>
              <option value="medium">Medium (40-69)</option>
              <option value="low">Low (&lt;40)</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
              <p>No candidates found matching your filters</p>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard 
              candidates={filteredCandidates} 
              onStatusChange={handleStatusChange}
              onCandidateClick={setSelectedCandidate}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Fit Score</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCandidates.map((candidate) => (
                      <tr 
                        key={candidate.id} 
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-sm text-gray-500">{candidate.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{candidate.job_role_applied}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            candidate.ai_fit_score >= 70 ? 'bg-green-100 text-green-800' :
                            candidate.ai_fit_score >= 40 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {candidate.ai_fit_score}% Match
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wide">
                            {candidate.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(candidate);
                          }}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <CandidateDetailModal 
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses} rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
