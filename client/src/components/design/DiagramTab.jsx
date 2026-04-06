import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2, Maximize2 } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#eff6ff', // blue-50
    primaryTextColor: '#1e3a8a', // blue-900
    primaryBorderColor: '#93c5fd', // blue-300
    lineColor: '#6b7280', // gray-500
    secondaryColor: '#f8fafc', // slate-50
    tertiaryColor: '#f1f5f9'
  },
  flowchart: { curve: 'basis' },
  securityLevel: 'loose',
});

export default function DiagramTab({ design }) {
  const containerRef = useRef(null);
  const code = design.diagram || '';
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const renderDiagram = async () => {
      if (!code || !containerRef.current) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(false);
        // Clear previous render
        containerRef.current.innerHTML = '';
        
        // Generate random ID for mermaid
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderDiagram();
    
    return () => { isMounted = false; };
  }, [code]);

  if (!code) {
    return <div className="p-12 text-center text-gray-400 bg-white border border-dashed rounded-3xl">No diagram generated for this design yet.</div>;
  }

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm overflow-hidden relative min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 tracking-tight">System Architecture Diagram</h3>
        <button className="text-gray-400 hover:text-blue-600 transition px-3 py-1.5 bg-gray-50 rounded-lg text-sm flex items-center gap-2 font-medium">
          <Maximize2 size={14} /> Fullscreen
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-b-3xl">
          <Loader2 className="animate-spin text-blue-500 mr-2" size={24} /> Rendering diagram...
        </div>
      )}
      
      {error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
          <p className="font-semibold mb-2">Failed to render diagram.</p>
          <p className="text-sm opacity-80 mb-4">The AI generated invalid Mermaid.js syntax.</p>
          <pre className="text-left text-xs bg-black/5 p-4 rounded-xl overflow-x-auto text-gray-700">{code}</pre>
        </div>
      ) : (
        <div className="w-full flex justify-center bg-gray-50/50 rounded-2xl p-4 border border-gray-50 overflow-auto cursor-grab active:cursor-grabbing">
          <div ref={containerRef} className="mermaid transition-opacity duration-500 p-4" />
        </div>
      )}
      
      {!error && !loading && (
        <details className="mt-8 group cursor-pointer border rounded-2xl overflow-hidden bg-gray-50">
          <summary className="px-5 py-4 font-medium text-sm text-gray-600 select-none group-open:border-b hover:text-gray-900 transition">
            View Mermaid Source Code
          </summary>
          <div className="p-5 font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed bg-white">
            {code}
          </div>
        </details>
      )}
    </div>
  );
}
