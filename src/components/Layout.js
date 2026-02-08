export default function Layout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}
