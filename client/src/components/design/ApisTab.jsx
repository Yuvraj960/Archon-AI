import { Tag } from 'lucide-react';

export default function ApisTab({ design }) {
  const apis = design.apis || [];

  const getMethodColor = (method) => {
    switch(method?.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-700 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PUT': case 'PATCH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (apis.length === 0) {
    return <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed">No API schemas generated.</div>;
  }

  return (
    <div className="space-y-4">
      {apis.map((api, i) => (
        <div key={i} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
          <div className="px-6 py-4 border-b bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 font-mono text-xs font-bold rounded-lg border ${getMethodColor(api.method)}`}>
                {api.method?.toUpperCase()}
              </span>
              <span className="font-mono font-semibold text-gray-800">{api.path}</span>
            </div>
            {api.description && (
              <p className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border hidden md:block">
                {api.description}
              </p>
            )}
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-6 bg-white">
            {api.description && <p className="text-sm text-gray-600 md:hidden col-span-full">{api.description}</p>}
            
            {(api.requestBody || api.requestParameters) && (
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto text-sm shadow-inner relative group">
                <span className="absolute top-0 right-0 bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-xl font-mono uppercase tracking-widest">Request</span>
                <pre className="text-green-400 font-mono mt-3">
                  {JSON.stringify(api.requestBody || api.requestParameters, null, 2)}
                </pre>
              </div>
            )}
            
            {api.response && (
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto text-sm shadow-inner relative group">
                <span className="absolute top-0 right-0 bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-xl font-mono uppercase tracking-widest">Response</span>
                <pre className="text-blue-300 font-mono mt-3">
                  {JSON.stringify(api.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
