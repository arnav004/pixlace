import Resizer from "./components/Resizer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#fafaf8" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid #d4d4ce", background: "#ffffff",
        flexWrap: "wrap", gap: "8px"
      }}>
        <span style={{ fontSize: "clamp(16px, 4vw, 24px)", fontWeight: 500, letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif" }}>
          Pixl<span style={{ color: "#3a3a38" }}>Ace</span>
        </span>
        <span style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: "#4a4a48" }}>Exact dimensions. Exact file size. One step.</span>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "clamp(32px, 8vw, 64px) 20px clamp(24px, 6vw, 48px)" }}>
        <div style={{
          display: "inline-block", fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 500,
          color: "#3a3a38", letterSpacing: "0.06em", textTransform: "uppercase",
          border: "1px solid #c8c8c2", borderRadius: 20,
          padding: "4px 12px", marginBottom: "clamp(16px, 4vw, 24px)", background: "#ffffff"
        }}>
          No signup · No data stored · No nonsense
        </div>
        <h1 style={{
          fontSize: "clamp(26px, 7vw, 52px)", fontWeight: 300,
          letterSpacing: "-0.03em", lineHeight: 1.15,
          color: "#1a1a18", marginBottom: "clamp(16px, 4vw, 20px)", fontFamily: "'DM Sans', sans-serif"
        }}>
          Resize your photo to<br />
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>exact</em> dimensions &amp; file size
        </h1>
        <p style={{ fontSize: "clamp(15px, 4vw, 17px)", color: "#4a4a48", maxWidth: 460, margin: "0 auto clamp(32px, 6vw, 48px)", lineHeight: 1.6 }}>
          Set width, height, and target size all at once.
        </p>
      </div>

      {/* Tool */}
      <Resizer />

      {/* How it works */}
      <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px clamp(48px, 10vw, 80px)" }}>
        <div style={{ borderTop: "1px solid #d4d4ce", paddingTop: "clamp(32px, 8vw, 56px)" }}>
          <h2 style={{ fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "clamp(20px, 5vw, 32px)", color: "#1a1a18" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "clamp(16px, 4vw, 24px)" }}>
            {[
              { step: "01", title: "Upload", desc: "Drop your photo. JPG, PNG, or WEBP. Stays on your device." },
              { step: "02", title: "Set specs", desc: "Enter target width, height in pixels, and file size in KB." },
              { step: "03", title: "Download", desc: "Get your resized photo instantly. No watermarks, no account." },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", fontFamily: "'DM Mono', monospace", color: "#8a8a84", marginBottom: 8 }}>{step}</div>
                <div style={{ fontSize: "clamp(14px, 3.5vw, 15px)", fontWeight: 500, color: "#1a1a18", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: "clamp(13px, 3vw, 14px)", color: "#4a4a48", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px clamp(48px, 10vw, 80px)" }}>
        <div style={{ borderTop: "1px solid #d4d4ce", paddingTop: "clamp(32px, 8vw, 56px)" }}>
          <h2 style={{ fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "clamp(20px, 5vw, 32px)", color: "#1a1a18" }}>
            Common questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 5vw, 28px)" }}>
            {[
              {
                q: "Does my photo get uploaded to a server?",
                a: "No. Everything runs in your browser. Your photo never leaves your device, making it safe for sensitive documents like passport photos or ID scans.",
              },
              {
                q: "What if I can't hit the exact KB target?",
                a: "JPEG compression has limits, very aggressive targets may not be achievable without visible quality loss. PixlAce will get as close as possible and tell you the actual size.",
              },
              {
                q: "What photo formats are supported?",
                a: "You can upload JPG, PNG, and WEBP. The output is always a JPG, which is required by most government and job portals.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p style={{ fontSize: "clamp(14px, 3.5vw, 15px)", fontWeight: 500, color: "#1a1a18", marginBottom: 6 }}>{q}</p>
                <p style={{ fontSize: "clamp(13px, 3vw, 14px)", color: "#4a4a48", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #d4d4ce", padding: "20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#ffffff", flexWrap: "wrap", gap: 12, fontSize: "clamp(12px, 3vw, 13px)"
      }}>
        <span style={{ fontWeight: 500, color: "#1a1a18" }}>PixlAce</span>
        <span style={{ color: "#4a4a48" }}>
          Free forever · No account · No data stored
        </span>
      </footer>
    </main>
  );
}
