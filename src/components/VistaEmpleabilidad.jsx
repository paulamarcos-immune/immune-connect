import React, { useState } from 'react';

// ==========================================
// 🗄️ BASE DE DATOS SIMULADA DE OFERTAS
// ==========================================
const MOCK_OFERTAS = [
  {
    id: 1,
    rol: "Junior Frontend Developer",
    empresa: "TechFlow Inc.",
    ubicacion: "Madrid (Híbrido)",
    etiqueta: "Prácticas",
    colorEtiqueta: "text-emerald-400 bg-emerald-400/20",
    fecha: "2026-05-18T10:30:00"
  },
  {
    id: 2,
    rol: "Data Analyst",
    empresa: "DataCorp",
    ubicacion: "Remoto",
    etiqueta: "Junior",
    colorEtiqueta: "text-blue-400 bg-blue-400/20",
    fecha: "2026-05-15T14:15:00"
  },
  {
    id: 3,
    rol: "Cybersecurity Intern",
    empresa: "SecureNet",
    ubicacion: "Madrid (Presencial)",
    etiqueta: "Prácticas",
    colorEtiqueta: "text-emerald-400 bg-emerald-400/20",
    fecha: "2026-05-17T09:00:00"
  },
  {
    id: 4,
    rol: "Backend Engineer (Node.js)",
    empresa: "CloudSystems",
    ubicacion: "Remoto",
    etiqueta: "Mid-Level",
    colorEtiqueta: "text-purple-400 bg-purple-400/20",
    fecha: "2026-05-10T11:45:00"
  }
];

