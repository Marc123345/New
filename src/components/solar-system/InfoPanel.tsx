interface InfoPanelProps {
  planet: string
  onClose: () => void
}

const info: Record<string, string> = {
  Mercury: "Mercury is the closest planet to the Sun and has extreme temperatures.",
  Venus: "Venus has a thick atmosphere that traps heat, making it the hottest planet.",
  Earth: "Our home planet with life and liquid water.",
  Mars: "The red planet with dusty deserts and potential signs of ancient water.",
  Jupiter: "A gas giant, largest in the Solar System, famous for its Great Red Spot.",
  Saturn: "Known for its beautiful rings made of ice and rock particles.",
  Uranus: "Rotates on its side and has a pale blue-green color.",
  Neptune: "Farthest planet from the Sun with strong winds and storms.",
}

const InfoPanel = ({ planet, onClose }: InfoPanelProps) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: 30,
        padding: "15px 20px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        borderRadius: "10px",
        maxWidth: "300px",
        fontSize: "16px",
        lineHeight: "1.5",
        zIndex: 200,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0", color: "#ffcc00", fontSize: "18px" }}>{planet}</h2>
      <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>{info[planet]}</p>
      <button
        onClick={onClose}
        style={{
          background: "#ffcc00",
          border: "none",
          color: "#000",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        Close
      </button>
    </div>
  )
}

export default InfoPanel
