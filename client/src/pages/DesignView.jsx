import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../api/project.api';
import RequirementsTab from '../components/design/RequirementsTab';
import ArchitectureTab from '../components/design/ArchitectureTab';
import ApisTab         from '../components/design/ApisTab';
import DbSchemaTab     from '../components/design/DbSchemaTab';
import DiagramTab      from '../components/design/DiagramTab';
import ChatPanel       from '../components/design/ChatPanel';
import ExportButton    from '../components/design/ExportButton';
import { ArrowLeft, Edit3, History, LayoutTemplate } from 'lucide-react';

const TABS = ['Requirements', 'Architecture', 'APIs', 'DB Schema', 'Diagram'];

export default function DesignView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Requirements');
  const [chatOpen, setChatOpen]   = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id).then((r) => r.data.data),
  });

  if (isLoading) return <div className="min-h-screen flex justify-center items-center text-gray-400">Loading design workspace...</div>;

  const design = data?.latestDesign;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)] flex flex-col relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-3 transition">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
            <LayoutTemplate size={28} className="text-blue-600 mr-3" />
            {data?.project?.title}
          </h1>
          {data?.project?.description && (
             <p className="text-gray-500 mt-2 max-w-2xl">{data.project.description}</p>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate(`/projects/${id}/versions`)}
            className="flex items-center bg-white border px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
          >
            <History size={16} className="mr-2" />
            Versions
          </button>

          {/* Export dropdown — disabled until a design exists */}
          <ExportButton projectId={id} design={design} />

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-500/20"
          >
            <Edit3 size={16} className="mr-2" />
            Refine with AI
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-8 overflow-x-auto pb-px">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50 rounded-t-lg'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gray-50/50 rounded-b-3xl">
        {!design ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
              <LayoutTemplate size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No design components yet</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">Click 'Refine with AI' to generate the first version of your architecture.</p>
          </div>
        ) : (
          <div className="pb-12">
            {activeTab === 'Requirements' && <RequirementsTab design={design} />}
            {activeTab === 'Architecture'  && <ArchitectureTab design={design} />}
            {activeTab === 'APIs'          && <ApisTab design={design} />}
            {activeTab === 'DB Schema'     && <DbSchemaTab design={design} />}
            {activeTab === 'Diagram'       && <DiagramTab design={design} />}
          </div>
        )}
      </div>

      {/* Chat Panel slide-over */}
      <ChatPanel
        isOpen={chatOpen}
        projectId={id}
        design={design}
        onClose={() => setChatOpen(false)}
        onUpdate={refetch}
      />
    </div>
  );
}
