import type { ReactNode } from "react";
import type { PathArtKey } from "../../types";

interface PathArtProps {
  variant: PathArtKey;
  className?: string;
}

export function PathArt({ variant, className }: PathArtProps) {
  switch (variant) {
    case "architecture":
      return <ArchitectureArt className={className} />;
    case "environment":
      return <EnvironmentArt className={className} />;
    case "git":
      return <GitArt className={className} />;
    case "network":
      return <NetworkArt className={className} />;
  }
}

function ArtFrame({
  children,
  className,
  blob = "#f1e8d8",
}: {
  children: ReactNode;
  className?: string;
  blob?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 112"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 74C6 45 24 20 54 14c28-6 66-5 84 18 18 23 8 52-17 65-26 13-91 17-107-23Z"
        fill={blob}
      />
      <circle cx="135" cy="24" r="14" fill="#f6ead8" opacity="0.8" />
      <circle cx="27" cy="25" r="9" fill="#e8edd9" opacity="0.9" />
      {children}
    </svg>
  );
}

function ArchitectureArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className}>
      {/* Monitor */}
      <rect
        x="22"
        y="36"
        width="49"
        height="35"
        rx="5"
        fill="#fbf8f0"
        stroke="#53705a"
        strokeWidth="1.6"
      />
      <path d="M22 45h49" stroke="#53705a" strokeWidth="1.3" />
      <circle cx="28" cy="41" r="1.4" fill="#bb5f3b" />
      <circle cx="33" cy="41" r="1.4" fill="#a9b99a" />
      <path
        d="M31 62c4-5 7 2 11-4 4-5 7 2 12-4 3-4 6-3 9-6"
        stroke="#8b9f80"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="31" y="64" width="9" height="2" rx="1" fill="#ced9c4" />
      <path d="M44 71v5" stroke="#53705a" strokeWidth="1.6" />
      <path
        d="M38 77h15"
        stroke="#53705a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Server stack */}
      <rect
        x="96"
        y="34"
        width="33"
        height="30"
        rx="5"
        fill="#3f6149"
      />
      <rect x="101" y="39" width="23" height="6" rx="3" fill="#6f8a74" />
      <rect x="101" y="48" width="23" height="6" rx="3" fill="#dfe7d7" />
      <rect x="101" y="57" width="23" height="4" rx="2" fill="#6f8a74" />
      <circle cx="105" cy="42" r="1.2" fill="#e8eee1" />
      <circle cx="105" cy="51" r="1.2" fill="#54705a" />
      {/* Cloud node */}
      <path
        d="M107 25c1-5 5-8 10-7 2-4 8-4 10 0 4 0 6 3 6 6 0 3-3 5-6 5h-16c-3 0-4-2-4-4Z"
        fill="#fbf8f0"
        stroke="#8ba082"
        strokeWidth="1.3"
      />
      {/* Database cylinder */}
      <g>
        <ellipse cx="112" cy="84" rx="13" ry="5" fill="#d9e3ce" stroke="#53705a" strokeWidth="1.4" />
        <path d="M99 84v13c0 3 6 5 13 5s13-2 13-5V84" fill="#eaf0e2" stroke="#53705a" strokeWidth="1.4" />
        <path d="M99 91c0 3 6 5 13 5s13-2 13-5" stroke="#53705a" strokeWidth="1.2" />
      </g>
      {/* Connectors */}
      <g stroke="#a4b596" strokeWidth="1.3" strokeLinecap="round">
        <path d="M71 47c8-7 14-9 21-9" />
        <path d="M112 64v12" />
      </g>
      <path
        d="M89 34l4 4 4-4"
        stroke="#a4b596"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M112 78l-3-4M112 78l3-4"
        stroke="#a4b596"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Foliage */}
      <path
        d="M134 94c2-12 8-20 18-24 2 11-4 19-18 24Z"
        fill="#a9bb9b"
      />
      <path
        d="M142 106c-8-2-13-7-15-15 8 0 13 5 15 15Z"
        fill="#c4d1b7"
      />
    </ArtFrame>
  );
}

function EnvironmentArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className} blob="#f0e6d6">
      {/* Laptop */}
      <rect
        x="38"
        y="23"
        width="70"
        height="45"
        rx="6"
        fill="#294635"
      />
      <rect
        x="43"
        y="28"
        width="60"
        height="35"
        rx="3"
        fill="#3a5b44"
      />
      <path d="M35 70h76l8 13H27l8-13Z" fill="#34533e" />
      <path d="M32 74h82l4 7H28l4-7Z" fill="#46664d" />
      <path
        d="M53 40l6 5-6 5M69 52h9"
        stroke="#dfe8d7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="88" y="60" width="8" height="3" rx="1.5" fill="#9db394" opacity="0.7" />
      {/* Plant */}
      <path
        d="M124 79c3-17 10-28 23-35"
        stroke="#7f9475"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M137 56c-2-13 3-22 14-27 2 11-3 20-14 27Z"
        fill="#8ea382"
      />
      <path
        d="M129 67c-12-1-19-7-22-18 11-1 19 5 22 18Z"
        fill="#b6c6a8"
      />
      <path
        d="M124 79h19l-3 16h-13l-3-16Z"
        fill="#c47a58"
      />
      <path d="M122 79h23" stroke="#a75f43" strokeWidth="2" strokeLinecap="round" />
      {/* Sparkles */}
      <g stroke="#b0c0a3" strokeWidth="1.4" strokeLinecap="round">
        <path d="M28 55c-4-2-7-5-8-9" />
        <path d="M26 62c-5 0-9 2-12 5" />
      </g>
      <circle cx="122" cy="22" r="3" fill="#dfe7d7" />
      <circle cx="29" cy="34" r="2.5" fill="#edc9a9" opacity="0.9" />
    </ArtFrame>
  );
}

function GitArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className} blob="#f3e5d8">
      <g stroke="#c17857" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M46 72c0-20 14-31 33-31 22 0 30-6 39-17" />
        <path d="M79 41c8 8 10 17 10 26" />
      </g>
      <g>
        <circle cx="46" cy="72" r="8" fill="#fbf8f0" stroke="#c17857" strokeWidth="2.4" />
        <circle cx="46" cy="72" r="3" fill="#c17857" />
        <circle cx="79" cy="41" r="10" fill="#c17857" />
        <circle cx="79" cy="41" r="4" fill="#f6efe4" />
        <circle cx="118" cy="24" r="8" fill="#fbf8f0" stroke="#c17857" strokeWidth="2.4" />
        <circle cx="118" cy="24" r="3" fill="#c17857" />
        <circle cx="89" cy="80" r="8" fill="#fbf8f0" stroke="#c17857" strokeWidth="2.4" />
        <circle cx="89" cy="80" r="3" fill="#c17857" />
      </g>
      <path
        d="M89 67v5"
        stroke="#c17857"
        strokeWidth="1.6"
        strokeDasharray="2 3"
      />
      <path
        d="M127 76c4-15 12-24 24-28 1 13-6 23-24 28Z"
        fill="#b5c5a7"
      />
      <path
        d="M151 93c-10 0-17-4-21-13 10-2 17 2 21 13Z"
        fill="#94a988"
      />
      <g fill="#d8b18e">
        <circle cx="34" cy="33" r="2" />
        <circle cx="100" cy="19" r="2.4" />
        <circle cx="55" cy="26" r="1.6" />
      </g>
    </ArtFrame>
  );
}

function NetworkArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className} blob="#ecebdc">
      {/* Globe */}
      <circle cx="56" cy="52" r="29" fill="#fbf8ef" stroke="#55745e" strokeWidth="1.6" />
      <ellipse cx="56" cy="52" rx="13" ry="29" stroke="#91a586" strokeWidth="1.2" />
      <path d="M27 52h58M33 36c12 7 34 7 46 0M33 68c12-7 34-7 46 0" stroke="#91a586" strokeWidth="1.2" />
      <path
        d="M31 42c15 4 35 2 48-7M31 62c15-4 35-2 48 7"
        stroke="#b4c3a8"
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Network nodes */}
      <g stroke="#a9b99e" strokeWidth="1.2" strokeDasharray="2.5 3">
        <path d="M83 35c10-6 17-9 26-9" />
        <path d="M82 63c9 5 15 8 22 10" />
        <path d="M56 81v13" />
      </g>
      <circle cx="116" cy="26" r="3.2" fill="#8fa483" />
      <circle cx="109" cy="75" r="3.2" fill="#bb8663" />
      <circle cx="56" cy="98" r="3.2" fill="#6f8a74" />
      {/* Cloud / terminal */}
      <path
        d="M100 30c1-6 6-9 11-8 2-5 9-5 12 0 4 0 7 3 7 7 0 4-3 7-7 7h-18c-3 0-5-2-5-6Z"
        fill="#fbf8f0"
        stroke="#8ba082"
        strokeWidth="1.3"
      />
      <path
        d="M110 27l-4 4 4 4M121 27l4 4-4 4"
        stroke="#54725b"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leaves */}
      <path
        d="M134 96c1-12 7-21 18-26 2 12-4 21-18 26Z"
        fill="#a4b797"
      />
      <path
        d="M142 108c-8-1-13-6-15-14 8 0 13 5 15 14Z"
        fill="#c4d1b7"
      />
      <g fill="#d8b08c">
        <circle cx="24" cy="24" r="2.3" />
        <circle cx="137" cy="16" r="2" />
      </g>
    </ArtFrame>
  );
}
