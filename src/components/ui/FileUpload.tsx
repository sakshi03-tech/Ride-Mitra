import React, { useRef, useState } from "react";
import { Upload, X, CheckCircle2, Image as ImageIcon, FileText } from "lucide-react";

interface FileUploadProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  value?: string | null;
  fileName?: string | null;
  onChange: (dataUrl: string, fileName: string) => void;
  onRemove?: () => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  sublabel,
  required = false,
  value,
  fileName,
  onChange,
  onRemove,
  accept = "image/*,application/pdf",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Calculate readable size
    const sizeInKb = (file.size / 1024).toFixed(0);
    setFileSize(`${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      onChange(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(0);
    setFileSize(`${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      onChange(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {sublabel && <span className="text-[10px] text-zinc-400 font-medium">{sublabel}</span>}
      </div>

      {/* Hidden Real Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* When file is selected/uploaded: Show thumbnail & remove button */}
      {value ? (
        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-500/50 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            {value.startsWith("data:image") ? (
              <img
                src={value}
                alt="Uploaded preview"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">
                  {fileName || "दस्तऐवज जोडले"}
                </p>
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {fileSize ? `आकार: ${fileSize} • ` : ""}अपलोड पूर्ण ✓
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300"
            >
              बदला
            </button>
            <button
              type="button"
              onClick={() => {
                if (onRemove) onRemove();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200"
              title="काढून टाका"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone Button */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full p-4 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer ${
            dragOver
              ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 hover:border-orange-400 hover:bg-orange-50/30"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 flex items-center justify-center mb-1.5 shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            येथे क्लिक करून फोटो किंवा फाईल निवडा
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Camera Photo / JPG / PNG / PDF (कमाल 5 MB)
          </p>
        </button>
      )}
    </div>
  );
};
