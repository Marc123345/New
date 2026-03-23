import React from "react";

const LOGO_URL = "https://ik.imagekit.io/qcvroy8xpd/H2H%20PROFILE%20PICTURE%20WHITE%20LINKED%20IN.png?updatedAt=1771427661733";

interface H2HLogoProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function H2HLogo({ height = 60, className, style }: H2HLogoProps) {
  return (
    <img
      src={LOGO_URL}
      alt="H2H Social Logo"
      className={className}
      style={{ height, width: "auto", flexShrink: 0, objectFit: "contain", ...style }}
    />
  );
}
