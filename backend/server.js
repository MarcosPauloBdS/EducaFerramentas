import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
const HF_TOKEN = process.env.HF_TOKEN;

app.post("/gerar", async (req, res) => {
  const tema = req.body.tema || "matemática básica";
  const prompt = `
Crie UMA questão de prova de múltipla escolha no seguinte formato JSON:
{
  "enunciado": "Aqui vai o enunciado da questão",
  "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correta": "B"
}
Tema: ${tema}
`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    let texto = data[0]?.generated_text;
    let questao = {};

    try { questao = JSON.parse(texto); }
    catch { return res.json({ erro: "Não foi possível gerar JSON", resposta_bruta: data }); }

    return res.json(questao);

  } catch (err) { return res.json({ erro: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
