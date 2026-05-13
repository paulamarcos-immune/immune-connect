import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, query, onSnapshot, orderBy, limit, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';

function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [jugando, setJugando] = useState(false);
  const [tiempo, setTiempo] = useState(10);
  const [puntos, setPuntos] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(null);

  // 1. Cargar el Ranking y los Intentos del usuario al entrar
  useEffect(() => {
    // Ranking en tiempo real (mostramos los mejores resultados de todos)
    const q = query(collection(db, "ranking_global"), orderBy("puntuacion", "desc"), limit(20));
    const unsubscribeRanking = onSnapshot(q, (snapshot) => {
      setRanking(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Cargar intentos restantes del usuario
    const cargarIntentos = async () => {
      const docRef = doc(db, "intentos_usuarios", nombreUsuario);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIntentosRestantes(docSnap.data().intentos);
      } else {
        // Si es la primera vez que entra, le damos 2 intentos
        await setDoc(docRef, { intentos: 2 });
        setIntentosRestantes(2);
      }
    };

    cargarIntentos();
    return () => unsubscribeRanking();
  }, [nombreUsuario]);

  // 2. Lógica del juego (Temporizador)
  useEffect(() => {
    let intervalo;
    if (jugando && tiempo > 0) {
      intervalo = setInterval(() => setTiempo((prev) => prev - 1), 1000);
    } else if (tiempo === 0 && jugando) {
      setJugando(false);
      finalizarPartida();
    }
    return () => clearInterval(intervalo);
  }, [jugando, tiempo]);

  const iniciarJuego = () => {
    if (intentosRestantes > 0) {
      setPuntos(0);
      setTiempo(10);
      setJugando(true);
    }
  };

  const finalizarPartida = async () => {
    // Registramos la puntuación SIEMPRE (aunque sea 0)
    await addDoc(collection(db, "ranking_global"), {
      nombre: nombreUsuario,
      puntuacion: puntos,
      avatar: getAvatarUrl(avatarConfig),
      fecha: serverTimestamp()
    });

    // Restamos un intento en Firebase
    const nuevosIntentos = intentosRestantes - 1;
    setIntentosRestantes(nuevosIntentos);
    const docRef = doc(db, "intentos_usuarios", nombreUsuario);
    await updateDoc(docRef, { intentos: nuevosIntentos });
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Inicio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL DE JUEGO */}
        <div className="lg:col-span-7 bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          
          {/* Contador de intentos arriba a la derecha */}
          <div className="absolute top-6 right-8 text-right">
             <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Intentos restantes</p>
             <div className="flex gap-1 justify-end mt-1">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < intentosRestantes ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-gray-800'}`}></div>
                ))}
             </div>
          </div>

          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Fast Hack</h3>
          
          <div className="text-center my-10">
            <div className="text-6xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {puntos}
            </div>
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Clicks registrados</p>
          </div>

          {/* MENSAJES Y BOTONES */}
          {!jugando && (
            <div className="flex flex-col items-center gap-4">
              {intentosRestantes > 0 ? (
                <>
                  <p className="text-gray-400 text-xs mb-2">Tienes 10 segundos. ¿Preparado?</p>
                  <button onClick={iniciarJuego} className="bg-emerald-400 text-black font-black px-10 py-4 rounded-full hover:scale-105 transition-all shadow-xl uppercase tracking-widest">
                    {intentosRestantes === 2 ? 'Empezar Reto' : 'Último Intento'}
                  </button>
                </>
              ) : (
                <div className="text-center bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                  <p className="text-red-400 font-bold uppercase tracking-widest text-sm mb-1">Juego Terminado</p>
                  <p className="text-gray-500 text-xs">Has agotado tus 2 intentos permitidos.</p>
                </div>
              )}
            </div>
          )}

          {jugando && (
            <button 
              onClick={() => setPuntos(prev => prev + 1)} 
              className="w-44 h-44 bg-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-90 transition-transform select-none border-[8px] border-black"
            >
              <span className="text-black font-black text-xl italic">HACK!</span>
            </button>
          )}

          {jugando && (
            <div className="mt-8 text-2xl font-black text-white italic">
               00:{tiempo < 10 ? `0${tiempo}` : tiempo}
            </div>
          )}
        </div>

        {/* RANKING GLOBAL (Historial de todos los intentos) */}
        <div className="lg:col-span-5 bg-[#00241f] rounded-3xl border border-emerald-400/20 shadow-xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-[#001a17] p-6 border-b border-white/5">
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">
              🚀 Registro de Intentos
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {ranking.map((res, index) => (
              <div 
                key={res.id} 
                className={`flex items-center gap-4 p-3 rounded-xl mb-2 ${res.nombre === nombreUsuario ? 'bg-cyan-400/10 border border-cyan-400/20' : 'bg-black/20'}`}
              >
                <img src={res.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-800" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">{res.nombre}</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter">
                    {res.fecha ? new Date(res.fecha.seconds * 1000).toLocaleTimeString() : 'Recién jugado'}
                  </p>
                </div>
                <div className="text-emerald-400 font-black text-lg">
                  {res.puntuacion} <span className="text-[10px] text-gray-600">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default VistaJuegos;
