# HRFlow AI 🚀

**Intelligent Hiring & Talent OS**

HRFlow AI is a production-ready, AI-native full-stack recruitment platform designed to automate and optimize the entire hiring lifecycle. From resume intake to offer letter generation, HRFlow AI leverages advanced LLMs to provide structured data extraction, candidate fit scoring, and automated workflow management.

![HRFlow AI Dashboard](https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000)

## 🌟 Core Features

### 🤖 AI-Powered Recruitment
- **Smart Resume Screening**: Automatically extracts candidate data (experience, skills, contact info) from PDF resumes.
- **AI Fit Score**: Instantly grades candidates (0-100) based on job description alignment.
- **Skill Gap Analysis**: Identifies missing critical skills for every applicant.
- **Interview Question Generator**: Creates tailored interview questions based on the candidate's specific profile and gaps.

### 📋 Intelligent Pipeline
- **Kanban Workflow**: Drag-and-drop candidates through stages (New, Screening, Interview, Offer, Hired).
- **Automated Status Tracking**: Real-time updates on candidate progress.
- **Visual Dashboard**: High-level metrics on pipeline health and candidate quality.

### 📄 Document Automation
- **AI Offer Letter Generator**: One-click generation of professional offer letters.
- **Resume Parsing**: Converts unstructured PDF data into searchable structured records.

### 🔒 Enterprise-Grade Security
- **Role-Based Authentication**: Secure login for HR and Admin users.
- **Data Privacy**: Row-Level Security (RLS) compliant architecture.
- **Secure Storage**: Private resume storage with signed URL access.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Supabase Edge Functions (Deno), Hono
- **Database**: Supabase KV Store (Postgres backed)
- **Storage**: Supabase Storage (for Resumes)
- **AI**: OpenAI GPT-4o (or fallback mock engine)
- **State Management**: React Hooks & Real-time Subscriptions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Account
- OpenAI API Key (optional, for live AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hrflow-ai.git
   cd hrflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
/
├── components/          # React Components
│   ├── ui/             # ShadCN UI Components
│   ├── HRDashboard.tsx # Main Admin Interface
│   ├── KanbanBoard.tsx # Drag-and-drop Pipeline
│   └── ...
├── supabase/
│   └── functions/      # Edge Functions (Backend)
├── utils/              # Helper functions & Supabase client
└── App.tsx             # Main Application Entry
```

## 🔮 Future Roadmap

- **Multi-Company SaaS Mode**: Tenant isolation for serving multiple organizations.
- **Semantic Search**: Vector-based candidate search ("Find candidates like John").
- **Automated Testing**: Integration with coding test platforms.
- **Voice Interview Bot**: AI agent for preliminary phone screens.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by HRFlow AI Team</sub>
</div>
