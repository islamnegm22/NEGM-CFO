export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
        Temporary Product Name
      </h1>

      <p style={{ marginBottom: "24px", color: "#555" }}>
        Simple landing page. Name, logo, and copy will change later.
      </p>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
        onClick={() => (window.location.href = "/signup")}
          style={{
            padding: "10px 18px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Start Free Trial
        </button>

        <button
        onClick={() => (window.location.href = "/login")}
          style={{
            padding: "10px 18px",
            background: "#fff",
            color: "#000",
            border: "1px solid #000",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
