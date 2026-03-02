export function SolarSystem() {
  return (
    <>
      <style>{`
        .solar-system-ol {
          all: unset;
          aspect-ratio: 1 / 1;
          container-type: inline-size;
          display: grid;
          width: 100%;
          max-width: min(100vw, 100vh);
          margin: auto;
        }

        .solar-system-ol li {
          aspect-ratio: 1 / 1;
          border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 50%;
          display: grid;
          grid-area: 1 / 1;
          place-self: center;
          width: var(--d, 2cqi);
          list-style: none;
        }

        .solar-system-ol li::after {
          animation: solar-rotate var(--t, 3s) linear infinite;
          aspect-ratio: 1 / 1;
          background: var(--b, hsl(0, 0%, 50%));
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
          content: '';
          display: block;
          offset-path: content-box;
          width: var(--w, 2cqi);
        }

        @keyframes solar-rotate {
          to { offset-distance: 100%; }
        }

        .solar-sun {
          --b: radial-gradient(circle, #f9d71c 0%, #f9a825 50%, #f9a825 100%);
          --d: 10cqi;
          --w: 8cqi;
          border: 0 !important;
        }
        .solar-sun::after {
          animation: none !important;
          offset-path: none !important;
          place-self: center;
          box-shadow: 0 0 40px 10px rgba(249,168,37,0.4), 0 0 80px 20px rgba(249,215,28,0.15) !important;
        }

        .solar-mercury {
          --b: radial-gradient(circle, #c2c2c2 0%, #8a8a8a 100%);
          --d: 15cqi;
          --t: 2105.26ms;
          --w: 2.0526cqi;
        }

        .solar-venus {
          --b: radial-gradient(circle, #f4d03f 0%, #c39c43 100%);
          --d: 25cqi;
          --t: 4210.53ms;
          --w: 2.6053cqi;
        }

        .solar-earth {
          --b: radial-gradient(circle, #3a82f7 0%, #2f9e44 80%, #1a5e20 100%);
          --d: 35cqi;
          --t: 6315.79ms;
          --w: 3.1579cqi;
        }

        .solar-mars {
          --b: radial-gradient(circle, #e57373 0%, #af4448 100%);
          --d: 45cqi;
          --t: 8421.05ms;
          --w: 3.7105cqi;
        }

        .solar-jupiter {
          --b: radial-gradient(circle, #d4a373 0%, #b36d32 50%, #f4e7d3 100%);
          --d: 60cqi;
          --t: 12631.58ms;
          --w: 4.8158cqi;
        }

        .solar-saturn {
          --b: radial-gradient(circle, #e6dba0 0%, #c2a13e 100%);
          --d: 75cqi;
          --t: 14736.84ms;
          --w: 5.3684cqi;
        }

        .solar-uranus {
          --b: radial-gradient(circle, #7de3f4 0%, #3ba0b5 100%);
          --d: 84.5cqi;
          --t: 10526.32ms;
          --w: 4.2632cqi;
        }

        .solar-neptune {
          --b: radial-gradient(circle, #4c6ef5 0%, #1b3b8c 100%);
          --d: 94cqi;
          --t: 20000ms;
          --w: 6cqi;
        }
      `}</style>
      <ol className="solar-system-ol">
        <li className="solar-sun"></li>
        <li className="solar-mercury"></li>
        <li className="solar-venus"></li>
        <li className="solar-earth"></li>
        <li className="solar-mars"></li>
        <li className="solar-jupiter"></li>
        <li className="solar-saturn"></li>
        <li className="solar-uranus"></li>
        <li className="solar-neptune"></li>
      </ol>
    </>
  );
}
