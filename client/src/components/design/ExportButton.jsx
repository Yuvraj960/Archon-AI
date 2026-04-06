import { useState, useRef, useEffect } from 'react';
import { Download, FileJson, FileText, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { exportDesign } from '../../api/project.api';

/**
 * ExportButton — dropdown with JSON and Markdown export options.
 *
 * Props:
 *   projectId {string}       — MongoDB project _id
 *   design    {object|null}  — the current design document (used to guard the button)
 *   version   {number|null}  — if null, exports the latest version
 */
export default function ExportButton({ projectId, design, version = null }) {
  const [open,   setOpen]   = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [errMsg, setErrMsg] = useState('');
  const dropdownRef         = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset "done" badge after 2.5 s
  useEffect(() => {
    if (status === 'done') {
      const t = setTimeout(() => setStatus('idle'), 2500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleExport = async (format) => {
    setOpen(false);
    setStatus('loading');
    setErrMsg('');
    try {
      await exportDesign(projectId, format, version);
      setStatus('done');
    } catch (err) {
      setErrMsg(err.message || 'Export failed');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  const isDisabled = !design || status === 'loading';

  // ─── Button icon / label ────────────────────────────────────────────────────
  const BtnIcon = () => {
    if (status === 'loading') return <Loader2 size={16} className="animate-spin" />;
    if (status === 'done')    return <CheckCircle2 size={16} className="text-green-400" />;
    return <Download size={16} />;
  };

  const label = status === 'loading' ? 'Exporting…'
              : status === 'done'    ? 'Downloaded!'
              : 'Export';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        id="export-btn"
        disabled={isDisabled}
        onClick={() => !isDisabled && setOpen((v) => !v)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          border transition-all duration-200 shadow-sm select-none
          ${isDisabled
            ? 'opacity-50 cursor-not-allowed bg-white border-gray-200 text-gray-400'
            : status === 'done'
              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
          }
        `}
        title={!design ? 'Generate a design first' : 'Export design'}
      >
        <BtnIcon />
        <span>{label}</span>
        {status === 'idle' && (
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Error toast */}
      {status === 'error' && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl shadow-md whitespace-nowrap z-50">
          ⚠ {errMsg}
        </div>
      )}

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute top-full mt-2 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 min-w-[190px] overflow-hidden
                     animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-50">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Download as
            </p>
          </div>

          {/* JSON option */}
          <button
            id="export-json-btn"
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors">
              <FileJson size={15} />
            </span>
            <span className="font-medium">JSON</span>
            <span className="ml-auto text-[11px] text-gray-400 font-mono">.json</span>
          </button>

          {/* Markdown option */}
          <button
            id="export-md-btn"
            onClick={() => handleExport('md')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
              <FileText size={15} />
            </span>
            <span className="font-medium">Markdown</span>
            <span className="ml-auto text-[11px] text-gray-400 font-mono">.md</span>
          </button>

          {/* Info footer */}
          <div className="px-4 py-2 border-t border-gray-50 mt-1">
            <p className="text-[11px] text-gray-400 leading-tight">
              Exports the{' '}
              {version ? `v${version}` : 'latest'}{' '}
              design with requirements, APIs, DB schema &amp; diagram.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
