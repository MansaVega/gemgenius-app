
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { findGemstoneByReference } from './services/sheetService';
import { generateGemstoneDescription } from './services/geminiService';
import GemCard from './components/GemCard';

// ----------------------------------------------------------------------
// 🟢 CONFIGURATION DU LOGO
// ----------------------------------------------------------------------
const HARDCODED_LOGO_URL = "https://idrisgemas.unaux.com/img/logoidris.png"; 

interface IdrisLogoProps {
  customUrl?: string;
}

const IdrisLogo: React.FC<IdrisLogoProps> = ({ customUrl }) => {
  const [imgError, setImgError] = useState(false);
  
  // 1. Priorité : URL personnalisée ou hardcodée
  const urlToUse = customUrl || HARDCODED_LOGO_URL;

  if (urlToUse && !imgError) {
    return (
      <div className="mb-6 w-40 h-40 relative flex items-center justify-center">
        <img 
          src={urlToUse}
          alt="Logo IDRIS" 
          className="w-full h-full object-contain drop-shadow-2xl"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Fallback Ultime : Typographie élégante
  return (
    <div className="mb-8 flex flex-col items-center justify-center p-6 border-4 border-double border-[#e6dac3] rounded-full w-40 h-40 bg-neutral-900 shadow-xl animate-fade-in-up">
        <h2 className="font-serif text-3xl font-bold text-[#e6dac3] tracking-widest">IDRIS</h2>
        <div className="w-8 h-px bg-[#e6dac3] mt-2 mb-2"></div>
        <span className="text-[#e6dac3] text-[10px] uppercase tracking-[0.2em]">GEMMOLOGIE</span>
    </div>
  );
};

const App: React.FC = () => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gemImage, setGemImage] = useState<string | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setGemImage(null);
    setPurchasePrice(null);

    try {
      const gemData = await findGemstoneByReference(reference);
      
      if (!gemData) {
        throw new Error(`Aucune gemme trouvée avec la référence "${reference}" dans l'inventaire.`);
      }

      // Debug pour le développeur (visible dans la console F12)
      console.log("🔍 Données récupérées :", gemData);
      const keys = Object.keys(gemData);

      // -------------------------------------------------------
      // 1. LOGIQUE D'EXTRACTION D'IMAGE
      // -------------------------------------------------------
      let foundImageUrl: string | null = null;
      
      // On cherche toutes les colonnes possibles pour l'image
      const imgKeys = keys.filter(k => {
        const normalizedKey = k.trim().toLowerCase();
        return normalizedKey === 'img' || 
               normalizedKey === 'image' || 
               normalizedKey === 'photo' || 
               normalizedKey === 'photos' ||
               normalizedKey.includes('img') ||
               normalizedKey.includes('photo');
      });

      // On prend la première qui contient quelque chose
      for (const key of imgKeys) {
        if (gemData[key] && gemData[key].trim() !== '') {
          let rawLink = gemData[key].split(',')[0].trim(); // On prend le premier lien si plusieurs séparés par virgule
          
          // Si le lien n'est pas une URL complète (ne commence pas par http)
          if (!rawLink.startsWith('http')) {
             // Si l'utilisateur a mis juste "34" sans extension, on ajoute .jpg
             if (!rawLink.includes('.')) {
               rawLink += '.jpg';
             }
             // On ajoute le préfixe du serveur
             rawLink = `https://idrisgemas.unaux.com/photos/${rawLink}`;
          }
          foundImageUrl = rawLink;
          break; // On a trouvé, on arrête de chercher
        }
      }

      // Fallback image auto si rien dans la colonne
      if (!foundImageUrl) {
        const cleanRef = reference.trim();
        foundImageUrl = `https://idrisgemas.unaux.com/photos/${cleanRef}.jpg`;
      }
      
      // IMPORTANT : Ajout d'un paramètre unique (?t=...) pour forcer le navigateur 
      // à recharger l'image et ne pas utiliser une version "erreur 404" en cache.
      if (foundImageUrl) {
        const timestamp = new Date().getTime();
        const separator = foundImageUrl.includes('?') ? '&' : '?';
        foundImageUrl = `${foundImageUrl}${separator}t=${timestamp}`;
      }
      
      setGemImage(foundImageUrl);

      // -------------------------------------------------------
      // 2. LOGIQUE D'EXTRACTION DU PRIX D'ACHAT (ADMIN)
      // -------------------------------------------------------
      const purchaseKeys = ['prix achat', 'achat', 'cost', 'precio compra', 'buy', 'rp', 'cost price', 'prix revendeur'];
      const foundPriceKey = keys.find(k => purchaseKeys.some(pk => k.toLowerCase().includes(pk)));
      
      if (foundPriceKey && gemData[foundPriceKey]) {
        console.log(`💰 Prix d'achat trouvé dans la colonne "${foundPriceKey}": ${gemData[foundPriceKey]}`);
        setPurchasePrice(gemData[foundPriceKey]);
      } else {
        console.log("⚠️ Aucun prix d'achat trouvé dans les colonnes.");
      }

      // -------------------------------------------------------
      // 3. GÉNÉRATION FICHE IA
      // -------------------------------------------------------
      const description = await generateGemstoneDescription(gemData);
      setResult(description);
      
    } catch (err: any) {
      console.error("Search Error:", err);
      setError(err.message || "Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative selection:bg-stone-200">
      
      <header className="mb-8 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        {/* Logo IDRIS dynamique */}
        <IdrisLogo />

        <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-neutral-900 uppercase mb-2 font-serif">
          GEMGENIUS
        </h1>
        <p className="text-stone-500 text-sm font-light tracking-widest border-t border-[#e6dac3] pt-4 px-6">
          Générateur de fiches technique de prestige
        </p>
      </header>

      <main className="w-full max-w-xl space-y-8">
        <div className="bg-white p-8 rounded-sm shadow-xl border border-stone-200 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900"></div>
          
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="reference" className="block text-xs font-bold text-neutral-900 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
              <Search size={14} className="text-[#e6dac3]" strokeWidth={3} />
              Référence Inventaire
            </label>
            <div className="relative flex items-center group">
              <input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="ENTREZ LE NUMÉRO (EX. 2976)"
                className="block w-full pl-5 pr-14 py-4 bg-stone-50 text-neutral-900 font-semibold text-lg border border-stone-300 rounded-none focus:ring-0 focus:border-neutral-900 focus:bg-white transition-all placeholder-stone-400 shadow-inner"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !reference.trim()}
                className="absolute right-1 top-1 bottom-1 aspect-square bg-neutral-900 text-[#e6dac3] rounded-none hover:bg-black disabled:bg-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Search size={20} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </form>
          
          {error && (
             <div className="mt-6 p-4 bg-red-50 text-red-900 text-sm border-l-2 border-red-900 flex items-center font-medium shadow-sm">
                <span className="mr-3 text-lg">⚠️</span>
                <span>{error}</span>
             </div>
          )}
        </div>

        {result && (
          <div className="animate-fade-in-up">
            <GemCard 
              content={result} 
              imageUrl={gemImage} 
              purchasePrice={purchasePrice}
            />
          </div>
        )}
      </main>
      
      <footer className="mt-auto pt-16 flex flex-col items-center gap-6 opacity-80 hover:opacity-100 transition-opacity pb-8">
        <div className="text-stone-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          &copy; {new Date().getFullYear()} IDRIS GEMMOLOGIE
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
