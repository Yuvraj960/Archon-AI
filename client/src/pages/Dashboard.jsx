import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/project.api';
import { Plus, Trash2, Clock, FolderOpen } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects().then((r) => r.data.data.projects),
  });

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    refetch();
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center text-gray-400">Loading projects...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Projects</h1>
          <p className="text-gray-500 mt-1">Manage and view your generated architectures</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {(!data || data.length === 0) && (
        <div className="text-center py-24 bg-white border border-dashed rounded-3xl shadow-sm">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-1 mb-6">Create your first AI-generated architecture now.</p>
          <button
            onClick={() => navigate('/projects/new')}
            className="text-blue-600 font-medium hover:underline"
          >
            Create your first project →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/projects/${project._id}`)}
            className="group bg-white border rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-blue-200 transition relative"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-900 pr-8 leading-tight">{project.title}</h3>
              <button
                onClick={(e) => handleDelete(project._id, e)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition absolute top-4 right-4 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 h-10">{project.description || 'No description provided.'}</p>
            <div className="mt-6 flex items-center text-xs text-gray-400 font-medium tracking-wide">
              <Clock size={14} className="mr-1.5" />
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
