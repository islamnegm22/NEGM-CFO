import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords not matching");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        fullName,
        email,
        password,
      })
    );

    router.push("/dashboard");
  }

  return (
    <div style={container}>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Full Name"
          style={inputStyle}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" style={buttonStyle}>
          Create Account
        </button>
      </form>

      <p style={{ marginTop: 15 }}>
        Already have account?{" "}
        <a href="/login" style={{ fontWeight: "600" }}>
          Login
        </a>
      </p>
    </div>
  );
}

const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "100px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  width: "280px",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const buttonStyle = {
  width: "300px",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};