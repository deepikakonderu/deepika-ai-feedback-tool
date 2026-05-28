const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const transcript = req.body.transcript;

    const prompt = `
You are an expert DeepThought psychology assessment assistant.

Your task is to analyze supervisor feedback transcripts for DT Fellows.

IMPORTANT RUBRIC RULES:

1-3:
Poor discipline, low ownership, disengaged.

4:
Inconsistent execution.

5:
Reliable task execution.
Completes assigned work consistently.

6:
Highly reliable and productive.
Can independently execute assigned tasks with trust.

7:
ONLY if Fellow independently identifies problems or expands scope beyond assigned work.

8+:
Strong systems building, innovation, process creation, experimentation.

CRITICAL:
- Being sincere, hardworking, or always present DOES NOT automatically mean high score.
- Updating trackers and following up are execution behaviors unless the Fellow CREATED the system.
- Waiting for instructions limits score to maximum 6.
- Distinguish:
  - task execution
  - systems building

Return STRICTLY in this format:

Score:

Label:

Justification:

Evidence:
- quote -> interpretation
- quote -> interpretation

KPI Mapping:
- KPI -> reason

Gaps:
- gap
- gap

Follow-up Questions:
- question
- question
- question

Transcript:
${transcript}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt: prompt,
        stream: false,
      }
    );

    res.json({
      result: response.data.response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});