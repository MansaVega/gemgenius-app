
import React, { useState, useEffect } from 'react';
import { Search, Loader2, HelpCircle, Settings, Save, X, Image as ImageIcon } from 'lucide-react';
import { findGemstoneByReference } from './services/sheetService';
import { generateGemstoneDescription } from './services/geminiService';
import GemCard from './components/GemCard';
import RestorationGuide from './components/RestorationGuide';

// ----------------------------------------------------------------------
// 🟢 CONFIGURATION DU LOGO (POUR DÉPLOIEMENT ET STABILITÉ)
// Pour que votre logo ne disparaisse JAMAIS, collez son lien ici entre les guillemets.
// C'est la méthode la plus sûre.
// Ex: const HARDCODED_LOGO_URL = "https://i.imgur.com/votre-logo.png";
const HARDCODED_LOGO_URL = ""; 
// ----------------------------------------------------------------------

interface IdrisLogoProps {
  customUrl?: string;
}

const IdrisLogo: React.FC<IdrisLogoProps> = ({ customUrl }) => {
  const [imgError, setImgError] = useState(false);
  
  // Reset error state if url changes
  useEffect(() => {
    setImgError(false);
  }, [customUrl]);

  // 1. Priorité : URL personnalisée
  if (customUrl && !imgError) {
    return (
      <div className="mb-8 w-40 h-40 relative flex items-center justify-center">
        <img 
          src={customUrl}
          alt="Logo Personnalisé" 
          className="w-full h-full object-contain drop-shadow-2xl"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Fallback : Logo par défaut (fichier local si présent)
  const showLocalImage = !customUrl && !imgError; 

  if (showLocalImage) {
     return (
       <div className="mb-8 w-40 h-40 relative flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="IDRIS Logo" 
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              setImgError(true);
            }}
          />
       </div>
     );
  }

  // 3. Fallback Ultime : Typographie élégante
  return (
    <div className="mb-8 flex flex-col items-center justify-center p-6 border-4 border-double border-[#e6dac3] rounded-full w-40 h-40 bg-neutral-900 shadow-xl animate-fade-in-up">
        <h2 className="font-serif text-3xl font-bold text-[#e6dac3] tracking-widest">IDRIS</h2>
        <div className="w-8 h-px bg-[#e6dac3] mt-2 mb-2"></div>
        <span className="text-[#e6dac3] text-[10px] uppercase tracking-[0.2em]">Joaillerie</span>
    </div>
  );
};

// --- Modal de Réglages ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, logoUrl, setLogoUrl }) => {
  const [tempUrl, setTempUrl] = useState(logoUrl);

  // Synchroniser si logoUrl change depuis l'extérieur
  useEffect(() => {
    setTempUrl(logoUrl);
  }, [logoUrl]);

  const handleSave = () => {
    setLogoUrl(tempUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-none shadow-2xl overflow-hidden animate-fade-in-up border-t-4 border-neutral-900">
        <div className="bg-neutral-900 p-4 flex justify-between items-center">
          <h3 className="text-[#e6dac3] font-serif tracking-wider flex items-center gap-2">
            <Settings size={18} />
            PERSONNALISATION
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ImageIcon size={14} />
              URL du Logo
            </label>
            <p className="text-xs text-stone-500 mb-3">
              Collez ici le lien direct vers votre image.
              {HARDCODED_LOGO_URL && (
                <span className="block mt-1 text-green-700 font-medium bg-green-50 p-2 border border-green-200 rounded mt-2">
                  ✓ Une URL par défaut est sécurisée dans le code.
                </span>
              )}
            </p>
            <input 
              type="text" 
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder={HARDCODED_LOGO_URL || "https://votre-site.com/logo.png"}
              className="w-full bg-stone-50 border border-stone-300 p-3 text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button 
              onClick={handleSave}
              className="bg-neutral-900 text-[#e6dac3] px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2"
            >
              <Save size={14} />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gemImage, setGemImage] = useState<string | null>(null); // État pour l'image de la gemme
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [showDevGuide, setShowDevGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Logo State avec Persistance "Béton"
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return HARDCODED_LOGO_URL;
    
    const saved = localStorage.getItem('idris_logo_url');
    
    if (HARDCODED_LOGO_URL && (!saved || saved.trim() === '')) {
        return HARDCODED_LOGO_URL;
    }
    
    if (saved !== null) return saved;
    
    return HARDCODED_LOGO_URL;
  });

  // Sauvegarde automatique
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('idris_logo_url', logoUrl);
    }
  }, [logoUrl]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setGemImage(null);

    try {
      const gemData = await findGemstoneByReference(reference);
      
      if (!gemData) {
        throw new Error(`Aucune gemme trouvée avec la référence "${reference}" dans l'inventaire.`);
      }

      // Extraction de l'image depuis la colonne "Photos" (ou variations)
      const photoKey = Object.keys(gemData).find(key => 
        key.toLowerCase().includes('photo') || 
        key.toLowerCase().includes('image') ||
        key.toLowerCase().includes('url')
      );
      
      if (photoKey && gemData[photoKey]) {
        // Si plusieurs liens séparés par virgule, on prend le premier
        const rawLink = gemData[photoKey].split(',')[0].trim();
        if (rawLink) {
          setGemImage(rawLink);
        }
      }

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
      <RestorationGuide isOpen={showDevGuide} onClose={() => setShowDevGuide(false)} />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
      />
      
      <header className="mb-10 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        {/* Logo IDRIS dynamique */}
        <IdrisLogo customUrl={logoUrl} />

        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-neutral-900 uppercase mb-3 font-serif border-b border-[#e6dac3] pb-4 px-8">
          Gemmologie & Haute Joaillerie
        </h1>
        <p className="text-neutral-800 font-medium text-sm md:text-base tracking-wide">
          Générateur de fiches techniques de prestige
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
            <GemCard content={result} imageUrl={gemImage} />
          </div>
        )}
      </main>
      
      <footer className="mt-auto pt-16 flex flex-col items-center gap-6 opacity-80 hover:opacity-100 transition-opacity pb-8">
        <div className="text-stone-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          &copy; {new Date().getFullYear()} IDRIS Joaillerie
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 text-[10px] text-stone-600 font-bold hover:text-neutral-900 transition-colors px-4 py-2 rounded-sm bg-white border border-stone-200 hover:border-[#e6dac3] shadow-sm"
          >
            <Settings size={12} />
            RÉGLAGES
          </button>
          
          <button 
            onClick={() => setShowDevGuide(true)}
            className="flex items-center gap-2 text-[10px] text-stone-600 font-bold hover:text-neutral-900 transition-colors px-4 py-2 rounded-sm bg-white border border-stone-200 hover:border-[#e6dac3] shadow-sm"
          >
            <HelpCircle size={12} />
            GUIDE DÉPLOIEMENT
          </button>
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
