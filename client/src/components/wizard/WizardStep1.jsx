import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function WizardStep1({ onSubmit, loading, loadingText }) {
  const [idea, setIdea] = useState('');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you want to build?</h2>
      <p className="text-gray-500 mb-8 border-b pb-6">Describe your product idea in 1-3 sentences. The AI will analyze your concept and ask a few clarifying questions.</p>
      
      <div className="relative">
        <textarea
          rows={6}
          className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none text-gray-800 placeholder:text-gray-400 leading-relaxed shadow-inner"
          placeholder="e.g. I want to build a food delivery app where restaurants can list their menu and customers can order and track delivery in real time. We need separate driver apps and an admin dashboard."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={loading}
        />
        <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
          {idea.length} chars
        </div>
      </div>

      <button
        onClick={() => onSubmit(idea)}
        disabled={idea.trim().length < 10 || loading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-500/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> {loadingText}
          </>
        ) : 'Continue →'}
      </button>
    </div>
  );
}
