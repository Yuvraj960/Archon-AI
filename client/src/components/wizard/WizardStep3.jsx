import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function WizardStep3({ onSubmit, onBack, loading, loadingText }) {
  const [form, setForm] = useState({ title: '', description: '' });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalize your project</h2>
      <p className="text-gray-500 mb-8 border-b pb-6">Give your project a name. We'll generate the full system design after this.</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g. SwiftEats Logistics Core"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition text-lg font-medium"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (optional)</label>
          <textarea
            rows={3}
            placeholder="Internal notes about this variation..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition text-gray-700"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-10 pt-6 border-t">
        <button onClick={onBack} disabled={loading} className="flex-1 border bg-white py-3.5 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">← Back</button>
        <button
          onClick={() => onSubmit(form)}
          disabled={!form.title.trim() || loading}
          className="flex-[2] flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/30"
        >
          {loading ? (
             <><Loader2 size={18} className="animate-spin" /> {loadingText}</>
          ) : '🚀 Auto-Architect System Design'}
        </button>
      </div>
    </div>
  );
}
