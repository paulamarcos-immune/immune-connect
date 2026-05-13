import React from 'react';

function VistaMadrid({ setVistaActiva }) {
  // Nuevos datos con las cuentas de Instagram
  const cuentasIG = [
    { 
      id: 1, 
      username: "@barbygant", 
      url: "https://www.instagram.com/barbygant/", 
      img: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800"
    },
    { 
      id: 2, 
      username: "@planesbrutales", 
      url: "https://www.instagram.com/planesbrutales/", 
      img: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800"
    },
    { 
      id: 3, 
      username: "@madrid_secreto", 
      url: "https://www.instagram.com/madrid_secreto/", 
      img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800"
    },
  ];

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* CABECERA CON BOTÓN VOLVER */}
      <div className="flex items-center gap-4">
        <button onClick={() => setVistaActiva("clubs")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Clubs
        </button>
        <h2 className="text-yellow-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
          {/* Icono de pin de mapa */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Exclusivo España
        </h2>
      </div>

      {/* SECCIÓN HERO PRINCIPAL */}
      <section className="bg-gradient-to-br from-[#003d35] via-[#00241f] to-gray-900 p-8 md:p-12 rounded-3xl border border-yellow-400/30 shadow-[0_0_40px_rgba(250,204,21,0.1)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Efecto de luz de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px]"></div>
        
        {/* Bloque de texto y botón */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            MADRID <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LIFE</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
            Si estudias en IMMUNE, Madrid es tu campus. Descubre cada semana los mejores planes ocultos, restaurantes de moda y eventos culturales para desconectar de la pantalla.
          </p>
          
          {/* BOTÓN NEÓN DE INSTAGRAM */}
          <a 
            href="https://www.instagram.com/saganuky/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(253,29,29,0.4)] uppercase tracking-widest text-sm group"
          >
            {/* Icono SVG de Instagram */}
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            @saganuky
          </a>
        </div>
        
        {/* IMAGEN DE PERFIL CIRCULAR */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10 hidden sm:block">
          <img 
            src="/saganuky.png"
            className="w-full h-full object-cover rounded-full border-4 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-gray-900" 
            alt="Foto de perfil de saganuky" 
          />
        </div>
      </section>

      {/* CUENTAS RECOMENDADAS */}
      <div>
        <h3 className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-6 px-2">Más cuentas de planes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cuentasIG.map((cuenta) => (
            <a 
              key={cuenta.id} 
              href={cuenta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-48 rounded-3xl overflow-hidden shadow-xl cursor-pointer border border-white/10 hover:border-yellow-400/50 transition-colors duration-500 bg-gray-900 block"
            >
              {/* Imagen de fondo más oscura (opacity-30) */}
              <img src={cuenta.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-30 group-hover:opacity-40" alt={cuenta.username} />
              
              {/* Degradado oscuro para máxima legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
              
              {/* Contenido centrado (Icono Instagram + Username) */}
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-300">
                <svg className="w-8 h-8 text-white/50 mb-3 group-hover:text-yellow-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight drop-shadow-lg">{cuenta.username}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default VistaMadrid;
