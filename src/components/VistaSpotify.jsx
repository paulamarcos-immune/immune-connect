import React, { useState, useEffect } from 'react';

export default function VistaSpotify() {
  const [token, setToken] = useState("");

  // ==========================================
  // CONFIGURACIÓN DE LA API DE SPOTIFY
  // ==========================================
  // 1. Entra en https://developer.spotify.com/dashboard
  // 2. Inicia sesión y haz clic en "Create app"
  // 3. Ponle un nombre y en "Redirect URIs" pon la URL exacta de tu proyecto (ej: http://localhost:5173/)
  // 4. Copia el "Client ID" que te dan y pégalo aquí abajo:
  const CLIENT_ID = "PEGAR_AQUI_TU_CLIENT_ID"; 
  
  const REDIRECT_URI = window.location.origin + "/"; // Esto detecta si estás en localhost o subido a internet
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  // Comprueba si venimos de iniciar sesión en Spotify leyendo la URL
  useEffect(() => {
    const hash = window.location.hash;
    let tokenLocal = window.localStorage.getItem("spotify_token");

    if (!tokenLocal && hash) {
      tokenLocal = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("spotify_token", tokenLocal);
    }
    setToken(tokenLocal);
  }, []);

  const cerrarSesionSpotify = () => {
    setToken("");
    window.localStorage.removeItem("spotify_token");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
      <section className="bg-gradient-to-b from-[#1db954]/20 to-[#00241f] p-8 text-center rounded-3xl border border-[#1db954]/30 shadow-[0_0_30px_rgba(29,185,84,0.1)] relative overflow-hidden">
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.42.24.6.84.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
          TECH BEATS
        </h2>
        <p className="text-gray-300 text-sm mb-8 uppercase tracking-widest relative z-10">Conecta tu cuenta de Spotify y escucha música mientras estudias</p>

        {!token ? (
          <div className="flex flex-col items-center gap-4">
             <a 
               href={loginUrl}
               className="inline-block bg-[#1db954] text-black font-black px-8 py-4 rounded-full hover:bg-[#1ed760] hover:scale-105 transition-all shadow-[0_0_20px_rgba(29,185,84,0.4)] uppercase tracking-widest text-sm"
             >
               Conectar con Spotify
             </a>
             <p className="text-xs text-gray-500">Requiere haber configurado el Client ID en el código.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-4">
              <span className="text-[#1db954] font-bold text-sm bg-[#1db954]/10 px-4 py-2 rounded-full border border-[#1db954]/30">
                ¡Conectado exitosamente!
              </span>
              <button onClick={cerrarSesionSpotify} className="text-xs text-gray-400 hover:text-white transition uppercase tracking-wider">Desconectar</button>
            </div>
            
            {/* Reproductor Embebido de Spotify */}
            <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe 
                style={{borderRadius: '12px'}} 
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
              </iframe>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}