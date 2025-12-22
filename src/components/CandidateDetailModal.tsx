import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { OfferLetterGenerator } from './OfferLetterGenerator';
import { Mail, Phone, Linkedin, FileText, Brain, AlertTriangle, CheckCircle, HelpCircle, Calendar } from 'lucide-react';

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

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export function CandidateDetailModal({ candidate, isOpen, onClose, onStatusChange }: CandidateDetailModalProps) {
  const [offerSalary, setOfferSalary] = useState('120000');
  const [offerStartDate, setOfferStartDate] = useState(new Date().toISOString().split('T')[0]);

  if (!candidate) return null;

  const skillsList = candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">{candidate.name}</SheetTitle>
              <SheetDescription className="text-lg text-blue-600 font-medium">
                {candidate.job_role_applied}
              </SheetDescription>
            </div>
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-1 ${
                candidate.ai_fit_score >= 70 ? 'bg-green-100 text-green-700 border-green-200' : 
                candidate.ai_fit_score >= 40 ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {candidate.ai_fit_score}% Fit
            </Badge>
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                window.open(`mailto:${candidate.email}?subject=Interview Invitation for ${candidate.job_role_applied}&body=Hi ${candidate.name},%0D%0A%0D%0AWe reviewed your application and would like to invite you for an interview.%0D%0A%0D%0APlease pick a convenient time from my calendar here: [INSERT CALENDLY LINK]%0D%0A%0D%0ABest regards,%0D%0AHR Team`, '_blank');
                onStatusChange(candidate.id, 'interview');
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="offer">Offer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </span>
                <p className="font-medium">{candidate.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone
                </span>
                <p className="font-medium">{candidate.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </span>
                <a 
                  href={candidate.linkedin_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:underline truncate block"
                >
                  {candidate.linkedin_url || 'Not provided'}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Resume
                </span>
                {candidate.resume_url ? (
                  <a 
                    href={candidate.resume_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
            </div>

            <Separator />

            {/* AI Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-800">
                <Brain className="w-4 h-4" /> AI Summary
              </h3>
              <p className="text-blue-900/80 leading-relaxed">
                {candidate.ai_summary || "Analysis pending..."}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.length > 0 ? (
                  skillsList.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills extracted</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            {/* Missing Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Missing Critical Skills
              </h3>
              {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                <ul className="space-y-2">
                  {candidate.missing_skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <XCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600 flex items-center gap-2 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5" /> No major skill gaps identified.
                </p>
              )}
            </div>

            <Separator />

            {/* Interview Questions */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-indigo-700">
                <HelpCircle className="w-5 h-5" />
                Recommended Interview Questions
              </h3>
              {candidate.interview_questions && candidate.interview_questions.length > 0 ? (
                <div className="space-y-3">
                  {candidate.interview_questions.map((q, i) => (
                    <div key={i} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-medium text-indigo-900">Q{i + 1}: {q}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Generating questions...</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="offer" className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={offerStartDate}
                  onChange={(e) => setOfferStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={offerSalary}
                  onChange={(e) => setOfferSalary(e.target.value)}
                />
              </div>
            </div>

            <OfferLetterGenerator
              candidateName={candidate.name}
              jobRole={candidate.job_role_applied}
              startDate={offerStartDate}
              salary={offerSalary}
            />
            
            <div className="mt-8 pt-6 border-t flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Ready to hire?</p>
                <p className="text-sm text-gray-500">Move candidate to "Offer Sent" stage</p>
              </div>
              <Button 
                onClick={() => {
                  onStatusChange(candidate.id, 'offer');
                  onClose();
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Send Offer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
