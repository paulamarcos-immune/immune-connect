import React from 'react';

function VistaClubs({ setVistaActiva, paisUsuario }) {
  
  let secciones = [
    { 
      id: "foroCine", 
      titulo: "Cine y Series", 
      desc: "Recomienda y debate sobre tus favoritas.", 
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800", 
      color: "emerald",
      icon: <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
    },
    { 
      id: "foroLectura", 
      titulo: "Club de Lectura", 
      desc: "Descubre nuevos libros con la comunidad.", 
      img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800", 
      color: "cyan",
      icon: <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
    },
    { 
      id: "spotify", 
      titulo: "Tech Beats (Música)", 
      desc: "Conecta tu Spotify y escucha música.", 
      img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800", 
      color: "emerald",
      icon: <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.42.24.6.84.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
    },
    { 
      id: "cafeteria", 
      titulo: "Cafetería Virtual", 
      desc: "Salas de audio y estudio Pomodoro.", 
      img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800", 
      color: "cyan",
      icon: <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
    },
    { 
      id: "proyectos", 
      titulo: "Proyectos Tech", 
      desc: "Busca equipo para hackathons o side-projects.", 
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", 
      color: "emerald",
      icon: <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
    },
    { 
      id: "sos", 
      titulo: "S.O.S. Académico", 
      desc: "Pide ayuda o tutorías a otros compañeros.", 
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800", 
      color: "cyan",
      icon: <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    }
  ];

  if (paisUsuario === "España") {
    secciones.unshift({
      id: "madrid", 
      titulo: "Madrid Life", 
      desc: "Los mejores planes, terrazas y exposiciones de la capital.", 
      // LA URL DE ABAJO ES LA QUE HE CAMBIADO PARA ARREGLAR EL ERROR 404
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Gran_V%C3%ADa_%28Madrid%29_1d.jpg/1200px-Gran_V%C3%ADa_%28Madrid%29_1d.jpg", 
      color: "yellow",
      icon: <svg className="w-10 h-10 text-yellow-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    });
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10">
      <section className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-2xl mb-2 relative z-10">Campus Life & Clubs</h2>
        <p className="text-gray-300 text-sm mb-2 max-w-xl mx-auto relative z-10">El corazón de la comunidad IMMUNE. Únete a un club, encuentra compañeros para tus proyectos o tomate un descanso virtual.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secciones.map((sec) => (
          <div 
            key={sec.id} 
            onClick={() => setVistaActiva(sec.id)} 
            className={`group relative ${sec.id === 'madrid' ? 'md:col-span-2 lg:col-span-3 h-64' : 'h-48'} rounded-3xl overflow-hidden border border-white/10 hover:border-${sec.color}-400/50 transition duration-500 shadow-xl cursor-pointer flex flex-col justify-end bg-gray-900`}
          >
            {sec.img && (
              <img src={sec.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-50" alt={sec.titulo} />
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-t ${sec.id === 'madrid' ? 'from-black via-black/60' : 'from-[#001a17] via-[#001a17]/80'} to-transparent`}></div>
            
            <div className={`relative p-6 z-10 ${sec.id === 'madrid' ? 'md:p-10' : ''}`}>
              {sec.icon && <div className="mb-3">{sec.icon}</div>}
              <h4 className={`${sec.id === 'madrid' ? 'text-3xl' : 'text-xl'} font-black uppercase text-white leading-tight mb-1`}>{sec.titulo}</h4>
              <p className={`${sec.id === 'madrid' ? 'text-sm max-w-lg' : 'text-xs'} text-gray-300`}>{sec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaClubs;
