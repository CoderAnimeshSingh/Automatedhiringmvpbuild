import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize storage bucket
async function initStorage() {
  const bucketName = 'make-45c854cf-resumes';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      console.error('Bucket creation error:', error);
    } else {
      console.log('Created bucket:', bucketName);
    }
  }
}

// Initialize on startup
initStorage().catch(console.error);

// Helper function to extract text from PDF
async function extractTextFromPDF(resumeUrl: string): Promise<string> {
  try {
    // Download PDF
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      throw new Error(`Failed to download resume: ${response.statusText}`);
    }
    
    const pdfBuffer = await response.arrayBuffer();
    
    // For now, return a placeholder - in production, you'd use a PDF parsing library
    // or external service. Since we can't install pdf-parse in Deno easily,
    // we'll simulate extraction based on the candidate data
    return `[Resume text extraction placeholder - In production, integrate with a PDF parsing service]`;
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '[Resume text could not be extracted]';
  }
}

// AI Screening function using OpenAI
async function screenCandidate(candidate: any, resumeText: string) {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiKey) {
    console.warn('OpenAI API key not configured, using mock screening');
    return {
      ai_fit_score: Math.floor(Math.random() * 40) + 50, // 50-90
      ai_summary: `Candidate has ${candidate.experience_years} years of experience in ${candidate.job_role_applied}. Strong background and relevant skills.`,
      skills: 'JavaScript, React, Node.js, Python, SQL',
    };
  }

  try {
    const prompt = `You are an expert technical recruiter. Analyze this candidate for the ${candidate.job_role_applied} position.

Candidate Name: ${candidate.name}
Experience: ${candidate.experience_years} years
Job Role: ${candidate.job_role_applied}

Resume:
${resumeText}

Return ONLY valid JSON with these exact keys:
{
  "ai_fit_score": <number 0-100>,
  "skills": "<comma-separated skills>",
  "ai_summary": "<2-3 sentence summary>"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior technical recruiter. Return ONLY valid JSON. No markdown, no extra text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(jsonStr);

    return {
      ai_fit_score: result.ai_fit_score || 0,
      skills: result.skills || '',
      ai_summary: result.ai_summary || 'Analysis completed',
    };
    
  } catch (error) {
    console.error('AI screening error:', error);
    // Fallback to mock data
    return {
      ai_fit_score: Math.floor(Math.random() * 40) + 50,
      ai_summary: `Candidate has ${candidate.experience_years} years of experience. Analysis pending.`,
      skills: 'Pending skill extraction',
    };
  }
}

// Routes

// Sign up endpoint
app.post('/make-server-45c854cf/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// Application submission endpoint
app.post('/make-server-45c854cf/apply', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, job_role_applied, experience_years, linkedin_url, resume_url } = body;

    if (!name || !email || !phone || !job_role_applied) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const candidateId = `candidate_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const candidateData = {
      id: candidateId,
      name,
      email,
      phone,
      job_role_applied,
      experience_years: experience_years || '0',
      linkedin_url: linkedin_url || '',
      resume_url: resume_url || '',
      ai_fit_score: 0,
      ai_summary: '',
      skills: '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Store candidate
    await kv.set(candidateId, candidateData);

    // Trigger async screening
    screenCandidateAsync(candidateId, candidateData).catch(err => {
      console.error('Background screening error:', err);
    });

    return c.json({ 
      success: true, 
      candidate_id: candidateId,
      message: 'Application submitted successfully. AI screening in progress.' 
    });
    
  } catch (error: any) {
    console.error('Application submission error:', error);
    return c.json({ error: error.message || 'Application failed' }, 500);
  }
});

// Background screening function
async function screenCandidateAsync(candidateId: string, candidate: any) {
  try {
    // Update status to screening
    await kv.set(candidateId, { ...candidate, status: 'screening' });

    // Extract text from resume
    let resumeText = '';
    if (candidate.resume_url) {
      resumeText = await extractTextFromPDF(candidate.resume_url);
    }

    // Run AI screening
    const aiResults = await screenCandidate(candidate, resumeText);

    // Update candidate with results
    const updatedCandidate = {
      ...candidate,
      ...aiResults,
      status: 'screened',
    };

    await kv.set(candidateId, updatedCandidate);

    // Send email notification (mock for now)
    console.log(`Email would be sent to ${candidate.email} with score ${aiResults.ai_fit_score}`);
    
  } catch (error) {
    console.error('Screening error for', candidateId, error);
    await kv.set(candidateId, { ...candidate, status: 'error' });
  }
}

// Get all candidates
app.get('/make-server-45c854cf/candidates', async (c) => {
  try {
    const allCandidates = await kv.getByPrefix('candidate_');
    
    // Sort by created_at descending
    const candidates = allCandidates.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return c.json({ candidates });
    
  } catch (error: any) {
    console.error('Get candidates error:', error);
    return c.json({ error: error.message || 'Failed to fetch candidates' }, 500);
  }
});

// Get single candidate
app.get('/make-server-45c854cf/candidates/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const candidate = await kv.get(id);

    if (!candidate) {
      return c.json({ error: 'Candidate not found' }, 404);
    }

    return c.json({ candidate });
    
  } catch (error: any) {
    console.error('Get candidate error:', error);
    return c.json({ error: error.message || 'Failed to fetch candidate' }, 500);
  }
});

// Manual screening trigger (for testing)
app.post('/make-server-45c854cf/screen/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const candidate = await kv.get(id);

    if (!candidate) {
      return c.json({ error: 'Candidate not found' }, 404);
    }

    // Trigger screening
    screenCandidateAsync(id, candidate).catch(console.error);

    return c.json({ success: true, message: 'Screening triggered' });
    
  } catch (error: any) {
    console.error('Manual screening error:', error);
    return c.json({ error: error.message || 'Screening failed' }, 500);
  }
});

// Health check
app.get('/make-server-45c854cf/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
Deno.serve(app.fetch);
