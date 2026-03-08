import UnicornScene from "unicornstudio-react";

export function HeroWebGLPanel() {
  return (
    <div className="w-full" style={{ aspectRatio: '16 / 9' }}>
      <UnicornScene
        projectId="rTavRi8ICyCAMqrEM68u"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
      />
    </div>
  );
}
