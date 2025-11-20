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

      ---------------------------------------------------------
      DATOS DE LA GEMA (JSON)
      ---------------------------------------------------------
      ${JSON.stringify(gemData, null, 2)}

      ---------------------------------------------------------
      REGLAS CRÍTICAS PARA EL TÍTULO (Línea 💎)
      ---------------------------------------------------------
      Analiza el valor de la columna "Qté" (o "Qty" / "Quantity"):

      🔴 REGLA DE CANTIDAD 1 (PAR): 
      SI "Qté" es "2" (Número o Texto):
      - El título DEBE comenzar con: "PAR DE"
      - El nombre de la gema debe estar en PLURAL (ej. RUBÍES, ZAFIROS).
      - Ejemplo: 💎 PAR DE RUBÍES NATURALES DE MADAGASCAR

      🔴 REGLA DE CANTIDAD 2 (LOTE): 
      SI "Qté" es mayor o igual a "3":
      - El título DEBE comenzar con: "LOTE DE [Valor Qté]"
      - El nombre de la gema debe estar en PLURAL.
      - Ejemplo: 💎 LOTE DE 5 ZAFIROS NATURALES DE CEILÁN

      🔴 REGLA DE CANTIDAD 3 (INDIVIDUAL): 
      SI "Qté" es "1", "0", vacío o no existe:
      - Usa el formato singular estándar.
      - Ejemplo: 💎 ZAFIRO AZUL NATURAL DE MADAGASCAR

      REGLAS DE TERMINOLOGÍA EN EL TÍTULO:
      1. Todo en MAYÚSCULAS.

      2. REGLA DE TAMAÑO (GRANDE):
         Analiza el campo "Dimensions". Busca números en mm.
         SI CUALQUIER dimensión es mayor o igual a 10 mm (>= 10.0):
         - La gema se clasifica como "GRANDE".

      3. REGLA ESPECIAL GRANATE CAMBIO DE COLOR (PRIORIDAD):
         Analiza si la gema es un "Grenat" (Granate) y si el campo "Variety" o "Shape" menciona "Changement de Couleur" o "Color Change".
         SI SE CUMPLE:
         - EL TÍTULO DEBE COMENZAR CON LA PALABRA "RARO" (justo después de "PAR DE" o "LOTE DE" si aplica, o al inicio absoluto si es individual).
         - El nombre de la gema debe escribirse como "GRANATE CAMBIO DE COLOR".
         - Ejemplo: RARO GRANATE CAMBIO DE COLOR DE [ORIGEN] SIN TRATAMIENTO.

      4. REGLA ESPECIAL ZAFIRO ROSA:
         Analiza si la gema es un "Saphir" (Zafiro).
         SI el campo "Color" contiene "Rose", "Pink" o combinaciones (ej. "Rose Pourpre"):
         - EL NOMBRE DE LA GEMA EN EL TÍTULO DEBE SER "ZAFIRO ROSA".
         - Ejemplo: ZAFIRO ROSA NATURAL DE MADAGASCAR.

      5. Si es NATURAL:
         - Debe incluir la palabra "NATURAL" (o NATURALES).
         - SI ES GRANDE (>= 10mm):
           * Agrega "GRANDE" (o GRANDES) justo antes del nombre de la gema.
           * Ejemplo: GRANDE RUBÍ NATURAL DE MADAGASCAR.
         - Debe incluir el ORIGEN geográfico (ej. "DE COLOMBIA").
         - REGLA DE NO TRATAMIENTO:
           Analiza el campo "Treatment" (o "Commentaire").
           SI NO HAY TRATAMIENTO (None, Unheated, No treatment, Aucun, etc.):
           * AÑADE "SIN TRATAMIENTO" después del origen.
           * Ejemplo: GRANDE RUBÍ NATURAL DE MADAGASCAR SIN TRATAMIENTO.

      6. Si es DE LABORATORIO (Sintético/Lab grown/Hydrothermal/Cultivo):
         - Incluye OBLIGATORIAMENTE "DE CULTIVO".
         - OBLIGATORIO: INCLUYE LA FRASE "SIN TRATAMIENTO" después de "DE CULTIVO".
         - NO incluyas el origen geográfico.
         - ADJETIVOS INICIALES (IMPORTANTE: CONCORDANCIA DE GÉNERO):
           * Determina el género gramatical de la gema en español:
             - MASCULINO (Usa "FINO"): ZAFIRO, RUBÍ, GRANATE, DIAMANTE, ÓPALO, TOPACIO, PERIDOTO, CUARZO.
               -> EJEMPLO: "FINO ZAFIRO" (Nunca 'Fina Zafiro').
             - FEMENINO (Usa "FINA"): ESMERALDA, TURMALINA, ESPINELA, AMATISTA, AGUAMARINA, TANZANITA.
               -> EJEMPLO: "FINA ESMERALDA".
           * Si NO es GRANDE (< 10mm):
             - MASCULINO: Usa "FINO" (ej. FINO ZAFIRO...).
             - FEMENINO: Usa "FINA" (ej. FINA ESMERALDA...).
             - PLURALES: "FINOS" o "FINAS".
           * Si ES GRANDE (>= 10mm):
             - MASCULINO: Usa "FINO Y GRANDE" (ej. FINO Y GRANDE ZAFIRO...).
             - FEMENINO: Usa "FINA Y GRANDE" (ej. FINA Y GRANDE ESMERALDA...).
             - PLURALES: "FINOS Y GRANDES" o "FINAS Y GRANDES".

      7. REGLA DE CERTIFICADO (MUY IMPORTANTE - AL FINAL DEL TÍTULO):
         Analiza el campo "Certificate", "Certificat" o "Report".
         SI existe un certificado válido (ej. GIA, AGL, GRS, IGI, LOTUS, etc.) y NO es "None", "No", "N/A", "Sin certificado" o vacío:
         - AÑADE "CON CERTIFICADO [NOMBRE DEL CERTIFICADO]" AL FINAL ABSOLUTO DEL TÍTULO.
         - Ejemplo: FINA ESMERALDA DE CULTIVO SIN TRATAMIENTO CON CERTIFICADO AGL
         - Ejemplo: ZAFIRO NATURAL DE CEILÁN CON CERTIFICADO GIA

      ---------------------------------------------------------
      REGLAS DE CONTENIDO ESPECÍFICO
      ---------------------------------------------------------
      💰 PRECIO (REGLA ESTRICTA):
      - Busca el campo "Prix Vente" o "Price" en el JSON.
      - SIEMPRE DEBES INCLUIR LA LÍNEA "📌 Precio inicial:".
      - LÓGICA DE VALOR:
        * CASO 1: SI el precio EXISTE Y ES MAYOR A 0 (ej. "1500", "250"):
          -> ESCRIBE: "📌 Precio inicial: [Valor]"
        * CASO 2: SI el precio es 0, "0", Vacío, Null, "None", o No existe:
          -> ESCRIBE: "📌 Precio inicial:" (DÉJALO VACÍO DESPUÉS DE LOS DOS PUNTOS, NO PONGAS NADA MÁS).
      
      🎨 COLOR (IMPORTANTE):
      - Si el color o descripción menciona "Cornflower":
      - ✅ USA SIEMPRE: "AZUL CORNFLOWER" (o Cornflower Blue).
      - ⛔ PROHIBIDO: Nunca escribas "Azul Aciano".

      🧴 TRATAMIENTOS (Campo "Treatment", "Traitement" o "Commentaire"):
      - Analiza el texto del campo.
      - SI contiene "Berilio" o "Beryllium": Escribe EXACTAMENTE "Calentado, berilio".
      - SI contiene "Glass", "glass filled", "Relleno", "Vidrio", "Composite", "Lead glass": Escribe EXACTAMENTE "Calentado, Glass-filled".
      - SI contiene "Radiación", "Radiation" o "Irradiation": Escribe EXACTAMENTE "Calentado, Radiación".
      - Para "Heated", "Calentado", "Chauffé" (sin otras menciones): Escribe "Calentado".
      - Para "Unheated", "No treatment", "None", "Aucun", "Sin tratamiento": Escribe "Sin tratamiento".
      - ⛔ IMPORTANTE: NUNCA escribas "Ninguno". Si no hay tratamiento, escribe SIEMPRE "Sin tratamiento".
      - Para otros casos no especificados arriba, usa el término estándar en español.

      🌍 ORIGEN:
      - Si es NATURAL: Escribe la línea "🌍 Origen: [País/Región]" (ej. Colombia, Birmania, Ceilán).
      - Si es CULTIVO/LABORATORIO: NO escribas la línea de origen.
      
      🔖 REFERENCIA:
      - Busca el campo 'Ref', 'Reference', 'Lot', 'Lote' o 'ID' en el JSON.
      - Debes incluirlo al final de la ficha.

      ---------------------------------------------------------
      FORMATO VISUAL DE SALIDA (Estricto)
      ---------------------------------------------------------
      ✨ Subasta [Valor de 'Ref' o 'Lot'] ✨
      💎 [TÍTULO GENERADO SEGÚN REGLAS]
      📌 Precio inicial: [Valor o vacío]
      🔬 Claridad: [Clarity/Pureté traducido al español]
      📐 Talla: [Shape/Forme traducido al español]
      [INSERTAR AQUÍ LA LÍNEA ORIGEN SI ES NATURAL]
      📏 Dimensiones: [Dimensions]
      ⚖️ Peso: [Poids] ct
      🧴 Tratamientos: [Tratamiento normalizado según reglas]
      📄 Certificado: [Certificado o "No incluido"]
      🔖 Ref : [Valor de 'Ref' o 'Lot']

      IMPORTANTE:
      - No agregues saludos ni texto extra.
      - Respeta estrictamente las mayúsculas y emojis del formato.
      - La salida debe ser exclusivamente en ESPAÑOL.
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