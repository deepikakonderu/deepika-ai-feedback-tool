
import { useState } from "react";
import "./App.css";

function App() {

  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {

    if (!transcript.trim()) {
      alert("Please paste transcript");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            transcript: transcript
          })
        }
      );

      const data = await response.json();

      setResult(data.result);

    } catch (error) {

      console.log(error);

      setResult("Error running analysis");
    }

    setLoading(false);
  };

  return (
    <div className="app">

      <h1>
        Supervisor Feedback Analyzer
      </h1>

      <p className="subtitle">
        AI-assisted Fellow performance analysis using Ollama
      </p>

      <textarea
        rows="12"
        placeholder="Paste supervisor transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      <button onClick={runAnalysis}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {result && (
        <div className="result">

          <h2>
            Analysis Result
          </h2>

          <pre>{result}</pre>

        </div>
      )}

    </div>
  );
}

export default App;

