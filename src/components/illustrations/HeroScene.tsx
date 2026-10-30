export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 270"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-peach" cx="50%" cy="45%" r="58%">
          <stop offset="0" stopColor="#f6e7d1" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f6e7d1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="laptop-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c4b38" />
          <stop offset="1" stopColor="#1d3a2c" />
        </linearGradient>
        <linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#456b50" />
          <stop offset="1" stopColor="#35563f" />
        </linearGradient>
      </defs>

      {/* Soft background shapes */}
      <circle cx="336" cy="96" r="98" fill="url(#hero-peach)" />
      <circle cx="474" cy="58" r="34" fill="#f1e2ca" opacity="0.55" />
      <circle cx="250" cy="48" r="21" fill="#eef0dc" opacity="0.9" />
      <circle cx="527" cy="154" r="22" fill="#e7ecd6" opacity="0.7" />
      <path
        d="M258 246c-14-58 26-104 78-104 48 0 84 36 80 92-53-9-110-3-158 12Z"
        fill="#eef0dd"
        opacity="0.8"
      />

      {/* Left botanical arrangement */}
      <g opacity="0.95">
        <path
          d="M128 270c14-58 34-103 72-139"
          stroke="#7c9270"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M199 131c-3-30 8-51 32-64 5 28-6 49-32 64Z"
          fill="#8ea382"
        />
        <path
          d="M182 159c-31-1-51-14-59-40 30-2 50 12 59 40Z"
          fill="#c3d0b5"
        />
        <path
          d="M164 181c-30 2-51-7-62-29 29-5 51 4 62 29Z"
          fill="#9caf8e"
        />
        <path
          d="M148 222c-22-11-33-28-32-51 23 7 35 25 32 51Z"
          fill="#b3c3a5"
        />
        <path
          d="M230 103c-4-26 3-45 22-58 6 24-1 44-22 58Z"
          fill="#d2ddc7"
        />
        <path
          d="M141 253c-23 1-40-7-49-27 22-3 39 6 49 27Z"
          fill="#9fb392"
        />
      </g>

      {/* Right botanical arrangement */}
      <g opacity="0.9">
        <path
          d="M529 270c-1-61-4-119-22-177"
          stroke="#8ea382"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M512 161c19-17 37-20 56-10-16 16-35 20-56 10Z"
          fill="#a9bb9b"
        />
        <path
          d="M508 200c21-12 39-11 56 3-19 12-38 11-56-3Z"
          fill="#c8d4bc"
        />
        <path
          d="M518 115c8-22 22-34 43-36-6 21-20 33-43 36Z"
          fill="#93a986"
        />
        <path
          d="M526 239c-17-4-28-14-32-31 18 0 30 10 32 31Z"
          fill="#b6c6a9"
        />
      </g>

      {/* Connection lines */}
      <g stroke="#a9b99e" strokeWidth="1.5" strokeLinecap="round">
        <path d="M288 155c20 18 33 25 52 26" />
        <path d="M360 88v18" />
        <path d="M451 119c-3 19-11 31-26 40" />
        <path d="M451 212c-19 8-34 9-52 3" />
        <path d="M254 138H228" />
        <path d="M389 72c20-8 42-8 66 1" opacity="0.65" />
      </g>
      <g fill="#b9c8ad">
        <circle cx="288" cy="155" r="3.4" />
        <circle cx="452" cy="212" r="3.4" />
        <circle cx="362" cy="108" r="3" />
        <circle cx="454" cy="164" r="3.2" />
        <circle cx="254" cy="138" r="2.6" />
      </g>

      {/* Server node */}
      <g>
        <rect
          x="228"
          y="112"
          width="62"
          height="58"
          rx="17"
          fill="#fbf8ef"
          stroke="#e1d8c6"
        />
        <rect x="240" y="124" width="38" height="10" rx="4" fill="#3f624b" />
        <rect x="240" y="138" width="38" height="10" rx="4" fill="#5c7b63" />
        <rect x="240" y="152" width="38" height="10" rx="4" fill="#3f624b" />
        <circle cx="246" cy="129" r="1.5" fill="#dce6d5" />
        <circle cx="246" cy="143" r="1.5" fill="#dce6d5" />
        <circle cx="246" cy="157" r="1.5" fill="#dce6d5" />
      </g>

      {/* Browser node */}
      <g>
        <rect
          x="329"
          y="32"
          width="55"
          height="51"
          rx="16"
          fill="#fbf8ef"
          stroke="#e1d8c6"
        />
        <rect
          x="339"
          y="43"
          width="35"
          height="27"
          rx="5"
          fill="#f1ead9"
          stroke="#5b7963"
          strokeWidth="1.6"
        />
        <path d="M339 51h35" stroke="#5b7963" strokeWidth="1.6" />
        <circle cx="344" cy="47" r="1.4" fill="#bb5f3b" />
        <circle cx="349" cy="47" r="1.4" fill="#9caf8e" />
        <path
          d="M345 61h14M345 66h9"
          stroke="#8da083"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>

      {/* Gear node */}
      <g>
        <circle cx="486" cy="103" r="28" fill="#3d6049" />
        <g
          transform="translate(471 88) scale(1.25)"
          stroke="#f3eee0"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </g>
      </g>

      {/* Code node */}
      <g transform="translate(-20 0)">
        <rect
          x="479"
          y="192"
          width="57"
          height="52"
          rx="16"
          fill="#fbf8ef"
          stroke="#e1d8c6"
        />
        <path
          d="M494 210l-7 8 7 8M521 210l7 8-7 8"
          stroke="#3f624b"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M512 206l-5 25"
          stroke="#bb5f3b"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </g>

      {/* Floating specks */}
      <g fill="#c9ab82" opacity="0.75">
        <circle cx="311" cy="83" r="2.3" />
        <circle cx="427" cy="73" r="2" />
        <circle cx="521" cy="186" r="2.4" />
        <circle cx="219" cy="191" r="2" />
        <circle cx="543" cy="76" r="2.7" fill="#bb8663" />
      </g>
      <g stroke="#b8c7ac" strokeWidth="1.4" strokeLinecap="round" opacity="0.8">
        <path d="M225 87c5-6 12-8 19-6M300 190c4-5 10-7 16-5M505 157c4-4 9-5 13-3" />
      </g>

      {/* Person */}
      <g transform="translate(10 16) scale(0.88)">
        {/* Hood */}
        <path
          d="M340 201c1-23 13-41 30-49 7-3 13-4 20-4 23 0 43 15 50 42l-14 19c-17-15-54-16-72 0l-14-8Z"
          fill="#2f4c39"
        />
        {/* Torso */}
        <path
          d="M323 270c3-46 21-76 55-80h20c35 4 52 34 56 80H323Z"
          fill="url(#hoodie)"
        />
        {/* Hoodie pocket */}
        <path
          d="M363 248c13-6 31-6 44 0l-4 22h-36l-4-22Z"
          fill="#2e4c39"
          opacity="0.75"
        />
        <path
          d="M371 198c3 14 2 28-3 40M408 198c-3 14-2 28 3 40"
          stroke="#76907a"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Neck */}
        <path d="M376 172h28v22h-28z" fill="#d9a17e" />
        {/* Face */}
        <ellipse cx="390" cy="146" rx="26" ry="29" fill="#e9b693" />
        <ellipse cx="364" cy="150" rx="4" ry="6" fill="#e2ab88" />
        <ellipse cx="416" cy="150" rx="4" ry="6" fill="#e2ab88" />
        {/* Hair */}
        <path
          d="M362 148c-4-25 7-41 28-42 22-1 34 15 31 41-3-11-7-18-15-22-3 6-12 9-25 10-9 .6-15 4-19 13Z"
          fill="#2c2e26"
        />
        <path
          d="M365 128c8-12 24-17 47-12 5 2 9 5 12 9-13-6-36-5-59 3Z"
          fill="#3a3a30"
        />
        {/* Brows, eyes, nose, smile */}
        <path
          d="M375 143c3-2 6-2 9-1M397 142c3-1 6-1 9 1"
          stroke="#3e382e"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="379.5" cy="148" r="1.8" fill="#2a2b24" />
        <circle cx="401" cy="148" r="1.8" fill="#2a2b24" />
        <path
          d="M389 151c-1 4-1 6 1 7"
          stroke="#c88d6d"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M382 162c5 4 11 4 16 0"
          stroke="#a9634f"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Arms and hands */}
        <path
          d="M338 213c-12 15-17 32-13 50M444 211c12 15 16 31 12 48"
          stroke="#34533d"
          strokeWidth="21"
          strokeLinecap="round"
        />
        <ellipse cx="350" cy="228" rx="10" ry="7" fill="#e5b08e" />
        <ellipse cx="432" cy="226" rx="10" ry="7" fill="#e5b08e" />
        {/* Laptop */}
        <path
          d="M348 218l94-6 34 56-128 8 0-58Z"
          fill="url(#laptop-lid)"
        />
        <path
          d="M348 218l94-6 3 5-93 7-1 51-4 3-1-60Z"
          fill="#54735a"
          opacity="0.55"
        />
        <path
          d="M404 246c6-5 13-5 19-1-4 7-10 9-19 5-9 4-15 2-19-5 6-4 13-4 19 1Z"
          fill="#c9d4bd"
          opacity="0.8"
        />
        <path
          d="M346 271l130-8"
          stroke="#6d8871"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Foreground foliage */}
      <g opacity="0.85">
        <path
          d="M263 271c16-15 34-22 52-21-9 15-26 22-52 21Z"
          fill="#93a986"
        />
        <path
          d="M532 269c-15-11-29-14-43-9 10 12 24 15 43 9Z"
          fill="#b3c4a6"
        />
        <path
          d="M504 259c2-17 10-29 24-36 3 16-5 28-24 36Z"
          fill="#849a79"
        />
      </g>
    </svg>
  );
}
