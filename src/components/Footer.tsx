import Link from "next/link";

export default function Footer() {
  return (
    <footer className="page-shell" id="story">
      <Link className="brand" href="/">
        MORROW<span>.</span>
      </Link>
      <p>Better tools for your daily ritual.</p>
      <p>© 2026 Morrow Coffee</p>
    </footer>
  );
}
