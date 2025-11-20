
import React from 'react';
import { X, Github, Key, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface RestorationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const RestorationGuide: React.FC<RestorationGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 text-stone-200">
      <div className="bg-neutral-900 border border-neutral-700 rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in-up scrollbar-thin scrollbar-thumb-[#e6dac3] scrollbar-track-neutral-800">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-500 hover:text-[#e6dac3] transition-colors z-10"
        >
          <X size={28} />
        </button>

        <div className="p-8 md:p-12">
          <div className="border-b border-neutral-700 pb-6 mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#e6dac3] mb-2 flex items-center gap-3">
              <Github className="text-[#e6dac3]" />
              Guide de Mise en Ligne
            </h2>
            <p className="text-stone-400 font-light">
              Suivez ces étapes pour corriger l'écran blanc ou mettre à jour votre application.
            </p>
          </div>

          <div className="space-y-10">
            
            {/* ÉTAPE 1 : PRÉPARATION */}
            <div className="relative pl-8 border-l-2 border-[#e6dac3]/30">
              <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Téléchargement des correctifs</h3>
              <div className="bg-neutral-800/40 p-5 rounded-sm border border-neutral-700/50">
                <p className="text-stone-300 mb-2">
                  En haut à droite de cette fenêtre (Google AI Studio), cliquez sur le petit bouton <strong>Download</strong> (flèche vers le bas).
                </p>
                <p className="text-sm text-stone-500">
                  Cela va créer un dossier sur votre ordinateur. Ouvrez ce dossier.
                </p>
              </div>
            </div>

            {/* ÉTAPE 2 : GITHUB */}
            <div className="relative pl-8 border-l-2 border-[#e6dac3]/30">
              <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                2. Mise à jour sur GitHub
              </h3>
              
              <div className="space-y-4 text-stone-300">
                <div className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs font-bold">1</span>
                   <p>Allez sur votre projet GitHub (ex: <code>github.com/votre-pseudo/idris-app</code>).</p>
                </div>
                <div className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs font-bold">2</span>
                   <p>Cliquez sur le bouton gris <strong>Add file</strong> puis <strong>Upload files</strong>.</p>
                </div>
                
                <div className="bg-stone-800 p-4 mt-2 border-l-4 border-[#e6dac3]">
                   <p className="font-bold text-white mb-2 flex items-center gap-2">
                     <ArrowRight size={16} className="text-[#e6dac3]" />
                     Action critique
                   </p>
                   <ul className="list-disc list-inside text-sm space-y-1 text-stone-300">
                     <li>Prenez <strong>TOUS</strong> les fichiers du dossier que vous venez de télécharger.</li>
                     <li>Glissez-les dans la page GitHub.</li>
                     <li>Attendez que les fichiers chargent.</li>
                     <li>Cliquez sur le bouton vert <strong>Commit changes</strong> en bas.</li>
                   </ul>
                </div>
              </div>
            </div>

            {/* ÉTAPE 3 : NETLIFY */}
            <div className="relative pl-8 border-l-2 border-[#e6dac3]/30">
              <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                3. Netlify (Automatique)
              </h3>
              <div className="space-y-3 text-stone-300">
                 <p>Une fois les fichiers mis sur GitHub, Netlify va détecter le changement et reconstruire le site.</p>
                 <p className="text-sm text-[#e6dac3]">Cela prend environ 1 à 2 minutes. Rafraîchissez votre site Netlify après ce délai.</p>
              </div>
            </div>

            {/* ÉTAPE 4 : CLÉ API */}
            <div className="relative pl-8 border-l-2 border-transparent">
               <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Key size={20} className="text-[#e6dac3]" />
                4. Configuration Netlify (Crucial)
              </h3>
              <div className="bg-neutral-800/60 p-5 border border-neutral-700 rounded-sm">
                <p className="text-stone-300 mb-4">
                  Sur Netlify, allez dans <strong>Site configuration</strong> {'>'} <strong>Environment variables</strong>.
                  Si vous avez déjà une variable, supprimez-la et recréez-la comme ceci :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  
                  {/* BOITE 1 */}
                  <div className="relative bg-stone-900 p-4 rounded border border-stone-600 ring-2 ring-[#e6dac3]">
                    <div className="absolute -top-3 left-3 bg-[#e6dac3] text-stone-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                      Case "Key" (Le Nom)
                    </div>
                    <div className="text-center mt-2">
                        <span className="block text-2xl font-black text-white tracking-wider">API_KEY</span>
                        <span className="text-xs text-stone-500 font-bold mt-1">
                            ⚠️ Écrire EXACTEMENT ça
                        </span>
                    </div>
                  </div>

                  {/* BOITE 2 */}
                  <div className="relative bg-stone-900 p-4 rounded border border-stone-600">
                    <div className="absolute -top-3 left-3 bg-stone-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                      Case "Value" (Le Secret)
                    </div>
                     <div className="text-center mt-2">
                        <span className="block text-sm font-mono text-stone-300 break-all">AIzaSy...</span>
                        <span className="text-xs text-stone-500 block mt-1">(Collez votre longue clé ici)</span>
                    </div>
                  </div>

                </div>

                <div className="mt-4 flex justify-center">
                    <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#e6dac3] hover:text-white font-bold underline text-sm"
                    >
                    <ExternalLink size={14} />
                    Récupérer ma clé AIza... ici
                    </a>
                </div>

              </div>
            </div>

          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-[#e6dac3] hover:bg-white text-neutral-900 font-bold uppercase tracking-widest text-sm transition-all rounded-sm shadow-lg hover:shadow-xl hover:scale-105"
            >
              Fermer le guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestorationGuide;
