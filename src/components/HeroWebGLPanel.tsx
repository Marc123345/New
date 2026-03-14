import UnicornScene from "unicornstudio-react";

export function HeroWebGLPanel() {
  return (
    <div className="w-full h-full">
      <UnicornScene
        projectId="zePXIpCcN69AcXLL5Mvg"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.4/dist/unicornStudio.umd.js"
      />
    </div>
  );
}