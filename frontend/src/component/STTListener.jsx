import { useState } from "react";

export default function STTListener() {
  const [recognizedText, setRecognizedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        setIsRecording(false);

        try {
          const response = await fetch("http://localhost:8000/api/stt/", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch STT response");
          }

          const data = await response.json();
          setRecognizedText(data.text || "No speech recognized.");
        } catch (err) {
          console.error("STT fetch error:", err);
          setRecognizedText("Error: Could not process audio.");
        }
      };

      setIsRecording(true);
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // record for 5 seconds
    } catch (error) {
      console.error("STT error:", error);
      setRecognizedText("Error accessing microphone.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎙️ Speech to Text</h2>
      <button
        onClick={handleRecord}
        style={{
          ...styles.button,
          backgroundColor: isRecording ? "#ff4d4d" : "#4CAF50",
        }}
      >
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      <p style={styles.text}>
        {recognizedText ? `You said: ${recognizedText}` : "Say something..."}
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  text: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#333",
  },
};
