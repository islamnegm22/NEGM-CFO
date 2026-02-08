import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();

const inputStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const primaryButton = {
  width: "100%",
  maxWidth: "420px",
  padding: "12px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

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
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
        Create Account
      </h1>

<input
  type="text"
  placeholder="Full Name"
  style={inputStyle}
/>

      <input
        type="email"
        placeholder="Email"
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        style={inputStyle}
      />

      <button
  type="button"
  style={primaryButton}
  onClick={() => router.push("/dashboard")}
>
  Create Account
</button>

      <p style={{ marginTop: "16px", fontSize: "14px" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#000", fontWeight: "600" }}>
          Login
        </a>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "280px",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const primaryButton = {
  width: "280px",
  padding: "10px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
