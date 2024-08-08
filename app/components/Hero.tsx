import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Generate a random image ID between 1 and 1000
    const randomId = Math.floor(Math.random() * 1000) + 1;
    setImageUrl(`https://picsum.photos/id/${randomId}/1920/1080`);
  }, []);

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
