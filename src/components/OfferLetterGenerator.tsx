import { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from './ui/button';

interface OfferLetterProps {
  candidateName: string;
  jobRole: string;
  startDate: string;
  salary: string;
  companyName?: string;
  hrName?: string;
}

export function OfferLetterGenerator({ 
  candidateName, 
  jobRole, 
  startDate, 
  salary, 
  companyName = "HRFlow Tech Inc.", 
  hrName = "Sarah Connor" 
}: OfferLetterProps) {
  const letterRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = letterRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore event listeners
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 overflow-auto max-h-[600px]">
        <div ref={letterRef} className="max-w-2xl mx-auto font-serif text-gray-900 leading-relaxed p-8 bg-white">
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyName}</h1>
            <p className="text-gray-500 text-sm">123 Innovation Drive, Tech City, TC 94043</p>
          </div>

          <p className="mb-6">{new Date().toLocaleDateString()}</p>

          <p className="mb-6">
            <strong>Dear {candidateName},</strong>
          </p>

          <p className="mb-4">
            We are pleased to offer you the position of <strong>{jobRole}</strong> at {companyName}. 
            We were impressed with your background and skills, and we are confident that you will make a significant contribution to our team.
          </p>

          <p className="mb-4">
            This position is scheduled to begin on <strong>{new Date(startDate).toLocaleDateString()}</strong>. 
            You will be reporting to the Engineering Manager.
          </p>

          <p className="mb-4">
            <strong>Compensation Package:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Annual Base Salary: <strong>${Number(salary).toLocaleString()}</strong></li>
            <li>Performance Bonus: Up to 15% of base salary</li>
            <li>Stock Options: 5,000 RSUs vesting over 4 years</li>
            <li>Comprehensive Health, Dental, and Vision Insurance</li>
            <li>Unlimited Paid Time Off</li>
          </ul>

          <p className="mb-6">
            We are excited about the possibility of you joining us and look forward to a mutually beneficial working relationship. 
            Please sign and return this letter by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} to indicate your acceptance of this offer.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="h-16 mb-2 border-b border-black"></div>
              <p>{hrName}</p>
              <p className="text-sm text-gray-500">Head of People</p>
            </div>
            <div>
              <div className="h-16 mb-2 border-b border-black"></div>
              <p>{candidateName}</p>
              <p className="text-sm text-gray-500">Candidate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
