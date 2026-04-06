import { useState } from 'react';
import { updateDesign } from '../../api/ai.api';
import { X, Send, Loader2, Sparkles } from 'lucide-react';

export default function ChatPanel({ isOpen, onClose, projectId, design, onUpdate }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    try {
      await updateDesign({
        projectId,
        designId: design._id,
        instruction: prompt
      });
      setPrompt('');
      onUpdate(); // refresh design data
      onClose();  // close chat
    } catch (err) {
      setError('Failed to update design. Try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l">
        <div className="flex justify-between items-center p-5 border-b bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-500" size={18} />
            <h3 className="font-bold text-gray-900">Refine with AI</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col justify-center text-center">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-sm mb-6 border border-blue-100">
               <strong>Current Version:</strong> {design?.version || 1}
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Want to make changes?</h4>
            <p className="text-gray-500 mb-4">Describe what you want to modify in the architecture. The AI will generate a whole new version of your design.</p>
            <div className="text-left bg-gray-50 border rounded-2xl p-4 text-sm text-gray-600 space-y-2 relative shadow-inner">
               <span className="absolute -top-3 left-4 bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-bold text-gray-400 uppercase tracking-widest">Examples</span>
               <p className="border-b pb-2 cursor-pointer hover:text-blue-600 transition" onClick={() => setPrompt("Switch the database from MongoDB to PostgreSQL and update schemas.")}>"Switch database to Postgres..."</p>
               <p className="border-b pb-2 cursor-pointer hover:text-blue-600 transition" onClick={() => setPrompt("Add a Redis caching layer for the main API endpoints.")}>"Add a Redis caching layer..."</p>
               <p className="cursor-pointer hover:text-blue-600 transition" onClick={() => setPrompt("Make this a microservices system instead of a monolith.")}>"Change to Microservices..."</p>
            </div>
        </div>

        <div className="p-5 border-t bg-white">
          {error && <p className="text-red-500 text-sm mb-3 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm shadow-inner transition"
              rows={3}
              placeholder="e.g. Add a Stripe webhook endpoint to the APIs..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="w-full bg-blue-600 text-white rounded-xl py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-500/20 flex justify-center items-center gap-2"
            >
              {loading ? (
                 <><Loader2 size={18} className="animate-spin" /> Updating Design...</>
              ) : (
                 <><Send size={16} className="-ml-1" /> Send to AI</>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
