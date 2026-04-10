// Avatar component — shows character SVG or initials fallback

const AVATAR_SVGS = {
  "kungfu-panda": (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <circle cx="50" cy="55" r="30" fill="#1a1a1a" />
      {/* Face */}
      <circle cx="50" cy="42" r="22" fill="white" />
      {/* Eye patches */}
      <ellipse cx="38" cy="40" rx="9" ry="8" fill="#1a1a1a" />
      <ellipse cx="62" cy="40" rx="9" ry="8" fill="#1a1a1a" />
      {/* Eyes */}
      <circle cx="38" cy="40" r="4" fill="white" />
      <circle cx="62" cy="40" r="4" fill="white" />
      <circle cx="39" cy="40" r="2" fill="#1a1a1a" />
      <circle cx="63" cy="40" r="2" fill="#1a1a1a" />
      {/* Nose */}
      <ellipse cx="50" cy="47" rx="4" ry="2.5" fill="#333" />
      {/* Mouth */}
      <path d="M44 52 Q50 57 56 52" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <circle cx="30" cy="24" r="8" fill="#1a1a1a" />
      <circle cx="70" cy="24" r="8" fill="#1a1a1a" />
      {/* Belt */}
      <rect x="35" y="72" width="30" height="6" rx="3" fill="#c8a000" />
    </svg>
  ),
  "monkey-king": (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Crown */}
      <rect x="28" y="12" width="44" height="10" rx="2" fill="#FFD700" />
      <rect x="32" y="7" width="8" height="8" rx="1" fill="#FFD700" />
      <rect x="46" y="5" width="8" height="10" rx="1" fill="#FFD700" />
      <rect x="60" y="7" width="8" height="8" rx="1" fill="#FFD700" />
      {/* Head */}
      <circle cx="50" cy="50" r="26" fill="#c8783c" />
      {/* Face patch */}
      <ellipse cx="50" cy="54" rx="16" ry="13" fill="#e8a878" />
      {/* Eyes */}
      <circle cx="40" cy="44" r="5" fill="white" />
      <circle cx="60" cy="44" r="5" fill="white" />
      <circle cx="41" cy="44" r="2.5" fill="#1a1a1a" />
      <circle cx="61" cy="44" r="2.5" fill="#1a1a1a" />
      <circle cx="42" cy="43" r="1" fill="white" />
      <circle cx="62" cy="43" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="52" rx="5" ry="3.5" fill="#b06030" />
      <circle cx="48" cy="51" r="1.5" fill="#8a4820" />
      <circle cx="52" cy="51" r="1.5" fill="#8a4820" />
      {/* Mouth */}
      <path d="M42 59 Q50 65 58 59" stroke="#8a4820" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <circle cx="26" cy="48" r="8" fill="#c8783c" />
      <circle cx="26" cy="48" r="5" fill="#e8a878" />
      <circle cx="74" cy="48" r="8" fill="#c8783c" />
      <circle cx="74" cy="48" r="5" fill="#e8a878" />
    </svg>
  ),
  "ninja-turtle": (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Shell back */}
      <circle cx="50" cy="58" r="28" fill="#5a8a3c" />
      {/* Shell pattern */}
      <ellipse cx="50" cy="58" rx="18" ry="16" fill="#7ab050" />
      <line x1="50" y1="42" x2="50" y2="74" stroke="#5a8a3c" strokeWidth="1.5" />
      <line x1="32" y1="58" x2="68" y2="58" stroke="#5a8a3c" strokeWidth="1.5" />
      <line x1="38" y1="46" x2="62" y2="70" stroke="#5a8a3c" strokeWidth="1" />
      <line x1="62" y1="46" x2="38" y2="70" stroke="#5a8a3c" strokeWidth="1" />
      {/* Head */}
      <circle cx="50" cy="36" r="20" fill="#7ab050" />
      {/* Mask - Donatello purple */}
      <rect x="28" y="32" width="44" height="10" rx="5" fill="#6a0dad" />
      <path d="M28 37 L18 32 L22 42 Z" fill="#6a0dad" />
      <path d="M72 37 L82 32 L78 42 Z" fill="#6a0dad" />
      {/* Eyes */}
      <circle cx="40" cy="36" r="5" fill="white" />
      <circle cx="60" cy="36" r="5" fill="white" />
      <circle cx="41" cy="36" r="2.5" fill="#1a1a1a" />
      <circle cx="61" cy="36" r="2.5" fill="#1a1a1a" />
      {/* Mouth */}
      <path d="M43 46 Q50 51 57 46" stroke="#4a7030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  "spiderman": (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Head/mask */}
      <circle cx="50" cy="50" r="32" fill="#cc0000" />
      {/* Web lines */}
      <line x1="50" y1="18" x2="50" y2="82" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.4" />
      <line x1="18" y1="50" x2="82" y2="50" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.4" />
      <line x1="27" y1="27" x2="73" y2="73" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.4" />
      <line x1="73" y1="27" x2="27" y2="73" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="50" cy="50" rx="15" ry="32" stroke="#1a1a1a" strokeWidth="0.8" fill="none" opacity="0.4" />
      <ellipse cx="50" cy="50" rx="25" ry="32" stroke="#1a1a1a" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* Eyes */}
      <ellipse cx="37" cy="43" rx="10" ry="7" fill="white" opacity="0.9" />
      <ellipse cx="63" cy="43" rx="10" ry="7" fill="white" opacity="0.9" />
      <ellipse cx="37" cy="43" rx="7" ry="5" fill="#1a1a1a" />
      <ellipse cx="63" cy="43" rx="7" ry="5" fill="#1a1a1a" />
      {/* Chin web */}
      <path d="M32 68 Q50 78 68 68" stroke="#1a1a1a" strokeWidth="0.8" fill="none" opacity="0.4" />
    </svg>
  ),
  "batman": (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Cape/shoulders */}
      <ellipse cx="50" cy="75" rx="35" ry="20" fill="#1a1a1a" />
      {/* Head */}
      <circle cx="50" cy="48" r="24" fill="#2a2a2a" />
      {/* Bat ears */}
      <polygon points="32,28 26,8 38,24" fill="#1a1a1a" />
      <polygon points="68,28 74,8 62,24" fill="#1a1a1a" />
      {/* Mask */}
      <ellipse cx="50" cy="46" rx="20" ry="14" fill="#1a1a1a" />
      {/* Eyes */}
      <ellipse cx="40" cy="42" rx="6" ry="4" fill="white" />
      <ellipse cx="60" cy="42" rx="6" ry="4" fill="white" />
      <ellipse cx="40" cy="42" rx="3.5" ry="2.5" fill="#1a1a1a" />
      <ellipse cx="60" cy="42" rx="3.5" ry="2.5" fill="#1a1a1a" />
      {/* Jaw */}
      <ellipse cx="50" cy="56" rx="12" ry="7" fill="#3a3a3a" />
      {/* Mouth */}
      <path d="M42 57 Q50 62 58 57" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Bat symbol */}
      <ellipse cx="50" cy="72" rx="10" ry="5" fill="#FFD700" />
      <polygon points="40,72 35,67 45,70" fill="#FFD700" />
      <polygon points="60,72 65,67 55,70" fill="#FFD700" />
    </svg>
  ),
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

const getInitialsColor = (username) => {
  if (!username) return AVATAR_COLORS[0];
  const index = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export default function Avatar({ avatar, username, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-2xl",
  };

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "??";

  const hasSVG = avatar && AVATAR_SVGS[avatar];

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0
      ${!hasSVG ? getInitialsColor(username) : "bg-secondary border border-border"}`}>
      {hasSVG ? (
        <div className="w-full h-full p-1">
          {AVATAR_SVGS[avatar]}
        </div>
      ) : (
        <span className="font-bold">{initials}</span>
      )}
    </div>
  );
}

export { AVATAR_SVGS };
