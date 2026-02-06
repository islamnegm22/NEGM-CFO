export default function Signup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "320px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
          Create account
        </h1>

        <input
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
