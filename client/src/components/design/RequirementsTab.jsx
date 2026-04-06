import { CheckCircle2 } from 'lucide-react';

export default function RequirementsTab({ design }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Section title="Functional Requirements" items={design.requirements?.functional} icon="text-blue-500" />
      <Section title="Non-Functional Requirements" items={design.requirements?.nonFunctional} icon="text-purple-500" />
    </div>
  );
}

function Section({ title, items = [], icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-50">{title}</h3>
      {(!items || items.length === 0) ? (
        <p className="text-sm text-gray-400 italic">No requirements specified.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed group">
              <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${icon} opacity-80 group-hover:opacity-100 transition`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
