
import React, { useState } from 'react';
import { Copy, Check, Diamond, ImageOff } from 'lucide-react';

interface GemCardProps {
  content: string;
  imageUrl?: string | null;
}

const GemCard: React.FC<GemCardProps> = ({ content, imageUrl }) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = async () => {
    try {
      const lines = content.split('\n');

      // 1. Generate Plain Text (Markdown style for WhatsApp)
      const plainParts = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.includes('💎') || trimmed.includes('📌')) {
          return `*${trimmed}*`;
        }
        return trimmed;
      });
      
      // Add Image URL at the bottom if exists
      if (imageUrl) {
        plainParts.push(`\n📷 Photo: ${imageUrl}`);
      }

      const plainContent = plainParts.filter(l => l).join('\n');

      // 2. Generate HTML (for Word, Email)
      const htmlParts = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.includes('💎') || trimmed.includes('📌')) {
          return `<strong>${trimmed}</strong>`;
        }
        return trimmed;
      });

      // Add Image HTML
      if (imageUrl) {
        htmlParts.push(`<br><br><img src="${imageUrl}" alt="Gema" width="200" /><br><a href="${imageUrl}">Ver Foto</a>`);
      }

      const htmlContent = htmlParts.filter(l => l).join('<br>');

      const textBlob = new Blob([plainContent], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

      // @ts-ignore
      await navigator.clipboard.write([
        // @ts-ignore
        new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Rich text copy failed, falling back to standard copy: ', err);
      try {
        const lines = content.split('\n');
        const plainParts = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.includes('💎') || trimmed.includes('📌')) {
              return `*${trimmed}*`;
            }
            return trimmed;
        });
        if (imageUrl) plainParts.push(`\n📷 Photo: ${imageUrl}`);
        
        await navigator.clipboard.writeText(plainParts.filter(l => l).join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
         console.error('Fallback failed', fallbackErr);
      }
    }
  };

  const renderContent = () => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return null;

      const isHeader = trimmedLine.includes('✨ Vente') || trimmedLine.includes('✨ Subasta');
      const isGemTitle = trimmedLine.includes('💎');
      const isPrice = trimmedLine.includes('📌');

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
        return (
          <div key={i} className="mb-5 pb-4 border-b border-stone-200">
            <p className="font-serif font-bold text-neutral-900 text-xl leading-snug text-center">
              {trimmedLine}
            </p>
          </div>
        );
      }
      
      if (isPrice) {
        return (
          <div key={i} className="mb-3 flex items-center justify-center p-2 bg-[#FDFCF8] border border-[#e6dac3]/30 rounded-lg">
            <span className="text-neutral-900 font-bold font-mono">{trimmedLine}</span>
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
    <div className="bg-white shadow-2xl shadow-stone-300/40 overflow-hidden transform transition-all max-w-md mx-auto relative border-t-4 border-neutral-900">
      {/* Header styled like IDRIS brand */}
      <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#e6dac3]">
          <Diamond size={18} fill="#e6dac3" className="text-[#e6dac3]" />
          <h3 className="font-serif font-bold tracking-widest text-lg">IDRIS</h3>
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            copied 
              ? 'bg-[#e6dac3] text-neutral-900' 
              : 'bg-neutral-800 text-[#e6dac3] hover:bg-[#e6dac3] hover:text-neutral-900 border border-[#e6dac3]/20'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copié
            </>
          ) : (
            <>
              <Copy size={14} />
              Copier
            </>
          )}
        </button>
      </div>
      
      {/* Optional Image Section */}
      {imageUrl && !imageError && (
        <div className="w-full h-64 bg-stone-100 relative overflow-hidden border-b border-stone-200 group">
          <img 
            src={imageUrl} 
            alt="Gemme" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
             <a href={imageUrl} target="_blank" rel="noreferrer" className="text-[10px] text-white uppercase font-bold tracking-wider bg-black/50 px-2 py-1 rounded">
               Voir taille réelle
             </a>
          </div>
        </div>
      )}
      
      <div className="p-8 bg-white font-sans">
        {renderContent()}
      </div>
      
      <div className="py-3 bg-stone-100 text-[10px] text-stone-400 text-center uppercase tracking-[0.3em] border-t border-stone-200">
        Certifié par Idris
      </div>
    </div>
  );
};

export default GemCard;
