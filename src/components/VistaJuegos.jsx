import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, query, onSnapshot, orderBy, limit, serverTimestamp } from 'firebase/firestore';

function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  // Estados del juego
  const [jugando, setJugando] = useState(false);
  const [tiempo, setTiempo] = useState(10);
  const [puntos, setPuntos] = useState(0);
  const [ranking, setRanking] = useState([]);

  // Cargar el ranking en tiempo real desde Firebase
  useEffect(() => {
    const q = query(collection(db, "ranking_juegos"), orderBy("puntuacion", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datosRanking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRanking(datosRanking);
    });
    return () => unsubscribe();
  }, []);

  // Lógica del temporizador del juego
  useEffect(() => {
    let intervalo;
    if (jugando && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((prev) => prev - 1);
      }, 1000);
    } else if (tiempo === 0 && jugando) {
      setJugando(false);
      guardarPuntuacion(puntos);
    }
    return () => clearInterval(intervalo);
  }, [jugando, tiempo]);

  const iniciarJuego = () => {
    setPuntos(0);
    setTiempo(10);
    setJugando(true);
  };

  const hacerClick = () => {
    if (jugando) {
      setPuntos((prev) => prev + 1);
    }
  };

  // Guardar puntuación en Firebase (solo si superas tu propio récord)
  const guardarPuntuacion = async (puntuacionFinal) => {
    if (puntuacionFinal === 0) return;
    
    // Usamos el nombre de usuario como ID para que solo haya una entrada por persona
    const docRef = doc(db, "ranking_juegos", nombreUsuario);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().puntuacion < puntuacionFinal) {
      await setDoc(docRef, {
        nombre: nombreUsuario,
        puntuacion: puntuacionFinal,
        avatar: getAvatarUrl(avatarConfig),
        fecha: serverTimestamp()
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Inicio
        </button>
        <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Retos y Juegos
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ZONA DE JUEGO (Izquierda) */}
        <div className="lg:col-span-7 bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${(tiempo / 10) * 100}%` }}></div>
          </div>

          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Ciber-Reto</h3>
          <p className="text-gray-400 text-sm mb-8 text-center">Demuestra tu velocidad de "hackeo". Tienes 10 segundos para hacer clic tantas veces como puedas.</p>

          <div className="text-center mb-8">
            <div className="text-5xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {puntos} pts
            </div>
            <div className={`text-xl font-bold ${tiempo <= 3 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
              00:{tiempo < 10 ? `0${tiempo}` : tiempo}
            </div>
          </div>

          {!jugando && tiempo === 10 && (
            <button onClick={iniciarJuego} className="bg-emerald-400 text-black font-black px-10 py-4 rounded-full hover:bg-emerald-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] uppercase tracking-widest">
              Iniciar Hackeo
            </button>
          )}

          {!jugando && tiempo === 0 && (
            <div className="flex flex-col items-center gap-4">
              <span className="text-white font-bold bg-white/10 px-4 py-2 rounded-lg">¡Tiempo agotado! Has hecho {puntos} clics.</span>
              <button onClick={iniciarJuego} className="bg-cyan-400 text-black font-black px-8 py-3 rounded-full hover:bg-cyan-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] uppercase tracking-widest text-sm">
                Volver a intentar
              </button>
            </div>
          )}

          {jugando && (
            <button 
              onClick={hacerClick} 
              className="w-40 h-40 bg-gray-900 border-4 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:bg-gray-800 hover:scale-95 active:scale-90 transition-all select-none"
            >
              <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            </button>
          )}
        </div>

        {/* ZONA DE RANKING (Derecha) */}
        <div className="lg:col-span-5 bg-[#00241f] rounded-3xl border border-emerald-400/20 shadow-xl overflow-hidden flex flex-col">
          <div className="bg-[#001a17] p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-white uppercase tracking-widest flex items-center gap-2">
              🏆 Ranking Global
            </h3>
            <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-400/30">TOP 10</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {ranking.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <p className="text-sm">Aún no hay puntuaciones. ¡Juega para ser el número 1!</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {ranking.map((usuario, index) => (
                  <li 
                    key={usuario.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${usuario.nombre === nombreUsuario ? 'bg-emerald-400/10 border border-emerald-400/30' : 'hover:bg-white/5'}`}
                  >
                    <div className="w-8 text-center flex-shrink-0">
                      {index === 0 ? <span className="text-2xl drop-shadow-md">🥇</span> : 
                       index === 1 ? <span className="text-2xl drop-shadow-md">🥈</span> : 
                       index === 2 ? <span className="text-2xl drop-shadow-md">🥉</span> : 
                       <span className="text-gray-500 font-black">#{index + 1}</span>}
                    </div>
                    
                    <img src={usuario.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/10 bg-gray-800" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-sm truncate ${usuario.nombre === nombreUsuario ? 'text-emerald-400' : 'text-white'}`}>
                        {usuario.nombre} {usuario.nombre === nombreUsuario && "(Tú)"}
                      </h4>
                    </div>
                    
                    <div className="font-black text-cyan-400 text-lg">
                      {usuario.puntuacion}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default VistaJuegos;
