"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Download, X, ImageIcon, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ImageInfo {
  width: number;
  height: number;
  sizeKB: number;
  dataUrl: string;
}

interface OutputInfo extends ImageInfo {
  blob: Blob;
  withinTarget: boolean;
}

export default function Resizer() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [output, setOutput] = useState<OutputInfo | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const [targetW, setTargetW] = useState(200);
  const [targetH, setTargetH] = useState(230);
  const [targetKB, setTargetKB] = useState(45);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const origImgRef = useRef<HTMLImageElement | null>(null);
  const workCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    workCanvasRef.current = document.createElement("canvas");
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setOutput(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        origImgRef.current = img;
        setOriginal({
          width: img.width,
          height: img.height,
          sizeKB: parseFloat((file.size / 1024).toFixed(1)),
          dataUrl: e.target?.result as string,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
    new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));

  const compressToTarget = async (canvas: HTMLCanvasElement, targetBytes: number): Promise<Blob> => {
    let lo = 0.01, hi = 1.0, best: Blob | null = null;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      const blob = await canvasToBlob(canvas, mid);
      if (blob.size <= targetBytes) { best = blob; lo = mid; }
      else hi = mid;
      if (hi - lo < 0.003) break;
    }
    return best ?? await canvasToBlob(canvas, 0.01);
  };

  const process = useCallback(async () => {
    if (!origImgRef.current || !workCanvasRef.current) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 50));

    const img = origImgRef.current;
    const canvas = workCanvasRef.current;
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);

    const scale = Math.max(targetW / img.width, targetH / img.height);
    const sw = targetW / scale, sh = targetH / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

    const targetBytes = targetKB * 1024;
    const blob = await compressToTarget(canvas, targetBytes);
    const actualKB = parseFloat((blob.size / 1024).toFixed(1));
    const withinTarget = Math.abs(blob.size - targetBytes) / targetBytes < 0.1;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    setOutput({ width: targetW, height: targetH, sizeKB: actualKB, dataUrl, blob, withinTarget });
    setProcessing(false);
  }, [targetW, targetH, targetKB]);

  const download = () => {
    if (!output) return;
    const url = URL.createObjectURL(output.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pixlace_${targetW}x${targetH}.jpg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const reset = () => {
    setOriginal(null);
    setOutput(null);
    setFileName("");
    origImgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 80px" }}>

      {!original ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `1.5px dashed ${dragging ? "#1a1a18" : "#8a8a84"}`,
            borderRadius: 16,
            padding: "72px 32px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "#f5f5f3" : "#ffffff",
            transition: "all 0.15s ease",
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#fafaf8", border: "1px solid #d4d4ce",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <Upload size={20} color="#4a4a48" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: "#1a1a18", marginBottom: 6 }}>Drop your photo here</p>
          <p style={{ fontSize: 14, color: "#4a4a48" }}>or click to browse - JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div style={{ background: "#ffffff", border: "1px solid #d4d4ce", borderRadius: 16, overflow: "hidden" }}>

          {/* File bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderBottom: "1px solid #d4d4ce", background: "#fafaf8"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ImageIcon size={14} color="#4a4a48" />
              <span style={{ fontSize: 13, color: "#4a4a48", fontFamily: "'DM Mono', monospace" }}>
                {fileName || "photo.jpg"}
              </span>
              <span style={{
                fontSize: 11, color: "#4a4a48", background: "#ffffff",
                border: "1px solid #d4d4ce", borderRadius: 4, padding: "2px 7px"
              }}>
                {original.width}×{original.height}px · {original.sizeKB} KB
              </span>
            </div>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a4a48", display: "flex", padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          {/* Settings */}
          <div style={{ padding: "28px 24px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#4a4a48", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Target specifications
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Width (px)", value: targetW, setter: setTargetW },
                { label: "Height (px)", value: targetH, setter: setTargetH },
                { label: "File size (KB)", value: targetKB, setter: setTargetKB },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: 12, color: "#4a4a48", marginBottom: 6 }}>{label}</label>
                  <input
                    type="number"
                    value={value}
                    min={1}
                    onChange={(e) => setter(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1px solid #d4d4ce", borderRadius: 10,
                      fontSize: 15, fontFamily: "'DM Mono', monospace",
                      background: "#fafaf8", color: "#1a1a18", outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={process}
              disabled={processing}
              style={{
                marginTop: 20, width: "100%", padding: "13px 24px",
                background: processing ? "#4a4a48" : "#1a1a18",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                cursor: processing ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.15s",
              }}
            >
              {processing
                ? <><RefreshCw size={15} className="spin" /> Processing…</>
                : "Resize image"
              }
            </button>
          </div>

          {/* Output preview */}
          {output && (
            <div style={{ borderTop: "1px solid #d4d4ce", padding: "24px" }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>

                <div>
                  <p style={{ fontSize: 11, color: "#4a4a48", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</p>
                  <div style={{
                    border: "1px solid #d4d4ce", borderRadius: 10,
                    width: 120, height: 120, overflow: "hidden",
                    background: "#f5f5f3", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img src={original.dataUrl} alt="original" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#4a4a48", marginTop: 8, fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                    {original.width}×{original.height}px<br />{original.sizeKB} KB
                  </p>
                </div>

                <div style={{ color: "#8a8a84", fontSize: 18 }}>→</div>

                <div>
                  <p style={{ fontSize: 11, color: "#4a4a48", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>After</p>
                  <div style={{
                    border: "1px solid #d4d4ce", borderRadius: 10,
                    width: 120, height: 120, overflow: "hidden",
                    background: "#f5f5f3", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img src={output.dataUrl} alt="output" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#4a4a48", marginTop: 8, fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                    {output.width}×{output.height}px<br />{output.sizeKB} KB
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 12px", borderRadius: 8, marginBottom: 14,
                    background: output.withinTarget ? "#f0f7f4" : "#fffbeb",
                    color: output.withinTarget ? "#2d6a4f" : "#92400e",
                    fontSize: 13,
                  }}>
                    {output.withinTarget
                      ? <><CheckCircle size={14} /> Within target</>
                      : <><AlertCircle size={14} /> Best: {output.sizeKB} KB</>
                    }
                  </div>

                  <button
                    onClick={download}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 16px", width: "100%",
                      background: "#ffffff", border: "1px solid #d0d0ca",
                      borderRadius: 10, fontSize: 14, fontWeight: 500,
                      cursor: "pointer", color: "#1a1a18",
                    }}
                  >
                    <Download size={15} /> Download photo
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginTop: 8, width: "100%", background: "none", border: "none",
                      fontSize: 13, color: "#4a4a48", cursor: "pointer", padding: "6px 0",
                    }}
                  >
                    Use a different photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
      />

      <style>{`
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        input:focus { border-color: #1a1a18 !important; box-shadow: 0 0 0 3px rgba(26,26,24,0.07); }
      `}</style>
    </div>
  );
}
