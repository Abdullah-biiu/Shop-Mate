import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function getAIRecommendation(
  userPrompt,
  products
) {

  try {

    // 🧠 Strong prompt to force JSON-only output
    const prompt = `
You are an API that filters products.

Available Products:
${JSON.stringify(products)}

User Request:
"${userPrompt}"

STRICT RULES:
- Return ONLY JSON array
- Do NOT return python
- Do NOT return explanation
- Do NOT return markdown
- Do NOT return text
- Return valid JSON array only
`;

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.2

      });

    let aiText =
      completion.choices[0].message.content;

    console.log("AI RAW:", aiText);

    // 🧹 Clean markdown/code blocks
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```python/g, "")
      .replace(/```/g, "")
      .trim();

    // 🧠 Extract JSON safely
    const jsonMatch =
      aiText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {

      console.log("❌ No JSON detected");

      return {
        success: false,
        message: "No JSON found"
      };

    }

    const cleanJson =
      jsonMatch[0];

    let parsedProducts;

    try {

      parsedProducts =
        JSON.parse(cleanJson);

    } catch (error) {

      console.log(
        "❌ JSON Parse Error:",
        error.message
      );

      return {
        success: false,
        message: "Invalid JSON"
      };

    }

    // 🛡️ Ensure array format
    if (!Array.isArray(parsedProducts)) {

      return {
        success: false,
        message: "Not an array"
      };

    }

    return {

      success: true,

      products: parsedProducts

    };

  } catch (error) {

    console.log(
      "❌ Groq Error:",
      error.message
    );

    return {

      success: false,

      message: "AI failed"

    };

  }

}