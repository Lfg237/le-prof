import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Ta clé API OpenAI
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { question, level, subject } = req.body;

  if(!question) return res.status(400).json({ answer: "Question vide." });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Tu es une IA éducative qui répond pour le niveau ${level} et la matière ${subject}.` },
        { role: "user", content: question }
      ],
      temperature: 0.6,
      max_tokens: 300
    });

    const answer = response.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "⚠️ L’IA ne répond pas." });
  }
}