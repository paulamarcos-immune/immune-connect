import React, { useState } from 'react';

export default function VistaEmpleabilidad({ nombreUsuario, setVistaActiva }) {
  const [tabActiva, setTabActiva] = useState('ofertas'); // ofertas, networking, mentorias
  const [subTabMentoria, setSubTabMentoria] = useState('personal'); // personal, empleabilidad
  const [mensajeMentoria, setMensajeMentoria] = useState('');

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!mensajeMentoria.trim()) return;

    // Preparamos el correo
    const emailDestino = "sergio.perez@immune.institute";
    const asunto = encodeURIComponent(`Solicitud de Mentoría: Desarrollo Personal - ${nombreUsuario}`);
    const cuerpo = encodeURIComponent(`Hola Sergio,\n\nSoy ${nombreUsuario} y me gustaría solicitar una mentoría de desarrollo personal.\n\nAquí tienes más detalles:\n${mensajeMentoria}\n\nUn saludo.`);

    // Abrimos el cliente de correo del usuario (Gmail, Outlook, Mail de Mac, etc.)
    window.location.href = `mailto:${emailDestino}?subject=${asunto}&body=${cuerpo}`;
    
    setMensajeMentoria('');
    alert("¡Se ha abierto tu gestor de correo! Revisa que todo esté correcto y dale a enviar.");
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

      {/* MENÚ DE NAVEGACIÓN SUPERIOR */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#001a17] p-2 rounded-2xl border border-white/5">
        <button 
          onClick={() => setTabActiva('ofertas')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${tabActiva === 'ofertas' ? 'bg-emerald-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          💼 Ofertas
        </button>
        <button 
          onClick={() => setTabActiva('networking')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${tabActiva === 'networking' ? 'bg-cyan-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          🤝 Networking
        </button>
        <button 
          onClick={() => setTabActiva('mentorias')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${tabActiva === 'mentorias' ? 'bg-purple-400 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
        >
          🧠 Mentorías
        </button>
      </div>

      {/* CONTENIDO: OFERTAS */}
      {tabActiva === 'ofertas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
          <div className="bg-[#001a17] p-6 rounded-3xl border border-white/10 hover:border-emerald-400/50 transition">
            <span className="bg-emerald-400/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Prácticas</span>
            <h4 className="text-xl font-black text-white mt-4 mb-2">Junior Frontend Developer</h4>
            <p className="text-gray-400 text-sm mb-4">Empresa: TechFlow Inc. • Madrid (Híbrido)</p>
            <button className="w-full py-3 bg-white/5 text-emerald-400 font-bold rounded-xl border border-emerald-400/30 hover:bg-emerald-400 hover:text-black transition uppercase text-xs tracking-widest">Ver Detalles</button>
          </div>
          <div className="bg-[#001a17] p-6 rounded-3xl border border-white/10 hover:border-emerald-400/50 transition">
            <span className="bg-blue-400/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Junior</span>
            <h4 className="text-xl font-black text-white mt-4 mb-2">Data Analyst</h4>
            <p className="text-gray-400 text-sm mb-4">Empresa: DataCorp • Remoto</p>
            <button className="w-full py-3 bg-white/5 text-emerald-400 font-bold rounded-xl border border-emerald-400/30 hover:bg-emerald-400 hover:text-black transition uppercase text-xs tracking-widest">Ver Detalles</button>
          </div>
        </div>
      )}

      {/* CONTENIDO: NETWORKING */}
      {tabActiva === 'networking' && (
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
      {tabActiva === 'mentorias' && (
        <div className="animate-in slide-in-from-bottom-4">
          {/* Sub-tabs de Mentorías */}
          <div className="flex border-b border-white/10 mb-8">
            <button 
              onClick={() => setSubTabMentoria('personal')} 
              className={`pb-4 px-6 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${subTabMentoria === 'personal' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Desarrollo Personal
            </button>
            <button 
              onClick={() => setSubTabMentoria('empleabilidad')} 
              className={`pb-4 px-6 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${subTabMentoria === 'empleabilidad' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Empleabilidad
            </button>
          </div>

          {/* Sub-tab: Desarrollo Personal (Formulario de Email a Sergio) */}
          {subTabMentoria === 'personal' && (
            <div className="bg-[#001a17] p-8 rounded-3xl border border-purple-400/20 shadow-xl flex flex-col md:flex-row gap-10">
              <div className="md:w-1/3">
                <div className="w-16 h-16 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-400/30">
                  <span className="text-3xl">🧘‍♂️</span>
                </div>
                <h4 className="text-2xl font-black text-white mb-2">Desarrollo Personal</h4>
                <p className="text-gray-400 text-sm mb-4">¿Sientes que necesitas orientación extra, apoyo para gestionar el estrés o hablar sobre tu motivación en el campus?</p>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest border border-purple-400/20 bg-purple-400/5 p-3 rounded-xl">Mensaje directo y confidencial a Sergio Pérez.</p>
              </div>

              <div className="md:w-2/3 bg-black/30 p-6 rounded-2xl border border-white/5">
                <form onSubmit={handleEnviarMensaje} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tu Mensaje</label>
                    <textarea 
                      rows="5" 
                      value={mensajeMentoria}
                      onChange={(e) => setMensajeMentoria(e.target.value)}
                      placeholder="Hola Sergio, me gustaría concertar una sesión para hablar sobre..."
                      className="w-full bg-[#00241f] border border-gray-600 rounded-xl p-4 text-white outline-none focus:border-purple-400 resize-none transition-colors"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-purple-500 text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-purple-400 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    Enviar a Sergio
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Sub-tab: Empleabilidad */}
          {subTabMentoria === 'empleabilidad' && (
            <div className="bg-[#001a17] p-8 rounded-3xl border border-white/10 shadow-xl text-center">
               <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
                  <span className="text-3xl">🚀</span>
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
