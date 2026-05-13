import React from 'react';

function VistaMadrid({ setVistaActiva }) {
  // Datos de ejemplo para las tarjetas inferiores
  const planes = [
    { 
      id: 1, 
      titulo: "Tardeo y Terrazas", 
      desc: "Rooftops en Gran Vía y cervezas artesanales por Malasaña.", 
      img: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800", 
      icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg> 
    },
    { 
      id: 2, 
      titulo: "Arte Inmersivo", 
      desc: "Exposiciones digitales en Matadero o el Nomad Museo.", 
      img: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800", 
      icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> 
    },
    { 
      id: 3, 
      titulo: "Gastronomía", 
      desc: "De los bocatas de calamares en la Plaza Mayor a la alta cocina.", 
      img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800", 
      icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4h18z"></path></svg> 
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
        
        {/* IMAGEN DE PERFIL CIRCULAR USANDO TU ARCHIVO LOCAL */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10 hidden sm:block">
          <img 
            src="/saganuky.jpg" // Hace referencia directamente a la imagen en la carpeta public
            className="w-full h-full object-cover rounded-full border-4 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-gray-900" 
            alt="Foto de perfil de saganuky" 
          />
        </div>
      </section>

      {/* SECCIÓN DE TARJETAS INTERACTIVAS INFERIORES */}
      <div>
        <h3 className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-6 px-2">Categorías Populares</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <div key={plan.id} className="group relative h-64 rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              {/* Imagen de fondo de la tarjeta */}
              <img src={plan.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80" alt={plan.titulo} />
              
              {/* Degradado oscuro para legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              
              {/* Contenido de la tarjeta (icono + texto) con animación en hover */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Icono animado */}
                <div className="mb-3 block transform group-hover:-translate-y-2 transition-transform duration-500 shadow-lg">
                  {plan.icon}
                </div>
                {/* Título y descripción */}
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{plan.titulo}</h4>
                <p className="text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">{plan.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default VistaMadrid;
