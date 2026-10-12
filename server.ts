import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_EDITIONS } from './src/data/mockEditions.ts';
import { DailyEdition } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// In-memory editions store initialized with mock editions
const editionsMap = new Map<string, DailyEdition>();
for (const ed of INITIAL_EDITIONS) {
  editionsMap.set(ed.date, ed);
}

// Server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

function cleanJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// GET /api/edition/today
app.get('/api/edition/today', (req, res) => {
  const todayKey = '2026-10-08';
  const todayEdition = editionsMap.get(todayKey) || INITIAL_EDITIONS[0];
  res.json({ edition: todayEdition });
});

// GET /api/edition/history
app.get('/api/edition/history', (req, res) => {
  const allEditions = Array.from(editionsMap.values()).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  res.json({ editions: allEditions });
});

// POST /api/edition/generate - Generate live edition with Gemini 3.8 Flash
app.post('/api/edition/generate', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        edition: INITIAL_EDITIONS[0],
        warning: 'Sin clave de Gemini configurada. Se cargó la edición curada de alta fidelidad.'
      });
    }

    const todayDate = req.body?.date || '2026-10-08';
    const focusArea = req.body?.focus || 'general';

    const systemPrompt = `Eres el redactor jefe y lingüista de 'Orbis', la publicación global de inteligencia periodística y léxica más prestigiosa del mundo (estilo The Economist, Le Monde Diplomatique, Foreign Affairs).
Tu tarea es compilar una edición diaria impecable en ESPAÑOL neutro y culto para la fecha: ${todayDate}.

DEBES devolver ÚNICAMENTE un objeto JSON válido (sin comentarios ni introducciones) con la siguiente estructura:
{
  "date": "${todayDate}",
  "formattedDate": "8 de Octubre, 2026",
  "editionNumber": 1429,
  "dominantTheme": "Título sugerente del tema dominante del día",
  "worldTensionIndex": 68,
  "summaryLead": "Resumen editorial de 2-3 frases sobre el estado del mundo hoy.",
  "wordOfTheDay": {
    "id": "w-${todayDate}",
    "word": "PALABRA_EN_MAYÚSCULAS",
    "phonetic": "[fonética entre corchetes]",
    "partOfSpeech": "Sustantivo masculino / femenino / etc.",
    "etymology": "Origen etimológico detallado (griego, latín, acuñación geopolítica, etc.)",
    "definition": "Definición rigurosa, clara y conceptualmente rica.",
    "whyToday": "¿Por qué esta palabra es la clave exacta para interpretar los eventos mundiales de hoy?",
    "globalHeadline": "Titular periodístico internacional que ilustra el uso de la palabra",
    "contextQuote": "Frase de análisis editorial o de una figura global citando el término",
    "synonyms": ["sinónimo 1", "sinónimo 2", "sinónimo 3"],
    "antonyms": ["antónimo 1", "antónimo 2"],
    "citizenImpact": "Cómo afecta este concepto a la vida cotidiana, empleo o economía del ciudadano corriente.",
    "category": "geopolitica", // una de: 'geopolitica' | 'tecnologia' | 'economia' | 'clima' | 'sociedad'
    "academicInsight": "Perspectiva teórica o de pensadores relevantes (e.g. Bauman, Habermas, Tooze, Harari)",
    "historicalPrecedent": "Un precedente histórico relevante en siglos pasados"
  },
  "newsItems": [
    {
      "id": "news-live-1",
      "title": "Titular periodístico sobrio y contundente",
      "category": "geopolitica", // geopolitica, tecnologia, economia, clima, sociedad
      "region": "Europa", // Europa, América, Asia-Pacífico, Oriente Medio, África, Global
      "country": "Nombre del país",
      "coordinates": [latitud, longitud],
      "summary": "Resumen de dos líneas",
      "keyPoints": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
      "whyItMatters": "Por qué es crucial a escala planetaria",
      "relatedConcept": "Concepto o sub-término asociado",
      "impactScore": 5, // número del 1 al 5
      "sources": ["Fuente 1", "Fuente 2"],
      "readTimeMinutes": 3,
      "detailedAnalysis": "Análisis periodístico de fondo en 1-2 párrafos."
    }
  ]
}

Asegúrate de incluir exactamente 5 noticias globales diversas que abarquen las 5 categorías (geopolitica, tecnologia, economia, clima, sociedad) y distintas regiones geográficas (Europa, América, Asia-Pacífico, Oriente Medio, África).
La palabra del día debe ser un término de profunda relevancia intelectual, geopolítica o tecnológica (ejemplos: Multipolaridad, Ambigüedad Estratégica, Resiliencia Hídrica, Soberanía Algorítmica, Fragmentación Geoeconómica, Policrisis, Nearshoring, etc.).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const rawText = response.text || '';
    const cleaned = cleanJsonString(rawText);
    const parsedData: DailyEdition = JSON.parse(cleaned);

    parsedData.generatedByAi = true;
    editionsMap.set(parsedData.date, parsedData);

    res.json({ edition: parsedData, success: true });
  } catch (error: any) {
    console.error('Error generating edition with Gemini:', error);
    // Fallback gracefully to default edition
    res.json({
      edition: INITIAL_EDITIONS[0],
      fallback: true,
      error: error?.message || 'Error al conectar con el servicio de IA'
    });
  }
});

// POST /api/edition/topic - Generate specialized edition on custom topic or region
app.post('/api/edition/topic', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Falta el parámetro topic' });
    }

    if (!ai) {
      return res.status(200).json({
        edition: INITIAL_EDITIONS[0],
        warning: 'Sin clave de Gemini configurada. Mostrando edición general.'
      });
    }

    const topicPrompt = `Compila una edición especial temática de 'Orbis' enfocada en el tema o región: "${topic}".
Extrae la "Palabra Clave Esencial" que define este fenómeno hoy, con su etimología rigurosa, su definición, por qué es imprescindible hoy, y compila 4 noticias o reportes estratégicos globales vinculados a este tema.

Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "date": "2026-10-08",
  "formattedDate": "Edición Especial: ${topic.slice(0, 30)}",
  "editionNumber": 9901,
  "dominantTheme": "Edición Especial: ${topic}",
  "worldTensionIndex": 70,
  "summaryLead": "Resumen ejecutivo del tema analizado.",
  "wordOfTheDay": {
    "id": "w-topic",
    "word": "PALABRA",
    "phonetic": "[fo-né-ti-ca]",
    "partOfSpeech": "Sustantivo...",
    "etymology": "Etimología...",
    "definition": "Definición...",
    "whyToday": "Por qué es la palabra clave para este tema...",
    "globalHeadline": "Titular de prensa...",
    "contextQuote": "Cita o reflexión...",
    "synonyms": ["sinónimo 1", "sinónimo 2"],
    "antonyms": ["antónimo 1"],
    "citizenImpact": "Impacto cotidiano...",
    "category": "geopolitica",
    "academicInsight": "Aporte conceptual...",
    "historicalPrecedent": "Precedente histórico..."
  },
  "newsItems": [
    {
      "id": "news-topic-1",
      "title": "Titular del desarrollo 1",
      "category": "tecnologia",
      "region": "Global",
      "country": "Región",
      "coordinates": [20, 0],
      "summary": "Resumen conciso",
      "keyPoints": ["Punto 1", "Punto 2"],
      "whyItMatters": "Por qué importa",
      "relatedConcept": "Concepto",
      "impactScore": 4,
      "sources": ["Fuente"],
      "readTimeMinutes": 3,
      "detailedAnalysis": "Análisis en profundidad"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: topicPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const rawText = response.text || '';
    const cleaned = cleanJsonString(rawText);
    const parsedData: DailyEdition = JSON.parse(cleaned);
    parsedData.generatedByAi = true;

    res.json({ edition: parsedData, success: true });
  } catch (error: any) {
    console.error('Error generating topic edition:', error);
    res.status(500).json({ error: error?.message || 'Error al compilar la edición temática' });
  }
});

// POST /api/word/deepdive - Ask Gemini to unpack questions about the word of the day
app.post('/api/word/deepdive', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { word, question } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Falta la palabra' });
    }

    if (!ai) {
      return res.json({
        answer: `La palabra "${word}" representa una noción de creciente centralidad en la geopolítica contemporánea, señalando transiciones de poder e interconexión global.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Eres un lingüista y analista geopolítico senior. El usuario desea profundizar en la palabra del día "${word}".
Pregunta o aspecto a profundizar: "${question || 'Proporciona una clase magistral breve de 3 párrafos sobre sus matices, cómo se utiliza en cancillerías y qué errores evitar al usarla.'}".
Escribe en un tono pedagógico, elocuente y riguroso en español.`
    });

    res.json({ answer: response.text || '' });
  } catch (error: any) {
    console.error('Error in deepdive:', error);
    res.status(500).json({ error: error?.message || 'Error al profundizar en el término' });
  }
});

