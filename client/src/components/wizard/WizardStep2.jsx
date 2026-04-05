import { useState } from 'react';

export default function WizardStep2({ questions, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({});

  const handleSubmit = () => {
    const allAnswered = questions.every((q) => answers[q.id]?.trim());
    if (!allAnswered) return alert('Please answer all questions to get the best architecture.');
    onSubmit(answers);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Refine the requirements</h2>
      <p className="text-gray-500 mb-8 border-b pb-6">Answer these contextual questions so the AI can tailor the system design to your specific needs.</p>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="relative transition-all group">
            <label className="flex items-start text-[15px] font-semibold text-gray-800 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs mr-3 mt-0.5">{idx + 1}</span>
              {q.question}
            </label>
            <div className="pl-9">
              {q.suggestions?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {q.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setAnswers({ ...answers, [q.id]: s })}
                      className={`px-4 py-1.5 text-sm rounded-full border transition font-medium ${
                        answers[q.id] === s ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm' : 'text-gray-600 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                placeholder="Type your own answer or custom detail..."
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-10 pt-6 border-t">
        <button onClick={onBack} className="flex-1 border bg-white py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">← Back</button>
        <button onClick={handleSubmit} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-500/20">Review & Name Project →</button>
      </div>
    </div>
  );
}
