import React from 'react';

export default function VistaSpotify() {
  // Enlaces universales de Spotify (He puesto una playlist famosa de concentración, pero puedes poner la que quieras)
  const playlistUrl = "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ";
  const embedUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
      <section className="bg-gradient-to-b from-[#1db954]/20 to-[#00241f] p-8 text-center rounded-3xl border border-[#1db954]/30 shadow-[0_0_30px_rgba(29,185,84,0.1)] relative overflow-hidden">
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.42.24.6.84.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
          TECH BEATS
        </h2>
        <p className="text-gray-300 text-sm mb-8 uppercase tracking-widest relative z-10">Música para programar y mantener el foco</p>

        <div className="space-y-8 animate-in zoom-in-95 duration-300 relative z-10">
          
          {/* Reproductor Embebido de Spotify (Público) */}
          <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <iframe 
              style={{borderRadius: '12px'}} 
              src={embedUrl} 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
            </iframe>
          </div>

          {/* Botón Universal para abrir la App o la Web de Spotify */}
          <div className="flex flex-col items-center gap-4 pt-4">
             <a 
               href={playlistUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-[#1db954] text-black font-black px-8 py-4 rounded-full hover:bg-[#1ed760] hover:scale-105 transition-all shadow-[0_0_20px_rgba(29,185,84,0.4)] uppercase tracking-widest text-sm"
             >
               Abrir en la App de Spotify
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
             </a>
             <p className="text-xs text-gray-500 max-w-sm">Si tienes Spotify instalado, se abrirá automáticamente. Si no, se abrirá en tu navegador.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