// POST /api/caption/generate - Generate automated captions for Instagram and TikTok (Spain audience)
app.post('/api/caption/generate', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      word = 'POLICRISIS',
      definition = '',
      whyToday = '',
      dominantTheme = '',
      tone = 'satirico',
      userNote = '',
    } = req.body;

    const toneInstructions = {
      satirico: 'Tono satírico, ácido e irónico (muy al estilo del humor gráfico español como El Roto, Forges o El Jueves), conectando el absurdo de las noticias mundiales con las pequeñas desventuras cotidianas en España (la cesta de la compra, el recibo de la luz, el bar de la esquina, la burocracia).',
      editorial: 'Tono editorial, culto, reflexivo y perspicaz (estilo columna de opinión de El País, Jot Down o El Cultural), con agudeza intelectual y belleza literaria.',
      viral: 'Tono directo, dinámico y conversacional para TikTok y Reels España ("Oye, ¿te suena esta palabra?", "Seguro que te ha pasado", ritmo rápido, lenguaje natural y cercano sin tecnicismos pesados).',
    }[tone as 'satirico' | 'editorial' | 'viral'] || 'Tono satírico y cercano.';

    const promptText = `Eres el mejor copywriter, humorista gráfico y estratega de redes sociales de España, especializado en divulgación cultural, sátira política y viñetas editoriales para Instagram y TikTok.

El creador ha ilustrado una VIÑETA DIARIA para la PALABRA DEL DÍA: "${word}".
Definición del término: "${definition}"
Contexto de hoy: "${whyToday}"
Eje temático global: "${dominantTheme}"
Instrucción del usuario / Apuntes: "${userNote || 'Ninguna especificación extra'}"
Enfoque de tono solicitado: ${toneInstructions}
PÚBLICO OBJETIVO: ESPAÑA (Usa modismos y naturalidad de España, sin sonar forzado ni usar expresiones de Hispanoamérica como "platicar" o "carro"; usa términos españoles como "coche", "curro", "pasta", "caña", "ticket", "factura de la luz", etc. cuando encaje con el tono).

${imageBase64 ? 'IMPORTANTE: Analiza detalladamente la imagen de la viñeta adjunta (personajes, situación dibujada, texto o bocadillos en la imagen, metáfora visual y expresividad).' : 'Crea las captions basándote en la palabra y el concepto.'}

DEBES DEVOLVER ÚNICAMENTE un JSON con esta estructura exacta (sin explicaciones adicionales ni bloques de código extra):
{
  "visualAnalysis": "Breve descripción (1-2 frases) de lo que interpretas de la ilustración y su metáfora visual.",
  "instagram": {
    "hook": "Primera línea rompedora que capta la atención en el feed (máx 90 caracteres)",
    "body": "Cuerpo del post (3-4 párrafos breves): introduce la palabra del día de forma brillante, explica la viñeta y reflexiona con ironía/lucidez sobre la actualidad en España y el mundo.",
    "whyWord": "Frase contundente de síntesis de por qué esta palabra define nuestro presente.",
    "cta": "Llamada a la acción que invite a comentar o debatir en España (ej: '¿En tu curro también se vive esto?' o '¿Qué le dirías al personaje de la viñeta?')",
    "hashtags": ["#PalabraDelDia", "#VinetadelDia", "#HumorGrafico", "#IlustracionEspana", "#Vinetas", "#Satira", "#Actualidad", "#Espana", "#${word.toLowerCase().replace(/[^a-z0-9]/g, '')}"],
    "fullText": "Texto completo listo para copiar y pegar en Instagram (incluyendo el gancho, el cuerpo, la definición, la llamada a la acción y los hashtags formateados con saltos de línea limpios y emojis sutiles)."
  },
  "tiktok": {
    "hookOnScreen": "Texto corto y llamativo para poner en pantalla los primeros 2 segundos (máx 6 palabras)",
    "voiceoverScript": "Guion de voz en off (Voiceover) de 20-30 segundos para locutar mientras se muestra el proceso de dibujo o la viñeta terminada. Debe sonar hablado, con pausas, ritmo y remate cómico/reflexivo.",
    "videoDescription": "Copy corto para la descripción del vídeo en TikTok (con llamada a seguir y comentar)",
    "suggestedAudioStyle": "Recomendación de tipo de música o audio en tendencia (ej. 'Sonido de suspense cómico', 'Lo-fi chill con voz relajada', 'Audio irónico clásico')",
    "hashtags": ["#tiktokspain", "#vinetas", "#humorgrafico", "#aprendecontiktok", "#palabradeldia", "#ilustracion"],
    "fullText": "Todo el paquete de TikTok organizado (Gancho en pantalla + Guion de locución + Descripción para pegar)."
  },
  "stories": {
    "text": "Texto breve y punzante para compartir la viñeta en Stories de Instagram",
    "pollQuestion": "Pregunta para el sticker de encuesta interactiva",
    "pollOptions": ["Opción A", "Opción B"]
  }
}`;

    let parsedCaptions = null;

    if (ai) {
      try {
        const generatePromise = (async () => {
          if (imageBase64) {
            const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
            return await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: [
                promptText,
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64,
                  },
                },
              ],
              config: {
                responseMimeType: 'application/json',
              },
            });
          } else {
            return await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: promptText,
              config: {
                responseMimeType: 'application/json',
              },
            });
          }
        })();

        // 9-second timeout race
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 9000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const rawText = response.text || '';
        const cleaned = cleanJsonString(rawText);
        parsedCaptions = JSON.parse(cleaned);
      } catch (geminiErr) {
        console.warn('Gemini call or parse failed, falling back to rich curated captions:', geminiErr);
      }
    }

    if (parsedCaptions) {
      return res.json({ captions: parsedCaptions, success: true });
    }

    // High quality fallback if no Gemini key or parse error
    const fallbackCaptions = {
      visualAnalysis: `Viñeta satírica sobre «${word}» que conecta las tensiones internacionales con el desconcierto cotidiano en España.`,
      instagram: {
        hook: `Hay días en los que el mundo entero cabe en una sola palabra: ${word}. 👇`,
        body: `Cada mañana nos despertamos con noticias de corredores comerciales cerrados, cumbres internacionales y algoritmos que lo deciden todo... y al final, la resaca de todo eso nos espera en el mostrador del supermercado o al abrir la carta del banco.\n\nHoy la palabra que lo resume todo es «${word}». Una de esas palabras que los ministros usan en ruedas de prensa para no decir que la cosa está que arde.\n\nEn la viñeta de hoy he querido retratar precisamente ese choque: cómo las grandes decisiones planetarias terminan convirtiéndose en ese pequeño drama de andar por casa que todos conocemos.`,
        whyWord: `«${word}»: ${definition || 'Cuando todo se complica a la vez y nadie sabe por dónde empezar a desenredar la madeja.'}`,
        cta: `¿Tú también sientes que vivimos atrapados en esto? Te leo en comentarios. 👇`,
        hashtags: [`#PalabraDelDía`, `#ViñetaDelDía`, `#HumorGráfico`, `#Ilustración`, `#España`, `#Sátira`, `#${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`, `#ArteGráfico`],
        fullText: `Hay días en los que el mundo entero cabe en una sola palabra: ${word}. 👇\n\nCada mañana nos despertamos con noticias de corredores comerciales cerrados, cumbres internacionales y tipos de interés... y al final, la resaca de todo eso nos espera en la cola del súper o al mirar la factura de la luz.\n\nHoy la palabra clave es «${word}» (${definition || 'cuando todo interactúa simultáneamente'}).\n\nEn la viñeta de hoy he querido retratar precisamente ese choque: las grandes turbulencias mundiales aterrizadas en la barra del bar de toda la vida.\n\n¿Tú también lo sientes en tu día a día? Te leo en comentarios. 👇\n\n#PalabraDelDía #ViñetaDelDía #HumorGráfico #Ilustración #España #Sátira #${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      },
      tiktok: {
        hookOnScreen: `La palabra del día que explica TODO esto 🤯`,
        voiceoverScript: `Seguro que estos días notas que todo está un poco más raro, más caro y más caótico. Tranquilo, no es que te estés volviendo loco. Es que tiene un nombre exacto: ${word}. Te dibujo la viñeta del día mientras te explico por qué hasta tu abuela lo está viviendo sin saberlo...`,
        videoDescription: `La palabra que explica el caos de hoy: ${word}. ¿La conocías? Sígueme para la viñeta de mañana. ✨ #palabradeldia #vinetas #humorgrafico #espana`,
        suggestedAudioStyle: 'Música instrumental lo-fi relajante o sonido cómico de fondo.',
        hashtags: ['#tiktokspain', '#vinetas', '#humorgrafico', '#palabradeldia', '#aprendecontiktok', '#espana'],
        fullText: `TEXTO EN PANTALLA: La palabra del día que explica TODO esto 🤯\n\nGUION DE VOZ:\n"Seguro que estos días notas que todo está un poco más raro y más caro. No es que te estés volviendo loco: se llama ${word}. Te lo dibujo en 30 segundos..."\n\nDESCRIPCIÓN TIKTOK:\nLa palabra que explica el caos de hoy: ${word}. ¿La conocías? Sígueme para la viñeta de mañana. ✨ #palabradeldia #vinetas #humorgrafico #espana`
      },
      stories: {
        text: `La palabra que define el día de hoy: ${word}. Desliza para ver la viñeta completa.`,
        pollQuestion: `¿Conocías ya el término «${word}»?`,
        pollOptions: ['Sí, lo uso a diario', 'Ni de broma, me lo apunto']
      }
    };

    res.json({ captions: fallbackCaptions, fallback: true });
  } catch (error: any) {
    console.error('Error generating captions:', error);
    res.status(500).json({ error: error?.message || 'Error al generar las captions para redes' });
  }
});


// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[ORBIS SERVER] Server running at http://0.0.0.0:${port}`);
  });
}

setupServer();
