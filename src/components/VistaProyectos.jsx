import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function VistaProyectos({ nombreUsuario, avatarConfig, getAvatarUrl, defaultTab = "tech" }) {
  const [proyectos, setProyectos] = useState([]);
  const [nuevaIdea, setNuevaIdea] = useState("");
  const [tecnologia, setTecnologia] = useState("Python");
  
  // Usamos el tab que nos pasen por defecto (tech o sos)
  const [tabActiva, setTabActiva] = useState(defaultTab);

  // Si cambia el prop defaultTab desde fuera, actualizamos la vista
  useEffect(() => {
    setTabActiva(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const q = query(collection(db, "proyectos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProyectos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const publicarProyecto = async (e) => {
    e.preventDefault();
    if (!nuevaIdea.trim()) return;
    await addDoc(collection(db, "proyectos"), {
      creador: nombreUsuario,
      descripcion: nuevaIdea,
      tecnologia: tecnologia,
      avatar: getAvatarUrl(avatarConfig),
      fecha: serverTimestamp(),
      estado: tabActiva === "tech" ? "Buscando equipo" : "Necesito ayuda",
      tipo: tabActiva
    });
    setNuevaIdea("");
  };

  const itemsFiltrados = proyectos.filter(p => tabActiva === "tech" ? (!p.tipo || p.tipo === "tech") : p.tipo === "sos");

  return (
    <div className="animate-in fade-in duration-300 space-y-6 max-w-4xl mx-auto pb-10">
      
      <div className="flex bg-[#001a17] rounded-xl p-1 border border-white/5">
        <button onClick={() => setTabActiva("tech")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${tabActiva === "tech" ? "bg-emerald-400 text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>
          Proyectos Tech
        </button>
        <button onClick={() => setTabActiva("sos")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${tabActiva === "sos" ? "bg-cyan-400 text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>
          S.O.S Académico
        </button>
      </div>

      <div className="bg-[#001a17]/80 p-6 rounded-3xl shadow-lg border border-white/5">
        <h3 className="text-white font-bold mb-4">
          {tabActiva === "tech" ? "¿Tienes una idea o buscas equipo para un Hackathon?" : "¿Atascado con alguna asignatura? Pide ayuda a tus compañeros"}
        </h3>
        <form onSubmit={publicarProyecto} className="flex flex-col gap-4">
          <textarea 
            value={nuevaIdea} onChange={(e) => setNuevaIdea(e.target.value)}
            placeholder={tabActiva === "tech" ? "Ej: Busco experto en Python para un side-project sobre IA..." : "Ej: ¿Alguien que domine React me puede explicar los hooks? A cambio le ayudo..."}
            className="bg-[#00241f] text-white p-4 rounded-xl border border-gray-700 outline-none focus:border-emerald-400 resize-none h-24 text-sm transition"
          />
          <div className="flex justify-between items-center">
            <select value={tecnologia} onChange={(e) => setTecnologia(e.target.value)} className="bg-[#00241f] text-white px-4 py-2 rounded-lg border border-gray-700 text-sm outline-none focus:border-emerald-400">
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
              <option value="Data Science">Data Science</option>
              {tabActiva === "sos" && <option value="Matemáticas">Matemáticas</option>}
            </select>
            <button type="submit" className={`font-bold px-6 py-2 rounded-lg transition text-sm uppercase tracking-widest text-black ${tabActiva === "tech" ? "bg-emerald-400 hover:bg-emerald-300" : "bg-cyan-400 hover:bg-cyan-300"}`}>
              {tabActiva === "tech" ? "Publicar Idea" : "Pedir Ayuda"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemsFiltrados.map((proj) => (
          <div key={proj.id} className="bg-[#001a17]/80 p-5 rounded-3xl border border-white/5 hover:border-emerald-400/30 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={proj.avatar} alt="creador" className="w-10 h-10 rounded-full border border-emerald-400 bg-gray-800" />
                <div>
                  <h4 className="font-bold text-sm text-white">{proj.creador}</h4>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${tabActiva === "tech" ? "text-emerald-400 bg-emerald-400/10" : "text-cyan-400 bg-cyan-400/10"}`}>{proj.tecnologia}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-6">{proj.descripcion}</p>
            </div>
            <button className={`w-full border py-2 rounded-xl text-xs font-bold transition uppercase tracking-widest ${tabActiva === "tech" ? "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black" : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"}`}>Contactar</button>
          </div>
        ))}
        {itemsFiltrados.length === 0 && <div className="col-span-1 md:col-span-2 text-center text-gray-500 py-10">Aún no hay publicaciones aquí.</div>}
      </div>
    </div>
  );
}

export default VistaProyectos;