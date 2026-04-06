import { Layers, Component, Cpu } from 'lucide-react';

export default function ArchitectureTab({ design }) {
  const arch = design.architecture || {};
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2 opacity-80">
          <Layers size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">System Pattern</h3>
        </div>
        <p className="text-3xl font-bold mb-4">{arch.pattern || 'Standard Pattern'}</p>
        <p className="text-blue-100 leading-relaxed max-w-3xl">{arch.rationale || 'No rationale provided for this architecture choice.'}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <Component size={18} className="text-indigo-500" />
          <h3 className="font-bold text-lg">Core Components</h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {arch.components?.length ? arch.components.map((c, i) => (
            <span key={i} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm">
              {c}
            </span>
          )) : <span className="text-gray-400 text-sm italic">No components documented</span>}
        </div>
      </div>

      {arch.techStack && Object.keys(arch.techStack).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 text-gray-800">
            <Cpu size={18} className="text-teal-500" />
            <h3 className="font-bold text-lg">Recommended Tech Stack</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(arch.techStack).map(([key, val]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{key}</p>
                <p className="text-base font-semibold text-gray-800">{String(val)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
