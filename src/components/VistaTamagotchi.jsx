import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function VistaTamagotchi({ nombreUsuario, setVistaActiva }) {
  const [stats, setStats] = useState(null);
  const [estadoCara, setEstadoCara] = useState('feliz'); // feliz, triste, dormido, critico, comiendo
  const [cargando, setCargando] = useState(true);
  const [animacion, setAnimacion] = useState('');

  // Cargar mascota al montar
  useEffect(() => {
    const cargarMascota = async () => {
      if (!nombreUsuario) return;
      const ref = doc(db, "mascotas_usuarios", nombreUsuario);
      const snap = await getDoc(ref);

      const ahora = Date.now();

      if (snap.exists()) {
        const data = snap.data();
        // Calcular horas pasadas desde la última interacción
        const horasPasadas = (ahora - data.lastUpdate) / (1000 * 60 * 60);
        
        // Cada hora baja 2 puntos de todo (ajustable)
        const desgaste = Math.floor(horasPasadas * 2);

        const nuevasStats = {
          bateria: Math.max(0, data.bateria - desgaste),
          energia: Math.max(0, data.energia - desgaste),
          felicidad: Math.max(0, data.felicidad - desgaste),
          limpieza: Math.max(0, data.limpieza - desgaste),
          lastUpdate: ahora
        };

        setStats(nuevasStats);
        evaluarEstado(nuevasStats);
        // Actualizamos la base de datos con el desgaste
        if (desgaste > 0) await updateDoc(ref, nuevasStats);

      } else {
        // Mascota nueva
        const inicial = { bateria: 100, energia: 100, felicidad: 100, limpieza: 100, lastUpdate: ahora };
        await setDoc(ref, inicial);
        setStats(inicial);
        setEstadoCara('feliz');
      }
      setCargando(false);
    };

    cargarMascota();
  }, [nombreUsuario]);

  const evaluarEstado = (s) => {
    if (s.bateria === 0 || s.energia === 0 || s.felicidad === 0 || s.limpieza === 0) setEstadoCara('critico');
    else if (s.energia < 30) setEstadoCara('dormido');
    else if (s.bateria < 40 || s.felicidad < 40) setEstadoCara('triste');
    else setEstadoCara('feliz');
  };

  const interactuar = async (tipo) => {
    if (!stats) return;
    let s = { ...stats, lastUpdate: Date.now() };

    setAnimacion('scale-110');
    setTimeout(() => setAnimacion(''), 200);

    if (tipo === 'alimentar') {
      s.bateria = Math.min(100, s.bateria + 30);
      s.limpieza = Math.max(0, s.limpieza - 10);
      setEstadoCara('comiendo');
      setTimeout(() => evaluarEstado(s), 2000);
    } 
    else if (tipo === 'jugar') {
      s.felicidad = Math.min(100, s.felicidad + 40);
      s.energia = Math.max(0, s.energia - 20);
      s.bateria = Math.max(0, s.bateria - 10);
    } 
    else if (tipo === 'dormir') {
      s.energia = Math.min(100, s.energia + 50);
      s.bateria = Math.max(0, s.bateria - 10);
      setEstadoCara('dormido');
      setTimeout(() => evaluarEstado(s), 2000);
    } 
    else if (tipo === 'limpiar') {
      s.limpieza = 100;
    }

    setStats(s);
    evaluarEstado(s);
    
    // Guardar en Firebase
    await updateDoc(doc(db, "mascotas_usuarios", nombreUsuario), s);
  };

  if (cargando) return <div className="text-emerald-400 text-center mt-20 font-bold tracking-widest uppercase">Iniciando sistema de mascota...</div>;

  // Renderizado del SVG según el estado
  const renderCara = () => {
    switch(estadoCara) {
      case 'feliz': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'triste': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14.25c1.5-1 4.5-1 6 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'dormido': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10l2-2m-2 0l2 2m4-2l2-2m-2 0l2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'comiendo': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h.01M15 10h.01M12 14c-1.5 0-3 .5-3 1.5s1.5 1.5 3 1.5 3-.5 3-1.5-1.5-1.5-3-1.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'critico': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
      default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  const getBarColor = (val) => {
    if (val > 60) return 'bg-emerald-400';
    if (val > 30) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto space-y-6 pb-10 px-4">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm uppercase tracking-widest">
          &larr; Volver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* PANTALLA DEL BIT */}
        <div className="md:col-span-7 bg-[#001a17] rounded-3xl border border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] p-8 flex flex-col items-center justify-center relative min-h-[400px] overflow-hidden">
          
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
          
          <h3 className="absolute top-6 left-6 font-black text-emerald-400 uppercase tracking-widest text-sm">Bit - Unidad 01</h3>

          <div className={`relative transition-transform duration-300 ${animacion}`}>
            {/* Holograma Effect */}
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse"></div>
            
            {/* Mascota SVG */}
            <svg className={`w-48 h-48 relative z-10 animate-[bounce_3s_ease-in-out_infinite] ${estadoCara === 'critico' ? 'text-red-500' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {renderCara()}
            </svg>
          </div>

          <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-bold">Estado del sistema: <span className={estadoCara === 'critico' ? 'text-red-500' : 'text-emerald-400'}>{estadoCara}</span></p>
        </div>

        {/* CONTROLES Y ESTADÍSTICAS */}
        <div className="md:col-span-5 bg-[#00241f] rounded-3xl border border-white/10 p-6 flex flex-col justify-between">
          
          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-4">Métricas del Núcleo</h4>
            
            {/* Batería */}
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-gray-400">Batería (Hambre)</span>
                <span className="text-white">{stats.bateria}%</span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-500 ${getBarColor(stats.bateria)}`} style={{ width: `${stats.bateria}%` }}></div>
              </div>
            </div>

            {/* Energía */}
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-gray-400">CPU (Energía)</span>
                <span className="text-white">{stats.energia}%</span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-500 ${getBarColor(stats.energia)}`} style={{ width: `${stats.energia}%` }}></div>
              </div>
            </div>

            {/* Felicidad */}
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-gray-400">RAM (Felicidad)</span>
                <span className="text-white">{stats.felicidad}%</span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-500 ${getBarColor(stats.felicidad)}`} style={{ width: `${stats.felicidad}%` }}></div>
              </div>
            </div>

            {/* Limpieza */}
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-gray-400">Caché (Higiene)</span>
                <span className="text-white">{stats.limpieza}%</span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-500 ${getBarColor(stats.limpieza)}`} style={{ width: `${stats.limpieza}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => interactuar('alimentar')} className="bg-[#001a17] border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400 hover:text-black py-4 rounded-xl flex flex-col items-center gap-2 transition group active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Cargar Datos</span>
            </button>

            <button onClick={() => interactuar('jugar')} className="bg-[#001a17] border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-black py-4 rounded-xl flex flex-col items-center gap-2 transition group active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Compilar Juego</span>
            </button>

            <button onClick={() => interactuar('dormir')} className="bg-[#001a17] border border-purple-400/30 text-purple-400 hover:bg-purple-400 hover:text-black py-4 rounded-xl flex flex-col items-center gap-2 transition group active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Suspender</span>
            </button>

            <button onClick={() => interactuar('limpiar')} className="bg-[#001a17] border border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-black py-4 rounded-xl flex flex-col items-center gap-2 transition group active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Limpiar Caché</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
