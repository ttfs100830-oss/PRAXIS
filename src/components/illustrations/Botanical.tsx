interface ArtProps {
  className?: string;
}

export function LogoMark({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 42V18"
        stroke="#D9E2D0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M23.8 31C16 31.2 9.7 26.8 7.5 19.2c7.6-1 14.1 3.4 16.3 11.8Z"
        fill="#9BAF8E"
      />
      <path
        d="M24.2 24.2c.8-7.7 6.3-12.8 14-13.6-.2 7.8-5.7 12.9-14 13.6Z"
        fill="#D7E0CA"
      />
      <path
        d="M23.6 16.6c-4.4-1-7.7-4.4-8.7-9.6 4.9-.1 8.4 3.3 8.7 9.6Z"
        fill="#C3D2B6"
      />
      <path
        d="M24.4 12.2c3.2-2.5 7.2-3 11.2-1.7-2.4 3.9-6.3 5.2-11.2 1.7Z"
        fill="#8FA383"
      />
    </svg>
  );
}

export function LeafSprig({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 120 190"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M86 186C84 139 75 96 48 52"
        stroke="#7E9573"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M47 52C39 37 39 22 47 8c11 11 13 26 0 44Z"
        fill="#91A784"
      />
      <path
        d="M55 81c-2-18 5-31 21-39 3 17-4 30-21 39Z"
        fill="#B7C6A9"
      />
      <path
        d="M66 116c-10-13-10-27 0-41 11 13 11 27 0 41Z"
        fill="#8FA483"
      />
      <path
        d="M46 66c-16-2-27-11-33-27 16-1 28 8 33 27Z"
        fill="#C3D0B5"
      />
      <path
        d="M64 107c-16-4-25-15-27-31 16 1 25 12 27 31Z"
        fill="#A7B99B"
      />
      <path
        d="M79 150c8-15 20-22 36-22-7 16-19 24-36 22Z"
        fill="#8CA181"
      />
      <path
        d="M74 173c-13-1-22-8-27-21 14 0 23 7 27 21Z"
        fill="#B9C8AC"
      />
    </svg>
  );
}

export function SprigCorner({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 104c40-5 68-24 92-58"
        stroke="#A3B696"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M55 67C43 66 34 59 29 47c12-1 21 6 26 20Z"
        fill="#B9C8AC"
      />
      <path
        d="M78 41c-2-13 4-23 16-29 2 12-4 22-16 29Z"
        fill="#94A987"
      />
      <path
        d="M97 25c7-10 17-14 29-11-5 10-15 15-29 11Z"
        fill="#C9D5BD"
      />
      <path
        d="M40 84c-12 0-21-5-27-16 12-1 21 4 27 16Z"
        fill="#A3B696"
      />
      <path
        d="M122 13c9-6 18-6 27 0-8 7-17 8-27 0Z"
        fill="#AFC0A2"
      />
    </svg>
  );
}

export function Avatar({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-label="Illustrated profile portrait of Koushik"
    >
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="40" cy="40" r="40" />
        </clipPath>
        <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7dfcb" />
          <stop offset="1" stopColor="#cfd9c4" />
        </linearGradient>
      </defs>
      <g clipPath="url(#avatar-clip)">
        <rect width="80" height="80" fill="url(#avatar-bg)" />
        <circle cx="63" cy="18" r="22" fill="#f2e9d9" opacity="0.55" />
        <path
          d="M8 82c1-18 13-28 32-28s31 10 32 28H8Z"
          fill="#3e5d47"
        />
        <path
          d="M32 50h16l2 12H30l2-12Z"
          fill="#d9a17f"
        />
        <ellipse cx="40" cy="38" rx="15.5" ry="18" fill="#e8b492" />
        <path
          d="M24 36c0-13 7-20 17-20 11 0 17 8 17 20-4-2-7-5-9-10-4 5-12 7-25 10Z"
          fill="#2f3028"
        />
        <path
          d="M25 34c-1 5 0 10 2 14-5-2-6-9-2-14ZM55 34c1 5 0 10-2 14 5-2 6-9 2-14Z"
          fill="#2f3028"
        />
        <path
          d="M27 48c2 8 7 13 13 13s11-5 13-13c-3 6-7 9-13 9s-10-3-13-9Z"
          fill="#413d33"
        />
        <path
          d="M30 39c1.5-1 3-1 4.5 0M45.5 39c1.5-1 3-1 4.5 0"
          stroke="#413a2f"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="33" cy="42" r="1.3" fill="#2b2b24" />
        <circle cx="47" cy="42" r="1.3" fill="#2b2b24" />
        <path
          d="M36 48c2.5 1.5 5.5 1.5 8 0"
          stroke="#b8735a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M27 74c4-6 8-8 13-8s9 2 13 8"
          fill="#33503c"
        />
      </g>
      <circle
        cx="40"
        cy="40"
        r="39"
        stroke="#e9dfcb"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
