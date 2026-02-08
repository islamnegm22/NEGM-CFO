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

        <button style={linkBtn} onClick={() => router.push("/project/1")}>
          Projects
        </button>

        <button style={logoutBtn} onClick={() => router.push("/login")}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const nav = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 40px",
  borderBottom: "1px solid #eee",
  background: "white",
};

const logo = {
  fontWeight: "700",
  fontSize: "18px",
  cursor: "pointer",
};

const links = {
  display: "flex",
  gap: "16px",
};

const linkBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};

const logoutBtn = {
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};