import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <div style={nav}>
      <div style={logo} onClick={() => router.push("/dashboard")}>
        Negm Pro
      </div>

      <div style={links}>
        <button style={linkBtn} onClick={() => router.push("/dashboard")}>
          Dashboard
        </button>

        <button style={logoutBtn} onClick={() => router.push("/login")}>
          Logout
        </button>
      </div>
    </div>
  );
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 24px",
  borderBottom: "1px solid #eee",
  background: "#fff",
};

const logo = {
  fontWeight: "600",
  fontSize: "18px",
  cursor: "pointer",
};

const links = {
  display: "flex",
  gap: "12px",
};

const linkBtn = {
  padding: "8px 14px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  background: "#fff",
  cursor: "pointer",
};

const logoutBtn = {
  padding: "8px 14px",
  border: "1px solid #ff4d4f",
  borderRadius: "8px",
  background: "#fff",
  color: "#ff4d4f",
  cursor: "pointer",
};