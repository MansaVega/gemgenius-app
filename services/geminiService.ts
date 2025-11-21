
import { GoogleGenAI } from "@google/genai";

// Déclaration pour TypeScript de la variable injectée par Vite
declare const __APP_API_KEY__: string;

// Récupération robuste de la clé API
// 1. __APP_API_KEY__ : Injecté par vite.config.ts (Priorité absolue)
// 2. process.env.API_KEY : Fallback standard
const getApiKey = (): string => {
  // Vérification de la variable injectée par Vite (Hard Injection)
  if (typeof __APP_API_KEY__ !== 'undefined' && __APP_API_KEY__) {
    return __APP_API_KEY__;
  }
  // Fallback process.env (Node/Standard)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const API_KEY = getApiKey();

// LOG DE DÉBOGAGE (Apparaît dans la console F12)
console.log(
  "%c🔑 CONFIGURATION API", 
  "background: #000; color: #e6dac3; padding: 4px; font-weight: bold;",
  API_KEY ? `Clé détectée (longueur: ${API_KEY.length})` : "❌ CLÉ MANQUANTE"
);

// Initialisation du client.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateGemstoneDescription = async (gemData: any): Promise<string> => {
  if (!API_KEY) {
    console.error("❌ ERREUR CRITIQUE : Clé API manquante dans le navigateur.");
    throw new Error("Clé API manquante. Vérifiez la configuration Netlify (Key: API_KEY, Value: AIza...).");
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Actúa como un experto gemólogo y asistente de inventario para subastas de alta joyería.
      Genera una ficha técnica precisa EN ESPAÑOL para la gema basada en los datos proporcionados (JSON).

      ⛔️ PROHIBIDO ESTRICTAMENTE:
      - NO saludar.
      - NO poner introducciones como "¡Excelente elección!" o "Aquí tienes la ficha".
      - NO poner frases de cierre.
      - NO inventar datos no presentes en el JSON.
      - SOLO entrega el bloque de texto de la ficha técnica.

      ---------------------------------------------------------
      DATOS DE LA GEMA (JSON)
      ---------------------------------------------------------
      ${JSON.stringify(gemData, null, 2)}

      ---------------------------------------------------------
      ⚠️ REGLAS CRÍTICAS (NO IGNORAR) ⚠️
      ---------------------------------------------------------
      1. EL TÍTULO DEBE ESTAR SIEMPRE EN MAYÚSCULAS.
      2. EL TÍTULO DEBE ESTAR ENVUELTO EN ASTERISCOS (*) PARA QUE SALGA EN NEGRITA.
         Ejemplo: 💎 *LOTE DE 5 ZAFIROS*
      3. EL PRECIO DEBE ESTAR ENVUELTO EN ASTERISCOS (*).
         Ejemplo: 📌 *Precio inicial: 100€*
         ⚠️ SI NO HAY PRECIO O ES 0: DEJA EL ESPACIO DESPUÉS DE LOS DOS PUNTOS VACÍO.
         ⛔️ NUNCA escribas "No disponible", "Consultar" o "N/A".
         ✅ Correcto si no hay precio: 📌 *Precio inicial:*
      4. PLURALES OBLIGATORIOS: SI LA CANTIDAD > 1, AÑADE SIEMPRE "S" o "ES".
         Ejemplo: ZAFIROS, RUBÍES, NEGROS, GRANDES, FINOS.

      ---------------------------------------------------------
      CONSTRUCCIÓN DEL TÍTULO (Línea 💎)
      ---------------------------------------------------------
      Orden estricto:
      [PREFIJO CANTIDAD] + [ADJETIVO CALIDAD] + [NOMBRE GEMA] + [COLOR] + [CLARIDAD] + [NATURAL] + [ORIGEN] + [TRATAMIENTO] + [CERTIFICADO]

      1. PREFIJO CANTIDAD:
         - Qté == 2: "PAR DE "
         - Qté >= 3: "LOTE DE [Qté] "
         - Qté == 1: "" (Vacío)

      2. GRAMÁTICA Y PLURALES (¡MUY IMPORTANTE!):
         - Si Qté > 1: TODO DEBE IR EN PLURAL.
         - ZAFIRO -> ZAFIROS
         - RUBÍ -> RUBÍES
         - ESMERALDA -> ESMERALDAS
         - NEGRO -> NEGROS
         - FINO -> FINOS

      3. ADJETIVO CALIDAD (FINO / FINA):
         - "High Clarity" = Clarity contiene "VS", "VVS", "IF", "FL".
         - "Grande" = Alguna dimensión >= 10mm.
         
         - Si High Clarity Y Grande: "FINA Y GRANDE " (o FINOS Y GRANDES)
         - Si High Clarity: "FINA " (o FINOS)
         - Si Grande: "GRANDE " (o GRANDES)
         - Si nada: Nada.
         
         * Género Masculino: Zafiro, Rubí, Granate, Diamante, Ópalo, Topacio, Peridoto, Cuarzo.
         * Género Femenino: Esmeralda, Turmalina, Espinela, Amatista, Aguamarina, Tanzanita, Moissanita.

      4. NOMBRE GEMA:
         - EN MAYÚSCULAS.
         - Si es "Granate" y "Color Change" -> "RARO GRANATE CAMBIO DE COLOR".
         - TRADUCCIÓN ESPECÍFICA: "MYSTIQUE" -> "MÍSTICO" (Ej. TOPACIO MÍSTICO).

      5. REGLA COLOR NEGRO (OBLIGATORIA):
         - Si el campo Color es "Black", "Noir" o "Negro":
         - DEBES INCLUIR LA PALABRA "NEGRO" (o "NEGROS") EN EL TÍTULO.
         - Ejemplo: "ZAFIRO NEGRO", "LOTE DE ZAFIROS NEGROS".

      6. OTROS COLORES:
         - Zafiro + Pink -> "ZAFIRO ROSA" (ZAFIROS ROSAS).
         - Diamante/Moissanita -> Añade el Color Grade (ej. D, E, Fancy Pink).

      7. CLARIDAD (SOLO SI ES HIGH CLARITY):
         - Añade VS, VVS, IF, etc. al título.

      8. PALABRA "NATURAL" (OBLIGATORIO SI ES NATURAL):
         - Si la gema es "Naturel", "Naturelle" o "Natural":
         - AÑADE LA PALABRA "NATURAL" DESPUÉS DE LA CLARIDAD (y antes del Origen).
         - Si es plural (Lote), usa "NATURALES".
         - Ejemplo: "TOPACIO MÍSTICO VVS NATURAL DE ÁFRICA".
         - Ejemplo: "RUBÍ NATURAL DE BIRMANIA".
         - Ejemplo Lote: "LOTE DE 5 ZAFIROS NATURALES DE CEYLAN".

      9. ORIGEN Y TRATAMIENTO EN TÍTULO:
         - Natural -> "DE [PAIS]" (ej. DE COLOMBIA).
         - Sintético -> "DE CULTIVO".
         - Treatment None/Unheated -> "SIN TRATAMIENTO".
         - Treatment Heated/Calentado -> ⛔️ NO LO PONGAS EN EL TÍTULO. Omítelo del título (pero inclúyelo abajo en la línea de Tratamientos).
         - Certificado -> "CON CERTIFICADO [NOMBRE]".
      
      10. REGLA PESO TOTAL (p.t.):
          - Mira el campo "Quantity" (Qté).
          - Si Qté > 1 (es un lote o par): La línea de peso DEBE terminar con "p.t." (por total).
            Ejemplo: "⚖️ Peso: 4.7 ct p.t."
          - Si Qté = 1: La línea de peso termina solo en "ct".
            Ejemplo: "⚖️ Peso: 1.2 ct"

      ---------------------------------------------------------
      SALIDA FINAL (FORMATO ESTRICTO)
      ---------------------------------------------------------
      Genera la ficha exactamente así, manteniendo los emojis y los asteriscos:

      ✨ Subasta [Ref] ✨
      💎 *[AQUÍ EL TÍTULO EN MAYÚSCULAS]*
      📌 *Precio inicial: [VACÍO SI NO EXISTE]*
      🔬 Claridad: [Clarity]
      [SI ES DIAMANTE/MOISSANITA: 🌟 Color Grade : [Color]]
      📐 Corte: [Shape/Forme traducido]
      [SI ES NATURAL: 📏 Dimensiones: [Dimensions]]
      [SI ES NATURAL: 🌍 Origen: [Origin]]
      [SI ES SINTETICO: 📏 Dimensiones: [Dimensions]]
      ⚖️ Peso: [Weight] ct [AQUÍ PONER "p.t." SI QTÉ > 1]
      🧴 Tratamientos: [Treatment (Traducido)]
      📄 Certificado: [Certificate]
      🔖 Ref : [Ref]

      NOTA: "Talla" se traduce como "Corte". "None" en tratamiento es "Sin tratamiento".
      ¡No olvides los asteriscos en el título y precio!
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Impossible de générer la fiche.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Erreur de génération : ${error.message}`);
  }
};

export const sendMessageToGemini = async (message: string, history: any[]): Promise<string> => {
  if (!API_KEY) return "Erreur: Clé API manquante. Vérifiez la configuration.";
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
    });

    const response = await chat.sendMessage({ message });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw new Error(`Erreur dans le chat : ${error.message}`);
  }
};
