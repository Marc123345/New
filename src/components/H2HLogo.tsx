import React from "react";
import logoSrc from "../assets/h2h_logo_transparent_(1).svg";

interface H2HLogoProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function H2HLogo({ height = 60, className, style }: H2HLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="H2H Digital Logo"
      className={className}
      style={{ height, width: "auto", flexShrink: 0, objectFit: "contain", ...style }}
    />
  );
}
