import React, { useState } from "react";

interface GridItem {
  title: string;
  category: string;
  visual?: React.ReactNode;
}

interface GridGalleryProps {
  items: GridItem[];
  columns?: 2 | 3 | 4;
  onItemClick?: (index: number) => void;
}

export type { GridItem };

export function GridGallery({
  items,
  columns = 3,
  onItemClick,
}: GridGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="group cursor-pointer border-3 border-[var(--color-text-dark)] bg-[var(--color-background-light)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 overflow-hidden"
          style={{
            boxShadow:
              hoveredIndex === index
                ? "10px 10px 0 var(--color-primary)"
                : "5px 5px 0 var(--color-surface-dark)",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onClick={() => onItemClick?.(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="aspect-[4/3] bg-[var(--color-primary)] flex items-center justify-center overflow-hidden relative">
            {item.visual ? (
              item.visual
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full p-8 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[var(--color-text-dark)] transition-transform duration-300 group-hover:scale-110"
                      style={{
                        transitionDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[var(--color-background-light)]">
            <p
              className="text-xs uppercase tracking-wider opacity-60 mb-2"
              style={{ fontFamily: "var(--font-stack-heading)" }}
            >
              {item.category}
            </p>
            <h4
              className="text-sm text-[var(--color-text-dark)] leading-tight"
              style={{ fontFamily: "var(--font-stack-heading)" }}
            >
              {item.title}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}