export default function VistaEmpleabilidad({ nombreUsuario, vistaActiva, setVistaActiva }) {
  const [subTabMentoria, setSubTabMentoria] = useState('personal'); // personal, empleabilidad
  const [mensajeMentoria, setMensajeMentoria] = useState('');
  
  // 🎛️ Estado para el filtro del tablón de anuncios
  const [ordenFiltro, setOrdenFiltro] = useState('recientes'); // 'recientes' o 'antiguos'

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!mensajeMentoria.trim()) return;

    const emailDestino = "sergio.perez@immune.institute";
    const asunto = encodeURIComponent(`Solicitud de Mentoría: Desarrollo Personal - ${nombreUsuario}`);
    const cuerpo = encodeURIComponent(`Hola,\n\nSoy ${nombreUsuario} y me gustaría solicitar una mentoría de desarrollo personal.\n\nAquí tienes más detalles:\n${mensajeMentoria}\n\nUn saludo.`);

    // Forzamos la URL web de Gmail
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailDestino}&su=${asunto}&body=${cuerpo}`;
    
    // Abre Gmail en una pestaña nueva
    window.open(gmailUrl, '_blank');
    
    setMensajeMentoria('');
    alert("¡Se ha abierto Gmail en una pestaña nueva! Revisa el mensaje y dale a enviar.");
  };

  // 🧮 Lógica para ordenar las ofertas según el filtro seleccionado
  const ofertasOrdenadas = [...MOCK_OFERTAS].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return ordenFiltro === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
  });

  // 🗓️ Función para formatear la fecha a un formato legible (ej: 18/05/2026 - 10:30)
  const formatearFecha = (fechaString) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm uppercase tracking-widest">
          &larr; Volver
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">Talento y Empleabilidad</h3>
        <p className="text-gray-300 text-sm tracking-widest relative z-10">Impulsa tu carrera, conecta con empresas y recibe orientación.</p>
      </div>

      {/* MENÚ DE NAVEGACIÓN INTERNO */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#001a17] p-2 rounded-2xl border border-white/5">
        <button 
          onClick={() => setVistaActiva('ofertas')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${vistaActiva === 'ofertas' ? 'bg-emerald-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Ofertas
        </button>
        <button 
          onClick={() => setVistaActiva('networking')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${vistaActiva === 'networking' ? 'bg-cyan-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Networking
        </button>
        <button 
          onClick={() => setVistaActiva('mentorias')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${vistaActiva === 'mentorias' ? 'bg-purple-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          Mentorías
        </button>
      </div>

      {/* CONTENIDO: OFERTAS (TABLÓN DE ANUNCIOS) */}
      {vistaActiva === 'ofertas' && (
        <div className="animate-in slide-in-from-bottom-4">
          
          {/* Cabecera del Tablón y Filtro */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
              Tablón de Anuncios
            </h4>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordenar por:</label>
              <select 
                value={ordenFiltro} 
                onChange={(e) => setOrdenFiltro(e.target.value)}
                className="bg-[#001a17] text-white text-xs border border-emerald-400/30 rounded-lg p-2 outline-none focus:border-emerald-400 transition cursor-pointer"
              >
                <option value="recientes">Más recientes primero</option>
                <option value="antiguos">Más antiguos primero</option>
              </select>
            </div>
          </div>

          {/* Grid de Ofertas Dinámico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ofertasOrdenadas.map((oferta) => (
              <div key={oferta.id} className="bg-[#001a17] p-6 rounded-3xl border border-white/10 hover:border-emerald-400/50 transition flex flex-col h-full relative group">
                
                {/* Fecha superior derecha */}
                <div className="absolute top-6 right-6 text-[10px] text-gray-500 font-mono tracking-tighter group-hover:text-emerald-400 transition-colors">
                  {formatearFecha(oferta.fecha)}
                </div>

                <div className="mb-3">
                  <span className={`${oferta.colorEtiqueta} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}>
                    {oferta.etiqueta}
                  </span>
                </div>
                
                <h4 className="text-xl font-black text-white mb-2 pr-20">{oferta.rol}</h4>
                <p className="text-gray-400 text-sm mb-6 flex-grow">
                  <span className="font-bold text-gray-300">{oferta.empresa}</span> • {oferta.ubicacion}
                </p>
                
                <button className="w-full py-3 bg-white/5 text-emerald-400 font-bold rounded-xl border border-emerald-400/30 hover:bg-emerald-400 hover:text-black transition uppercase text-xs tracking-widest mt-auto">
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO: NETWORKING */}
      {vistaActiva === 'networking' && (
        <div className="bg-[#001a17] p-10 rounded-3xl border border-cyan-400/20 text-center animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-cyan-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-400/30">
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h4 className="text-2xl font-black text-white mb-2">Eventos de Networking</h4>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Conecta con antiguos alumnos, empresas partners y expertos del sector tecnológico. Próximamente anunciaremos el calendario de meetups.</p>
          <button className="bg-cyan-400 text-black px-8 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-[0_0_20px_rgba(34,211,238,0.4)]">Ver Calendario</button>
        </div>
      )}

      {/* CONTENIDO: MENTORÍAS */}
      {vistaActiva === 'mentorias' && (
        <div className="animate-in slide-in-from-bottom-4">
          {/* Sub-tabs de Mentorías */}
          <div className="flex border-b border-white/10 mb-8">
          
            <button 
              onClick={() => setSubTabMentoria('empleabilidad')} 
              className={`pb-4 px-6 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${subTabMentoria === 'empleabilidad' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Empleabilidad
            </button>
              <button 
              onClick={() => setSubTabMentoria('personal')} 
              className={`pb-4 px-6 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${subTabMentoria === 'personal' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Desarrollo Personal
            </button>
          </div>

          {/* Sub-tab: Desarrollo Personal (Formulario de Email a Sergio) */}
          {subTabMentoria === 'personal' && (
            <div className="bg-[#001a17] p-8 rounded-3xl border border-purple-400/20 shadow-xl flex flex-col md:flex-row gap-10">
              <div className="md:w-1/3">
                <div className="w-16 h-16 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-400/30">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h4 className="text-2xl font-black text-white mb-2">Desarrollo Personal</h4>
                <p className="text-gray-400 text-sm mb-4">¿Sientes que necesitas orientación extra, apoyo para gestionar el estrés o hablar sobre tu motivación en el campus?</p>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest border border-purple-400/20 bg-purple-400/5 p-3 rounded-xl">MENSAJE DIRECTO Y CONFIDENCIAL A CARRERAS PROFESIONALES.</p>
              </div>

              <div className="md:w-2/3 bg-black/30 p-6 rounded-2xl border border-white/5">
                <form onSubmit={handleEnviarMensaje} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tu Mensaje</label>
                    <textarea 
                      rows="5" 
                      value={mensajeMentoria}
                      onChange={(e) => setMensajeMentoria(e.target.value)}
                      placeholder="Hola, me gustaría concertar una sesión para hablar sobre..."
                      className="w-full bg-[#00241f] border border-gray-600 rounded-xl p-4 text-white outline-none focus:border-purple-400 resize-none transition-colors"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-purple-500 text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-purple-400 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    Abrir en Gmail
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Sub-tab: Empleabilidad */}
          {subTabMentoria === 'empleabilidad' && (
            <div className="bg-[#001a17] p-8 rounded-3xl border border-white/10 shadow-xl text-center">
               <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <h4 className="text-2xl font-black text-white mb-2">Mentoría de Empleabilidad</h4>
                <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">Revisión de CV, simulacros de entrevistas técnicas y estrategias de búsqueda de empleo. Pide cita con nuestros expertos de HR.</p>
                <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition">
                  Solicitar Revisión de CV
                </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
