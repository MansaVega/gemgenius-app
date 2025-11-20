import React from 'react';
import { X, Github, Rocket, Key, CheckCircle, ArrowRight } from 'lucide-react';

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
              Tutoriel de Déploiement
            </h2>
            <p className="text-stone-400 font-light">
              Suivez ces étapes simples pour mettre votre application en ligne gratuitement et de manière professionnelle.
            </p>
          </div>

          <div className="space-y-10">
            
            {/* ÉTAPE 1 : PRÉPARATION */}
            <div className="relative pl-8 border-l-2 border-[#e6dac3]/30">
              <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Téléchargement</h3>
              <div className="bg-neutral-800/40 p-5 rounded-sm border border-neutral-700/50">
                <p className="text-stone-300 mb-2">
                  En haut à droite de cette fenêtre (Google AI Studio), cliquez sur le petit bouton <strong>Download</strong> (flèche vers le bas).
                </p>
                <p className="text-sm text-stone-500">
                  Cela va créer un fichier ZIP ou un dossier sur votre ordinateur. Ouvrez ce dossier pour voir les fichiers (App.tsx, package.json, etc.).
                </p>
              </div>
            </div>

            {/* ÉTAPE 2 : GITHUB */}
            <div className="relative pl-8 border-l-2 border-[#e6dac3]/30">
              <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                2. Création sur GitHub <span className="text-xs bg-[#e6dac3] text-neutral-900 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">Important</span>
              </h3>
              
              <div className="space-y-4 text-stone-300">
                <div className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs font-bold">1</span>
                   <p>Créez un compte sur <a href="https://github.com" target="_blank" className="text-[#e6dac3] underline hover:text-white">github.com</a> (si ce n'est pas déjà fait).</p>
                </div>
                <div className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs font-bold">2</span>
                   <p>En haut à droite, cliquez sur le <strong>+</strong> puis <strong>New repository</strong>.</p>
                </div>
                <div className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-xs font-bold">3</span>
                   <p>Nommez-le <code>idris-app</code> (ou autre), cochez "Public", puis cliquez sur le bouton vert <strong>Create repository</strong>.</p>
                </div>
                
                <div className="bg-stone-800 p-4 mt-2 border-l-4 border-[#e6dac3]">
                   <p className="font-bold text-white mb-2 flex items-center gap-2">
                     <ArrowRight size={16} className="text-[#e6dac3]" />
                     L'étape clé : Mettre vos fichiers
                   </p>
                   <ul className="list-disc list-inside text-sm space-y-1 text-stone-300">
                     <li>Sur la page qui s'affiche après la création, cliquez sur le lien bleu <strong>uploading an existing file</strong>.</li>
                     <li>Ouvrez votre dossier téléchargé sur votre ordinateur.</li>
                     <li><strong>Sélectionnez TOUS les fichiers</strong> à l'intérieur.</li>
                     <li><strong>Glissez-les</strong> dans la zone grise sur GitHub.</li>
                     <li>Attendez que les barres de chargement finissent.</li>
                     <li>En bas, cliquez sur le bouton vert <strong>Commit changes</strong>.</li>
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
                3. Connexion à Netlify
              </h3>
              <div className="space-y-3 text-stone-300">
                 <p>Allez sur <a href="https://netlify.com" target="_blank" className="text-[#e6dac3] underline hover:text-white">netlify.com</a> et inscrivez-vous (vous pouvez utiliser votre compte GitHub).</p>
                 <ul className="space-y-2 list-none">
                   <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Cliquez sur <strong>Add new site</strong> {'>'} <strong>Import from existing project</strong>.</li>
                   <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Choisissez <strong>GitHub</strong>.</li>
                   <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Sélectionnez votre projet <code>idris-app</code> dans la liste.</li>
                   <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Cliquez sur <strong>Deploy idris-app</strong> (laissez les réglages par défaut).</li>
                 </ul>
              </div>
            </div>

            {/* ÉTAPE 4 : CLÉ API */}
            <div className="relative pl-8 border-l-2 border-transparent">
               <div className="absolute -left-[9px] top-0 bg-neutral-900 p-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6dac3]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Key size={20} className="text-[#e6dac3]" />
                4. Activer l'Intelligence Artificielle
              </h3>
              <div className="bg-neutral-800/60 p-5 border border-neutral-700 rounded-sm">
                <p className="text-stone-300 mb-4">
                  Pour que l'app puisse générer les descriptions, vous devez donner votre clé secrète à Netlify.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-stone-400 text-sm">
                  <li>Sur Netlify, allez dans <strong>Site configuration</strong> (menu de gauche).</li>
                  <li>Cliquez sur <strong>Environment variables</strong>.</li>
                  <li>Cliquez sur <strong>Add a variable</strong>.</li>
                  <li>Key : <code className="text-white font-bold">API_KEY</code></li>
                  <li>Value : (Copiez votre clé Google AI Studio commençant par AIza...)</li>
                  <li>Cliquez sur <strong>Create variable</strong>.</li>
                </ol>
                <p className="mt-4 text-[#e6dac3] text-sm italic">
                  C'est fini ! Votre site est en ligne et fonctionnel.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-[#e6dac3] hover:bg-white text-neutral-900 font-bold uppercase tracking-widest text-sm transition-all rounded-sm shadow-lg hover:shadow-xl hover:scale-105"
            >
              J'ai compris, je me lance !
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestorationGuide;