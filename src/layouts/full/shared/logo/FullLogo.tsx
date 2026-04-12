import { Link } from "react-router";

interface FullLogoProps {
  variant?: "light" | "dark";
}

const FullLogo = ({ variant = "dark" }: FullLogoProps) => {
  const isDark = variant === "dark";

  return (
    <Link to={"/"} className="flex items-center gap-2 group decoration-none">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-indigo-700 transition">
        <span className="text-white font-black text-xl italic">S</span>
      </div>
      <span
        className={`text-2xl font-black tracking-tight transition ${
          isDark
            ? "text-gray-900 group-hover:text-indigo-600"
            : "text-white group-hover:text-indigo-100"
        }`}
      >
        Shop
        <span
          className={
            isDark
              ? "text-indigo-600 group-hover:text-gray-900"
              : "text-indigo-300 group-hover:text-white"
          }
        >
          Starter
        </span>
      </span>
    </Link>
  );
};

export default FullLogo;
