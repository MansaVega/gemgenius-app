
// URL del Google Sheet publicado como CSV
// Se usa el ID proporcionado por el usuario: 2PACX-1vRnk3qbEvZU18stRZNNzv0puQxduRca6RSDsW-om8LNgWgPPte5LKqcTYhmPx0QiJq9k7h24o5VHFiE
const SHEET_ID = '2PACX-1vRnk3qbEvZU18stRZNNzv0puQxduRca6RSDsW-om8LNgWgPPte5LKqcTYhmPx0QiJq9k7h24o5VHFiE';
const CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;

export interface GemData {
  [key: string]: string;
}

export const findGemstoneByReference = async (reference: string): Promise<GemData | null> => {
  try {
    console.log(`Récupération des données...`);
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Erreur de connexion à la base de données (Status: ${response.status})`);
    }
    
    const text = await response.text();
    const data = parseCSV(text);
    
    if (data.length === 0) return null;

    // Normaliser la référence buscada
    const searchRef = reference.trim().toLowerCase();

    // Identifier la colonne de référence
    // On cherche des en-têtes contenant 'ref', 'id', 'lote', 'subasta'
    const headers = Object.keys(data[0]);
    const refKey = headers.find(h => {
      const lower = h.toLowerCase();
      return lower.includes('ref') || lower.includes('lote') || lower.includes('subasta') || lower.includes('id');
    });

    // Si on trouve une colonne probable, on l'utilise. Sinon, la première colonne.
    const targetKey = refKey || headers[0];
    
    console.log(`Recherche de "${searchRef}" dans la colonne "${targetKey}"`);

    const gem = data.find(row => {
      const cellValue = row[targetKey]?.toString().toLowerCase().trim();
      return cellValue === searchRef;
    });

    return gem || null;
  } catch (error) {
    console.error("Erreur dans findGemstoneByReference:", error);
    throw error;
  }
};

/**
 * Parsea el texto CSV a un array de objetos JSON
 */
function parseCSV(csvText: string): GemData[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const result: GemData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    // Asegurarse de que la línea tenga contenido
    if (values.length > 0 && values.some(v => v.trim() !== '')) {
      const entry: GemData = {};
      // Mapear valores a encabezados
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      result.push(entry);
    }
  }

  return result;
}

/**
 * Parsea una línea CSV manejando comillas y comas
 */
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      // Manejar comillas escapadas (doble comilla)
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++; // saltar la siguiente comilla
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}
