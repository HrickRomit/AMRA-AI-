export default function TTSButton({ text }) {
  const handlePlay = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const audio = new Audio(data.audio_url);
      audio.play();
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  return (
    <button onClick={handlePlay} style={{ margin: "10px", padding: "10px" }}>
      🔊 প্রশ্ন শুনুন
    </button>
  );
}
