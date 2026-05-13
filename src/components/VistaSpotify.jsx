import React from 'react';

// Añadimos setVistaActiva para que funcione el botón de volver
export default function VistaSpotify({ setVistaActiva }) {
  const playlistUrl = "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ";
  const embedUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0";

  // DATOS DE ÁLBUMES PARA EL EFECTO VINILO
  const recomendacionesMusica = [
    { id: 1, titulo: "Daft Punk - TRON", img: "https://upload.wikimedia.org/wikipedia/en/3/39/Tron_Legacy_Soundtrack.jpg" },
    { id: 2, titulo: "Tus iniciales", img: "https://lolaindigomusic.com/wp-content/uploads/sites/44/2026/04/LOLA-INDIGO_1.jpg" },
    { id: 3, titulo: "The Fate of Ophelia", img: "https://m.media-amazon.com/images/I/51pvCEGu05L._UXNaN_FMjpg_QL85_.jpg" },
    { id: 4, titulo: "De menos", img: "https://i.ytimg.com/vi/wdtuh1yz0II/maxresdefault.jpg" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* BOTÓN VOLVER */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("clubs")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Clubs
        </button>
      </div>

      {/* ÚNICA SECCIÓN DE CONTENIDO */}
      <section className="bg-gradient-to-b from-[#1db954]/20 to-[#00241f] p-8 text-center rounded-3xl border border-[#1db954]/30 shadow-[0_0_30px_rgba(29,185,84,0.1)] relative overflow-hidden">
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.42.24.6.84.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
          TECH BEATS
        </h2>
        <p className="text-gray-300 text-sm mb-10 uppercase tracking-widest relative z-10">Música para programar y mantener el foco</p>

        {/* CARRUSEL DE DISCOS INTERACTIVOS */}
        <div className="mb-12 relative z-10 flex gap-10 overflow-x-auto pb-8 pt-4 px-8 justify-center custom-scrollbar">
          {recomendacionesMusica.map((album) => (
            <div key={album.id} className="relative w-36 h-36 shrink-0 group cursor-pointer">
              
              {/* Vinilo (Se asoma al hacer hover y gira) */}
              <div className="absolute right-0 top-1 w-34 h-34 bg-[#111] rounded-full border border-gray-700 shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-12 group-hover:rotate-[180deg] transition-all duration-700 ease-out z-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border border-gray-600">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                 </div>
                 <div className="absolute inset-0 rounded-full border-[6px] border-white/5"></div>
                 <div className="absolute inset-2 rounded-full border-[2px] border-white/5"></div>
              </div>

              {/* Carátula del Álbum (Se levanta un poco al hacer hover) */}
              <div className="absolute inset-0 z-10 shadow-2xl group-hover:-translate-y-2 transition-transform duration-300 rounded-md border border-white/10 overflow-hidden bg-black">
                <img src={album.img} className="w-full h-full object-cover" alt={album.titulo} />
              </div>

              {/* Título (Aparece abajo al hacer hover) */}
              <div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-[#1db954]/30 truncate block w-[150%] -ml-[25%] shadow-lg">
                  {album.titulo}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 animate-in zoom-in-95 duration-300 relative z-10">
          {/* Reproductor Embebido de Spotify */}
          <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10">
            <iframe 
              style={{borderRadius: '12px'}} 
              src={embedUrl} 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
            </iframe>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
             <a 
               href={playlistUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-[#1db954] text-black font-black px-8 py-4 rounded-full hover:bg-[#1ed760] hover:scale-105 transition-all shadow-[0_0_20px_rgba(29,185,84,0.4)] uppercase tracking-widest text-sm"
             >
               Abrir App Completa
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
