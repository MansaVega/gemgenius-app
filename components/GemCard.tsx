
import React, { useState, useEffect } from 'react';
import { Copy, Check, Lock } from 'lucide-react';

interface GemCardProps {
  content: string;
  imageUrl?: string | null;
  purchasePrice?: string | null;
}

const GemCard: React.FC<GemCardProps> = ({ content, imageUrl, purchasePrice }) => {
  const [copied, setCopied] = useState(false);
  const [copiedPrice, setCopiedPrice] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset de l'état d'erreur si l'URL de l'image change (ex: nouvelle recherche)
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Fonction de copie principale (Fiche technique)
  const handleCopy = async () => {
    try {
      const plainText = content.trim();
      const htmlContent = plainText
        .replace(/\n/g, '<br>')
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      const fullHtml = `<div style="font-family: sans-serif; color: #1c1917;">${htmlContent}</div>`;

      if (typeof ClipboardItem !== 'undefined') {
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        const htmlBlob = new Blob([fullHtml], { type: 'text/html' });

        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed: ', err);
      try {
        await navigator.clipboard.writeText(content.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback failed', e);
      }
    }
  };

  // Fonction de copie dédiée au prix d'achat
  const handleCopyPrice = async () => {
    if (!purchasePrice) return;
    try {
      await navigator.clipboard.writeText(purchasePrice);
      setCopiedPrice(true);
      setTimeout(() => setCopiedPrice(false), 2000);
    } catch (err) {
      console.error('Price Copy failed', err);
    }
  };

  const renderContent = () => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim().replace(/\*/g, ''); 
      
      if (!trimmedLine) return null;

      const isHeader = trimmedLine.includes('✨ Vente') || trimmedLine.includes('✨ Subasta');
      const isGemTitle = line.includes('💎');
      const isPrice = line.includes('📌');

      if (isHeader) {
        return (
          <div key={i} className="text-center mb-6 mt-2">
             <span className="inline-block px-6 py-1.5 bg-stone-100 text-stone-600 uppercase tracking-[0.2em] text-xs font-bold border border-stone-200">
               {trimmedLine.replace(/✨/g, '').trim()}
             </span>
          </div>
        );
      }

      if (isGemTitle) {
        const titleText = trimmedLine.replace(/💎/g, '').trim();
        return (
          <div key={i} className="mb-6 pb-4 border-b border-stone-200 flex flex-col items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm">💎</span>
            <p className="font-serif font-black text-neutral-900 text-2xl leading-tight text-center uppercase tracking-wide">
              {titleText}
            </p>
          </div>
        );
      }
      
      if (isPrice) {
        return (
          <div key={i} className="mb-3 flex items-center justify-center p-2 bg-[#FDFCF8] border border-[#e6dac3]/30 rounded-lg">
            <span className="text-neutral-900 font-bold font-mono text-lg">{trimmedLine}</span>
          </div>
        );
      }

      return (
        <div key={i} className="mb-2.5 flex items-start text-stone-700 font-medium text-sm md:text-base pl-2 border-l-2 border-transparent hover:border-[#e6dac3] transition-colors">
          <span>{trimmedLine}</span>
        </div>
      );
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      
      {/* --- CARTE PRINCIPALE (FICHE TECHNIQUE) --- */}
      <div className="bg-white shadow-2xl shadow-stone-300/40 overflow-hidden transform transition-all relative border-t-4 border-neutral-900">
        
        {/* Header */}
        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#e6dac3]">
            <h3 className="font-serif text-xl font-bold tracking-widest text-white">
              IDRIS
            </h3>
          </div>
          
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              copied 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-[#e6dac3] text-neutral-900 hover:bg-white hover:text-neutral-900'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* Image Section */}
        {imageUrl && !imageError && (
          <div className="relative w-full h-64 md:h-80 bg-stone-100 border-b border-stone-200">
            <img 
              key={imageUrl} 
              src={imageUrl} 
              alt="Pierre précieuse"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 md:p-8 bg-white font-sans">
          {renderContent()}
        </div>

        {/* Footer decorative */}
        <div className="h-1 w-full bg-gradient-to-r from-[#e6dac3] via-neutral-200 to-[#e6dac3]"></div>
      </div>

      {/* --- BLOC PRIX D'ACHAT (ADMIN / PRIVÉ) --- */}
      {purchasePrice && (
        <div className="bg-stone-800 rounded-sm p-4 flex items-center justify-between shadow-lg animate-fade-in-up border-l-4 border-[#e6dac3]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-[#e6dac3]">
              <Lock size={14} />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Prix d'achat (Cost)</p>
              <p className="text-lg font-mono font-bold text-white tracking-wider">{purchasePrice}</p>
            </div>
          </div>

          <button 
            onClick={handleCopyPrice}
            className={`p-2 rounded-full transition-all ${
              copiedPrice 
                ? 'bg-green-600 text-white' 
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600 hover:text-white'
            }`}
            title="Copier le prix d'achat"
          >
            {copiedPrice ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default GemCard;
