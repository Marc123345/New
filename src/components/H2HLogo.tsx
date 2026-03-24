import React from "react";

const LOGO_WHITE = "https://ik.imagekit.io/qcvroy8xpd/h2h%20logo%20WHITE%20.png";
const LOGO_BLACK = "https://ik.imagekit.io/qcvroy8xpd/h2h%20logo%20black%20text.png";

interface H2HLogoProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onDark?: boolean;
}

export function H2HLogo({ height = 60, className, style, onDark = true }: H2HLogoProps) {
  return (
    <img
      src={onDark ? LOGO_WHITE : LOGO_BLACK}
      alt="H2H Social Logo"
      className={className}
      style={{ height, width: "auto", flexShrink: 0, objectFit: "contain", ...style }}
    />
  );
}
