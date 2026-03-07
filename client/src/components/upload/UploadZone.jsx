import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function UploadZone({ label, required, accept, multiple, file, onChange }) {
  const inputRef = useRef();

  const hasFile = multiple ? file?.length > 0 : !!file;

  const handleChange = (e) => {
    const selected = multiple
      ? Array.from(e.target.files)
      : e.target.files[0] || null;
    onChange(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = multiple
      ? Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf")
      : e.dataTransfer.files[0] || null;
    onChange(dropped);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
    inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg px-4 py-4 cursor-pointer transition-colors
        ${hasFile
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${hasFile ? "bg-blue-100" : "bg-slate-100"}`}>
          {hasFile ? (
            <FileText size={18} className="text-blue-600" />
          ) : (
            <Upload size={18} className="text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {hasFile
              ? multiple
                ? `${file.length} file(s) selected`
                : file.name
              : `Click or drag PDF${multiple ? "(s)" : ""} here`}
          </p>
        </div>
        {hasFile && (
          <button onClick={clear} className="text-slate-400 hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}