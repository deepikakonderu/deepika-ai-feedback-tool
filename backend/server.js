
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {

  try {

    const transcript = req.body.transcript;

    if (!transcript) {

      return res.status(400).json({
        error: "Transcript is required"
      });
    }

    const prompt = `
You are an expert DeepThought evaluator.

Analyze the supervisor feedback transcript carefully.

Return analysis in this exact format:

Score: <number>

Label: <short label>

Justification:
<short explanation>

Evidence:
- quote -> interpretation
- quote -> interpretation

IMPORTANT KPI RULES:

You MUST use ONLY these KPI names:
- Lead Generation
- Lead Conversion
- Upselling
- Cross-selling
- NPS
- PAT
- TAT
- Quality

DO NOT invent new KPI names.

If transcript does not map clearly, use:
- Quality
or
- TAT

KPI Mapping:
- KPI -> reason

Gaps:
- gap
- gap

Follow-up Questions:
- question
- question
- question

IMPORTANT RULES:

1-3:
Poor discipline, disengaged, unreliable.

4:
Inconsistent execution.

5:
Reliable task execution.
Completes assigned work consistently.

6:
Highly reliable and dependable execution.
Can execute assigned work independently with trust.

7:
Requires independent problem identification or expanding scope beyond assigned work.

8+:
Requires systems building, innovation, experimentation, or process creation.

IMPORTANT:
- Reliability alone cannot exceed 6
- Presence alone cannot exceed 6
- Sincerity alone cannot exceed 6
- Distinguish task execution vs systems building

Transcript:
${transcript}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt: prompt,
        stream: false
      }
    );

    res.json({
      result: response.data.response
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
