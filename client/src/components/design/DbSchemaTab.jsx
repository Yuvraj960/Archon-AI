import { Database, Table } from 'lucide-react';

export default function DbSchemaTab({ design }) {
  const schema = design.dbSchema || [];

  if (schema.length === 0) return <div className="p-8 text-center text-gray-400">No database schema defined.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schema.map((collection, i) => (
        <div key={i} className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:border-blue-200 transition">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b flex items-center gap-2">
            <Table size={16} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">{collection.name}</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Field</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {collection.fields?.map((field, j) => (
                  <tr key={j} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3">
                      <span className="font-medium text-gray-900">{field.name}</span>
                      {field.required && <span className="text-red-500 ml-1 text-xs" title="Required">*</span>}
                      {field.notes && <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{field.notes}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-mono text-xs border border-blue-100/50">
                        {typeof field.type === 'string' ? field.type : 'Mixed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
