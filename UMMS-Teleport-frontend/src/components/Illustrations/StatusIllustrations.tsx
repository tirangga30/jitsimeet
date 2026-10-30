import React from "react";

export const UnableToJoinIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Soft clouds & leaves in background */}
      <ellipse cx="40" cy="95" rx="28" ry="12" fill="#EBF6F8" />
      <ellipse cx="200" cy="85" rx="30" ry="14" fill="#EBF6F8" />
      <circle cx="48" cy="120" r="14" fill="#D6F2EE" opacity="0.6" />
      <circle cx="192" cy="115" r="16" fill="#D6F2EE" opacity="0.6" />

      {/* Sparkles / rays */}
      <path d="M120 18V26" stroke="#9CE2DE" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 24L105 31" stroke="#9CE2DE" strokeWidth="3" strokeLinecap="round" />
      <path d="M140 24L135 31" stroke="#9CE2DE" strokeWidth="3" strokeLinecap="round" />

      {/* Browser window */}
      <rect
        x="35"
        y="35"
        width="170"
        height="125"
        rx="10"
        fill="#FFFFFF"
        stroke="#DCE6F0"
        strokeWidth="2"
        filter="drop-shadow(0px 8px 24px rgba(16, 27, 75, 0.08))"
      />
      {/* Window header bar */}
      <path
        d="M36 45C36 39.4772 40.4772 35 46 35H194C199.523 35 204 39.4772 204 45V50H36V45Z"
        fill="#BDE8E4"
      />
      {/* Window dots */}
      <circle cx="47" cy="42.5" r="3" fill="#FFFFFF" />
      <circle cx="56" cy="42.5" r="3" fill="#FFFFFF" />
      <circle cx="65" cy="42.5" r="3" fill="#FFFFFF" />

      {/* Triangle Warning Shield */}
      <path
        d="M120 65L158 130H82L120 65Z"
        fill="#F87171"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Exclamation Mark */}
      <rect x="117.5" y="82" width="5" height="24" rx="2.5" fill="#FFFFFF" />
      <circle cx="120" cy="116" r="3" fill="#FFFFFF" />
    </svg>
  );
};

export const Doc404Illustration: React.FC<{ size?: number }> = ({ size = 180 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Soft circular background shadow */}
      <ellipse cx="100" cy="175" rx="60" ry="10" fill="#E2F4F7" />

      {/* Leaves / shoots on side */}
      <path
        d="M48 160C45 130 65 110 65 110C65 110 68 135 55 162"
        fill="#BDE8E4"
        opacity="0.8"
      />
      <path
        d="M152 160C155 130 135 110 135 110C135 110 132 135 145 162"
        fill="#BDE8E4"
        opacity="0.8"
      />

      {/* Sparkles / burst */}
      <path d="M142 54L150 48" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M154 62L162 60" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M148 74L156 78" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />

      {/* Document page with folded corner */}
      <path
        d="M60 55C60 46.7157 66.7157 40 75 40H118L145 67V150C145 158.284 138.284 165 130 165H75C66.7157 165 60 158.284 60 150V55Z"
        fill="#FFFFFF"
        stroke="#009F95"
        strokeWidth="3.5"
        strokeLinejoin="round"
        filter="drop-shadow(0px 8px 24px rgba(0, 159, 149, 0.12))"
      />
      {/* Folded corner */}
      <path
        d="M118 40V64C118 65.6569 119.343 67 121 67H145"
        fill="#E7F8F8"
        stroke="#009F95"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 404 Text */}
      <text
        x="102"
        y="125"
        textAnchor="middle"
        fontFamily="'Inter', -apple-system, sans-serif"
        fontSize="28"
        fontWeight="800"
        fill="#009F95"
        letterSpacing="2"
      >
        404
      </text>
    </svg>
  );
};

export const PatientNotFoundIllustration: React.FC<{ size?: number }> = ({ size = 180 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Background soft shadow */}
      <ellipse cx="100" cy="175" rx="60" ry="10" fill="#E2F4F7" />

      {/* Leaves on sides */}
      <path
        d="M45 155C42 128 62 110 62 110C62 110 65 132 52 157"
        fill="#BDE8E4"
        opacity="0.8"
      />
      <path
        d="M155 155C158 128 138 110 138 110C138 110 135 132 148 157"
        fill="#BDE8E4"
        opacity="0.8"
      />

      {/* Sparkles */}
      <path d="M144 52L152 46" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M156 60L164 58" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 72L158 76" stroke="#009F95" strokeWidth="2.5" strokeLinecap="round" />

      {/* Soft circular badge */}
      <circle
        cx="100"
        cy="95"
        r="54"
        fill="#E0F5F3"
        stroke="#BEEAE5"
        strokeWidth="2"
        filter="drop-shadow(0px 8px 24px rgba(0, 159, 149, 0.1))"
      />

      {/* Patient silhouette */}
      <circle cx="100" cy="80" r="16" fill="#4FB3A9" />
      <path
        d="M78 120C78 107.85 87.85 98 100 98C112.15 98 122 107.85 122 120V122H78V120Z"
        fill="#4FB3A9"
      />

      {/* Magnifying Glass */}
      <circle
        cx="124"
        cy="114"
        r="14"
        fill="#FFFFFF"
        stroke="#007F78"
        strokeWidth="3.5"
      />
      <path
        d="M134 124L148 138"
        stroke="#007F78"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
