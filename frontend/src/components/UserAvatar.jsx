import { useState } from "react";

const COLORS = [
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function UserAvatar({ username, profilePicture, size = "md" }) {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  const color = COLORS[(username?.charCodeAt(0) ?? 0) % COLORS.length];
  const initial = username?.[0]?.toUpperCase() || "?";

  if (profilePicture && !imgFailed) {
    return (
      <img
        src={profilePicture}
        alt={username}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full ${color} text-white font-bold flex items-center justify-center shrink-0 uppercase`}
    >
      {initial}
    </div>
  );
}

export default UserAvatar;
