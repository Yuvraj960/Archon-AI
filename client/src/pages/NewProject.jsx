import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/project.api';
import { generateQuestions, refineInput, generateDesign, generateDiagram } from '../api/ai.api';
import WizardStep1 from '../components/wizard/WizardStep1';
import WizardStep2 from '../components/wizard/WizardStep2';
import WizardStep3 from '../components/wizard/WizardStep3';

export default function NewProject() {
  const [step, setStep]               = useState(1);
  const [rawIdea, setRawIdea]         = useState('');
  const [questions, setQuestions]     = useState([]);
  const [answers, setAnswers]         = useState({});
  const [loading, setLoading]         = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError]             = useState('');
  const navigate = useNavigate();

  // ── Step 1 → Step 2: generate AI questions ──────────────────────────────────
  const handleStep1Submit = async (idea) => {
    setLoading(true);
    setLoadingText('Analyzing your idea & generating questions...');
    setError('');
    try {
      // Body: { rawIdea }  — projectId not needed yet
      const { data } = await generateQuestions({ rawIdea: idea });
      setRawIdea(idea);
      setQuestions(data.data.questions);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Unknown error';
      setError(`Failed to generate questions: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 → Step 3: save answers ──────────────────────────────────────────
  const handleStep2Submit = (answersMap) => {
    setAnswers(answersMap);
    setStep(3);
  };

  // ── Step 3: full generation pipeline ───────────────────────────────────────
  const handleFinalSubmit = async ({ title, description }) => {
    setLoading(true);
    setError('');
    try {
      // 1. Create project in DB
      setLoadingText('Creating project workspace...');
      const { data: projectData } = await createProject({ title, description });
      const projectId = projectData.data.project._id;

      // 2. Refine raw idea + answers → structured JSON spec
      //    Body: { projectId, rawIdea, answers }
      //    Response: { success, data: { refinedInput } }
      setLoadingText('Refining concepts using AI...');
      const { data: refined } = await refineInput({ rawIdea, answers, projectId });
      const refinedInput = refined.data.refinedInput;   // ← correct key

      // 3. Generate full design from the refined spec
      //    Body: { projectId, structuredInput }
      //    Response: { success, data: { design } }
      setLoadingText('Architecting the system design...');
      const { data: designResp } = await generateDesign({
        projectId,
        structuredInput: refinedInput,                  // ← send refinedInput as structuredInput
      });
      const design = designResp.data.design;

      // 4. Generate Mermaid diagram
      //    Body: { projectId, designId }
      setLoadingText('Generating architecture diagram...');
      await generateDiagram({
        projectId,
        designId: design._id,
      });

      navigate(`/projects/${projectId}`);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Unknown error';
      setError(`Generation failed: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
      {/* Progress bar */}
      <div className="flex items-center mb-10 space-x-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2.5 flex-1 rounded-full overflow-hidden relative ${step >= s ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {step >= s && (
              <div className={`absolute top-0 bottom-0 left-0 bg-blue-600 rounded-full ${step === s ? 'w-full animate-pulse' : 'w-full'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border">
        {step === 1 && <WizardStep1 onSubmit={handleStep1Submit} loading={loading} loadingText={loadingText} />}
        {step === 2 && <WizardStep2 questions={questions} onSubmit={handleStep2Submit} onBack={() => setStep(1)} />}
        {step === 3 && <WizardStep3 onSubmit={handleFinalSubmit} onBack={() => setStep(2)} loading={loading} loadingText={loadingText} />}
      </div>
    </div>
  );
}
