import { Link } from "@remix-run/react";

export default function Hero() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundColor: "#3498db", // Replace with your desired color
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome to My Tech Blog</h1>
          <p className="mb-5">
            Exploring technology, sharing insights, and showcasing projects.
          </p>

          <Link to={`/posts`} className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
