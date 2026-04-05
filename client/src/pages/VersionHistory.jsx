import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVersions } from '../api/project.api';
import ExportButton from '../components/design/ExportButton';
import { ArrowLeft, Clock } from 'lucide-react';

export default function VersionHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['versions', id],
    queryFn: () => getVersions(id).then((r) => r.data.data.versions),
  });

  if (isLoading) return <div className="p-8 text-gray-500 flex justify-center mt-20">Loading history...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[calc(100vh-64px)]">
      <button onClick={() => navigate(`/projects/${id}`)} className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={16} className="mr-1" /> Back to Design
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Version History</h1>
      
      {!data?.length ? (
        <div className="bg-white p-10 text-center rounded-2xl border border-dashed">
          <p className="text-gray-500">No versions found.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {data.map((ver, idx) => (
            <div key={ver._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-sm font-bold">v{ver.version}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border group-hover:shadow-md transition">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">Design Iteration {idx + 1}</h3>
                  {/* Per-version export — passes a non-null design sentinel to enable the button */}
                  <ExportButton
                    projectId={id}
                    design={ver}           /* ver is truthy — enough to enable the button */
                    version={ver.version}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2 flex items-center">
                  <Clock size={14} className="mr-1" /> {new Date(ver.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

