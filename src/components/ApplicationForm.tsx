import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, AlertCircle, Bot, ArrowLeft } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = getSupabaseClient();

export function ApplicationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job_role_applied: '',
    experience_years: '',
    linkedin_url: '',
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let resume_url = '';
      let resume_data = '';
      let resume_filename = '';
      
      // Prepare resume for upload via server (to bypass RLS)
      if (resumeFile) {
        // Convert file to base64
        const fileToBase64 = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const result = reader.result as string;
              // Remove data URL prefix
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = error => reject(error);
          });
        };

        resume_data = await fileToBase64(resumeFile);
        resume_filename = resumeFile.name;
      }

      // Submit application via server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-45c854cf/apply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            resume_data,
            resume_filename,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Application submission failed' }));
        throw new Error(errorData.error || 'Application submission failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err: any) {
      console.error('Application error:', err);
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying! Our AI is analyzing your resume right now. 
            You'll receive an email with the results within a few minutes.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-4">
            <Bot className="w-10 h-10 text-white mx-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl mb-4">Apply for a Position</h1>
          <p className="text-xl text-gray-600">
            Fill out the form below and our AI will screen your application instantly
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Job Role Applying For <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.job_role_applied}
                  onChange={(e) => setFormData({ ...formData, job_role_applied: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  LinkedIn URL (Optional)
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">
                Upload Resume (PDF) <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {resumeFile ? (
                    <p className="text-green-600">{resumeFile.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-1">Click to upload resume</p>
                      <p className="text-sm text-gray-500">PDF only, max 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="mb-3 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            What happens next?
          </h3>
          <ol className="space-y-2 text-gray-700">
            <li>1. Our AI analyzes your resume and extracts key information</li>
            <li>2. You receive an automated fit score based on the job requirements</li>
            <li>3. Top candidates get interview scheduling links via email</li>
            <li>4. HR team reviews qualified candidates and proceeds with hiring</li>
          </ol>
        </div>
      </div>
    </div>
  );
}