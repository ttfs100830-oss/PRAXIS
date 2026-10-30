export function FeaturedFlow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 290 62"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="12" y="9" width="43" height="43" rx="11" fill="#efe6d5" />
      <rect
        x="21"
        y="18"
        width="25"
        height="21"
        rx="3"
        fill="#faf6eb"
        stroke="#54725b"
        strokeWidth="1.4"
      />
      <path d="M21 24h25" stroke="#54725b" strokeWidth="1.2" />
      <circle cx="25" cy="21" r="1.2" fill="#bb5f3b" />
      <circle cx="29" cy="21" r="1.2" fill="#9caf8e" />
      <path
        d="M27 32h13M27 36h8"
        stroke="#9aab8e"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <path
        d="M65 30h13m0 0-3.5-3.5M78 30l-3.5 3.5"
        stroke="#a6b59a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="90" y="9" width="43" height="43" rx="11" fill="#e9eddd" />
      <path
        d="M101 33c1-5 5-8 10-7 2-5 9-5 11 0 5 0 7 3 7 7 0 4-3 6-7 6h-16c-3 0-5-2-5-6Z"
        fill="#faf6eb"
        stroke="#6d876f"
        strokeWidth="1.4"
      />

      <path
        d="M143 30h13m0 0-3.5-3.5M156 30l-3.5 3.5"
        stroke="#a6b59a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="168" y="9" width="43" height="43" rx="11" fill="#efe6d5" />
      <rect x="177" y="17" width="25" height="8" rx="3" fill="#4b6a52" />
      <rect x="177" y="27" width="25" height="8" rx="3" fill="#dbe5d1" />
      <rect x="177" y="37" width="25" height="7" rx="3" fill="#4b6a52" />
      <circle cx="181" cy="21" r="1.1" fill="#f4efe4" />
      <circle cx="181" cy="31" r="1.1" fill="#54725b" />
      <circle cx="181" cy="40" r="1.1" fill="#f4efe4" />

      <path
        d="M221 30h13m0 0-3.5-3.5M234 30l-3.5 3.5"
        stroke="#a6b59a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="246" y="9" width="43" height="43" rx="11" fill="#e9eddd" />
      <ellipse cx="267.5" cy="19" rx="10.5" ry="4" fill="#faf6eb" stroke="#54725b" strokeWidth="1.3" />
      <path
        d="M257 19v21c0 2.5 4.7 4.5 10.5 4.5s10.5-2 10.5-4.5V19"
        fill="#faf6eb"
        stroke="#54725b"
        strokeWidth="1.3"
      />
      <path d="M257 26c0 2.5 4.7 4.5 10.5 4.5s10.5-2 10.5-4.5M257 33c0 2.5 4.7 4.5 10.5 4.5s10.5-2 10.5-4.5" stroke="#54725b" strokeWidth="1.2" />
    </svg>
  );
}

export function PromoArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 220"
      fill="none"
      className={className}
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="promo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5ead6" stopOpacity="0.2" />
          <stop offset="1" stopColor="#eadcc1" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="340" height="220" fill="url(#promo-sky)" />
      <circle cx="272" cy="61" r="30" fill="#e2a475" opacity="0.9" />
      <circle cx="272" cy="61" r="40" fill="#edbf97" opacity="0.3" />
      <path
        d="M0 169c33-23 63-32 98-27 29 4 51 17 72 17 31 0 55-22 88-27 31-5 59 4 82 19v69H0v-51Z"
        fill="#c2d0b0"
      />
      <path
        d="M0 191c49-22 84-24 122-11 36 12 67 6 105-7 40-14 78-10 113 10v37H0v-29Z"
        fill="#9db38c"
      />
      <path
        d="M0 210c52-13 101-10 137-1 51 14 94-5 139-11 24-3 45-1 64 4v18H0v-10Z"
        fill="#5f7c5d"
      />
      <path
        d="M-6 219c33-25 75-38 119-33 35 4 63 18 99 15 35-3 64-19 95-21 14-1 25 1 35 5v23H-6Z"
        fill="#3e6049"
      />
      {/* winding path */}
      <path
        d="M146 220c24-29 38-55 43-81 4-19 15-33 33-43"
        stroke="#e6dcc8"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* trees */}
      <g fill="#4d6d50">
        <path d="M87 156l10-25 10 25h-20Z" />
        <path d="M84 166l13-31 13 31H84Z" opacity="0.85" />
        <rect x="94" y="164" width="5" height="14" rx="2" fill="#3d573f" />
        <path d="M112 145l7-17 7 17h-14Z" />
        <rect x="117" y="144" width="3.5" height="10" rx="1.5" fill="#3d573f" />
        <path d="M198 170l8-19 8 19h-16Z" opacity="0.9" />
      </g>
      {/* hiker */}
      <g>
        <circle cx="258" cy="135" r="5.4" fill="#e3b08d" />
        <path
          d="M254 141c5-2 10-1 13 3l4 17-7 2-3-8-4 9-7-2 4-12v-9Z"
          fill="#33503c"
        />
        <rect x="247" y="144" width="10" height="14" rx="4" fill="#bb6f4d" />
        <path
          d="M256 162l-3 17M265 162l5 16"
          stroke="#2f4a38"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M250 180h-7M270 180h7"
          stroke="#2f4a38"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M270 146l9 10"
          stroke="#e3b08d"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>
      {/* grasses */}
      <g stroke="#d8d0b9" strokeWidth="1.4" strokeLinecap="round" opacity="0.8">
        <path d="M31 202c3-9 7-14 13-17M39 204c1-8 3-14 7-19M180 194c2-7 5-12 10-15M187 195c0-6 2-11 5-15M307 188c3-8 7-13 13-16" />
      </g>
      <g stroke="#3d5a44" strokeWidth="1.3" strokeLinecap="round" opacity="0.6">
        <path d="M313 65c4-4 8-5 12-4M320 72c3-3 7-4 10-3" />
      </g>
    </svg>
  );
}
