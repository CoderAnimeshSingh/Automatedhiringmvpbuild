import { useState, useEffect } from 'react';
import { Bot, Users, TrendingUp, Clock, Search, Filter, Download, LogOut, Mail, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

    // Status filter
    if (statusFilter !== 'all') {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">HRFlow AI Dashboard</h1>
                <p className="text-sm text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Candidates"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Screened"
            value={stats.screened}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="High Scorers (70+)"
            value={stats.highScore}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Avg Fit Score"
            value={`${stats.avgScore}%`}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="screened">Screened</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="high">High (70+)</option>
              <option value="medium">Medium (40-69)</option>
              <option value="low">Low (&lt;40)</option>
            </select>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Candidates ({filteredCandidates.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading candidates...</p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No candidates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Job Role</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Experience</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Fit Score</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <CandidateRow key={candidate.id} candidate={candidate} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl">{value}</p>
    </div>
  );
}

function CandidateRow({ candidate }: { candidate: Candidate }) {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'text-blue-600 bg-blue-100',
      screening: 'text-yellow-600 bg-yellow-100',
      screened: 'text-green-600 bg-green-100',
      interview: 'text-purple-600 bg-purple-100',
      rejected: 'text-red-600 bg-red-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-6 py-4">
          <div>
            <p>{candidate.name}</p>
            <p className="text-sm text-gray-600">{candidate.email}</p>
          </div>
        </td>
        <td className="px-6 py-4">{candidate.job_role_applied}</td>
        <td className="px-6 py-4">{candidate.experience_years} years</td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm ${getScoreColor(candidate.ai_fit_score || 0)}`}>
            {candidate.ai_fit_score || 0}%
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${candidate.email}`, '_blank');
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </button>
            {candidate.resume_url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(candidate.resume_url, '_blank');
                }}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                title="Download Resume"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p>{candidate.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">LinkedIn</p>
                  <p>{candidate.linkedin_url || 'Not provided'}</p>
                </div>
              </div>
              {candidate.skills && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {candidate.ai_summary && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">AI Summary</p>
                  <p className="text-gray-700">{candidate.ai_summary}</p>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Applied: {new Date(candidate.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}