import axios from 'axios';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const isMeaningfulContent = (text) => {
  if (!text || text.trim().length < 10) return false; 
  const noisePatterns = /^(um+|ah+|\s+|[^\w\s]+)$/i;
  return !noisePatterns.test(text);
};

export const generateReport = async (transcript) => {
  try {
    console.log("📝 Generating structured dental report...");

    if (!isMeaningfulContent(transcript)) {
      console.log("⚠️ No relevant content detected.");
      return "No relevant content detected. Unable to generate a meaningful report.";
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a virtual dental assistant trained to create structured dental reports. Format the report as follows:\n\n" +
              "● Patient Name (if mentioned)\n" +
              "● Date of Visit\n" +
              "● Diagnosis:\n" +
              "  ○ List diagnoses\n" +
              "● Treatment Plan:\n" +
              "  ○ Procedures or recommendations\n" +
              "● Medications:\n" +
              "  ○ Prescriptions\n" +
              "● Follow-up Instructions:\n" +
              "  ○ Next steps\n\n" +
              "Ensure the report is formal, concise, and meets dental standards.",
          },
          { role: "user", content: transcript },
        ],
        max_tokens: 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const report = response.data.choices[0]?.message?.content?.trim();

    if (!report) throw new Error("GPT-4o-mini did not return a report");

    console.log("✅ Report generated successfully");
    return report;
  } catch (error) {
    console.error("❌ GPT-4 API Error:", error.response?.data || error);
    throw new Error("Error generating report");
  }
};
