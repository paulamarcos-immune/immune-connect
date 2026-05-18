import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, query, onSnapshot, orderBy, limit, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';

// ==========================================
// 1. MINIJUEGO: CIBER-CLICKER (Tu juego original)
// ==========================================
function JuegoClicker({ nombreUsuario, avatarConfig, getAvatarUrl, volver }) {
  const [jugando, setJugando] = useState(false);
  const [tiempo, setTiempo] = useState(10);
  const [puntos, setPuntos] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "ranking_global"), orderBy("puntuacion", "desc"), limit(25));
    const unsubscribeRanking = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRanking(docs);
    });

    const cargarIntentos = async () => {
      if (!nombreUsuario) return;
      const docRef = doc(db, "intentos_usuarios", nombreUsuario);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIntentosRestantes(docSnap.data().intentos);
      } else {
        await setDoc(docRef, { intentos: 2 });
        setIntentosRestantes(2);
      }
    };
    cargarIntentos();
    return () => unsubscribeRanking();
  }, [nombreUsuario]);

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

  const finalizarPartida = async () => {
    try {
      await addDoc(collection(db, "ranking_global"), {
        nombre: nombreUsuario,
        puntuacion: puntos,
        avatar: getAvatarUrl(avatarConfig),
        fecha: serverTimestamp()
      });
      const nuevosIntentos = intentosRestantes - 1;
      setIntentosRestantes(nuevosIntentos);
      await updateDoc(doc(db, "intentos_usuarios", nombreUsuario), { intentos: nuevosIntentos });
    } catch (e) {
      console.error("Error al guardar partida:", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
      {/* PANEL DE JUEGO */}
      <div className="lg:col-span-7 bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
        <button onClick={volver} className="absolute top-6 left-6 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest">&larr; Menú</button>
        
        <div className="absolute top-6 right-8 text-right">
           <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Vidas Diarias</p>
           <div className="flex gap-1 justify-end mt-1">
             {[...Array(2)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full ${i < intentosRestantes ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-800'}`}></div>
             ))}
           </div>
        </div>

        <div className="text-center my-10">
          <div className="text-6xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">{puntos}</div>
          <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Puntos</p>
        </div>

        {!jugando && (
          <div className="flex flex-col items-center gap-4">
            {intentosRestantes > 0 ? (
              <button onClick={() => {setPuntos(0); setTiempo(10); setJugando(true);}} className="bg-emerald-400 text-black font-black px-10 py-4 rounded-full hover:scale-105 transition-all shadow-xl uppercase tracking-widest">
                {intentosRestantes === 2 ? 'Empezar Hack' : 'Último Intento'}
              </button>
            ) : (
              <div className="text-center bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Fin de los intentos</p>
                <p className="text-gray-500 text-xs mt-2">Vuelve mañana para seguir escalando.</p>
              </div>
            )}
          </div>
        )}

        {jugando && (
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setPuntos(prev => prev + 1)} 
              className="w-40 h-40 bg-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-90 transition-transform select-none border-[8px] border-black text-black font-black text-xl italic"
            >
              HACK!
            </button>
            <div className="text-2xl font-black text-white italic">00:{tiempo < 10 ? `0${tiempo}` : tiempo}</div>
          </div>
        )}
      </div>

      {/* RANKING GLOBAL */}
      <div className="lg:col-span-5 bg-[#00241f] rounded-3xl border border-emerald-400/20 shadow-xl overflow-hidden flex flex-col h-[500px]">
        <div className="bg-[#001a17] p-6 border-b border-white/5">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm">🏆 Top Hackers</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20">
          {ranking.length === 0 ? (
            <p className="text-center text-gray-500 text-sm mt-10">Esperando primeras puntuaciones...</p>
          ) : (
            ranking.map((res, index) => (
              <div key={res.id} className={`flex items-center gap-4 p-3 rounded-xl mb-2 ${res.nombre === nombreUsuario ? 'bg-emerald-400/10 border border-emerald-400/20' : 'bg-[#001a17]'}`}>
                <span className="text-xs font-bold text-gray-500 w-4">{index + 1}º</span>
                <img src={res.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-800 border border-white/5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{res.nombre}</h4>
                </div>
                <div className="text-emerald-400 font-black text-lg">{res.puntuacion}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MINIJUEGO: REFLEJOS DE CPU
// ==========================================
function JuegoReflejos({ volver }) {
  const [estado, setEstado] = useState('inicio'); // inicio, esperando, verde, resultado
  const [tiempoReaccion, setTiempoReaccion] = useState(null);
  const [tiempoInicio, setTiempoInicio] = useState(0);

  const iniciarJuego = () => {
    setEstado('esperando');
    setTiempoReaccion(null);
    const tiempoRandom = Math.floor(Math.random() * 3000) + 2000; // Entre 2 y 5 segundos
    setTimeout(() => {
      setEstado(prev => {
        if (prev === 'esperando') {
          setTiempoInicio(Date.now());
          return 'verde';
        }
        return prev;
      });
    }, tiempoRandom);
  };

  const hacerClic = () => {
    if (estado === 'esperando') {
      setEstado('inicio');
      alert("¡Demasiado pronto! Tienes que esperar al verde.");
    } else if (estado === 'verde') {
      const reaccion = Date.now() - tiempoInicio;
      setTiempoReaccion(reaccion);
      setEstado('resultado');
    }
  };

  return (
    <div className="bg-[#001a17] rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[500px] relative animate-in fade-in">
      <button onClick={volver} className="absolute top-6 left-6 text-gray-500 hover:text-white text-xs font-bold uppercase">&larr; Menú</button>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-2">Reflejos de CPU</h2>
        <p className="text-gray-400 text-sm">Haz clic en el cuadrado en cuanto se ponga VERDE.</p>
      </div>

      {estado === 'inicio' || estado === 'resultado' ? (
        <div className="flex flex-col items-center gap-6">
          {estado === 'resultado' && (
            <div className="text-center bg-cyan-400/10 p-6 rounded-2xl border border-cyan-400/30">
              <p className="text-gray-400 text-xs uppercase mb-1">Tu tiempo de reacción</p>
              <p className="text-4xl font-black text-cyan-400">{tiempoReaccion} ms</p>
            </div>
          )}
          <button onClick={iniciarJuego} className="bg-cyan-400 text-black font-black px-10 py-4 rounded-full uppercase tracking-widest hover:scale-105 transition">
            {estado === 'inicio' ? 'Empezar Test' : 'Intentarlo de nuevo'}
          </button>
        </div>
      ) : (
        <div 
          onClick={hacerClic}
          className={`w-64 h-64 rounded-3xl cursor-pointer flex items-center justify-center transition-colors duration-100 ${estado === 'esperando' ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]'}`}
        >
          <p className="text-white font-black text-xl uppercase tracking-widest select-none">
            {estado === 'esperando' ? 'Espera...' : '¡AHORA!'}
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MINIJUEGO: DESCIFRA EL CÓDIGO
// ==========================================
function JuegoCodigo({ volver }) {
  const [numeroSecreto, setNumeroSecreto] = useState(Math.floor(Math.random() * 100) + 1);
  const [intento, setIntento] = useState('');
  const [mensaje, setMensaje] = useState('Adivina el código (del 1 al 100)');
  const [intentosRealizados, setIntentosRealizados] = useState(0);
  const [ganado, setGanado] = useState(false);

  const comprobarCodigo = (e) => {
    e.preventDefault();
    const num = parseInt(intento);
    if (isNaN(num)) return;

    setIntentosRealizados(prev => prev + 1);

    if (num === numeroSecreto) {
      setMensaje(`¡ACCESO CONCEDIDO!`);
      setGanado(true);
    } else if (num < numeroSecreto) {
      setMensaje(`El código secreto es MAYOR que ${num}`);
    } else {
      setMensaje(`El código secreto es MENOR que ${num}`);
    }
    setIntento('');
  };

  const reiniciarJuego = () => {
    setNumeroSecreto(Math.floor(Math.random() * 100) + 1);
    setMensaje('Adivina el código (del 1 al 100)');
    setIntentosRealizados(0);
    setGanado(false);
  };

  return (
    <div className="bg-[#001a17] rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[500px] relative animate-in fade-in">
      <button onClick={volver} className="absolute top-6 left-6 text-gray-500 hover:text-white text-xs font-bold uppercase">&larr; Menú</button>

      <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/50">
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>

      <h2 className="text-2xl font-black text-purple-400 uppercase tracking-widest mb-6">Brecha de Seguridad</h2>
      
      <div className={`p-4 rounded-xl border mb-8 text-center min-w-[250px] ${ganado ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400' : 'bg-black/50 border-white/10 text-gray-300'}`}>
        <p className="font-bold">{mensaje}</p>
        <p className="text-xs mt-2 opacity-50">Intentos: {intentosRealizados}</p>
      </div>

      {!ganado ? (
        <form onSubmit={comprobarCodigo} className="flex gap-4">
          <input 
            type="number" 
            value={intento} 
            onChange={(e) => setIntento(e.target.value)} 
            className="bg-[#00241f] border border-gray-600 rounded-xl px-4 py-3 text-center text-white outline-none focus:border-purple-400 w-32 font-bold text-xl"
            placeholder="00"
            autoFocus
          />
          <button type="submit" className="bg-purple-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-400 transition">
            Probar
          </button>
        </form>
      ) : (
        <button onClick={reiniciarJuego} className="bg-purple-500 text-white font-bold px-8 py-3 rounded-full hover:bg-purple-400 transition shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          Nuevo Código
        </button>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL (HUB DE JUEGOS)
// ==========================================
function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [juegoElegido, setJuegoElegido] = useState(null); // null = Menú, 'clicker', 'reflejos', 'codigo'

  // Si hay un juego elegido, mostramos el componente correspondiente
  if (juegoElegido === 'clicker') return <JuegoClicker nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} volver={() => setJuegoElegido(null)} />;
  if (juegoElegido === 'reflejos') return <JuegoReflejos volver={() => setJuegoElegido(null)} />;
  if (juegoElegido === 'codigo') return <JuegoCodigo volver={() => setJuegoElegido(null)} />;

  // Si no hay juego elegido, mostramos el Menú Principal (Hub estilo LinkedIn)
  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Inicio
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">IMMUNE Arcade</h3>
        <p className="text-gray-300 text-sm uppercase tracking-widest relative z-10">Juegos rápidos para despejar la mente.</p>
      </div>

      {/* TARJETAS DE SELECCIÓN DE JUEGOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Clicker */}
        <div onClick={() => setJuegoElegido('clicker')} className="bg-[#001a17] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-emerald-400/50 hover:bg-[#00241f] transition duration-300 group shadow-lg">
          <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <span className="text-xl">🖱️</span>
          </div>
          <h4 className="text-white font-black uppercase text-lg mb-2">Ciber-Clicker</h4>
          <p className="text-gray-500 text-xs mb-6 h-10">Pon a prueba tu APM (Acciones por Minuto). Tienes 10 segundos. Compite en el ranking global.</p>
          <button className="w-full py-2 rounded-lg bg-white/5 text-emerald-400 text-xs font-bold uppercase tracking-widest group-hover:bg-emerald-400 group-hover:text-black transition">Jugar Ahora</button>
        </div>

        {/* Tarjeta 2: Reflejos */}
        <div onClick={() => setJuegoElegido('reflejos')} className="bg-[#001a17] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-cyan-400/50 hover:bg-[#00241f] transition duration-300 group shadow-lg">
          <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <span className="text-xl">⚡</span>
          </div>
          <h4 className="text-white font-black uppercase text-lg mb-2">Reflejos CPU</h4>
          <p className="text-gray-500 text-xs mb-6 h-10">Mide tu tiempo de reacción al milisegundo. Haz clic en el momento exacto en que la pantalla se ponga verde.</p>
          <button className="w-full py-2 rounded-lg bg-white/5 text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:bg-cyan-400 group-hover:text-black transition">Jugar Ahora</button>
        </div>

        {/* Tarjeta 3: Lógica */}
        <div onClick={() => setJuegoElegido('codigo')} className="bg-[#001a17] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-purple-400/50 hover:bg-[#00241f] transition duration-300 group shadow-lg">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <span className="text-xl">🔐</span>
          </div>
          <h4 className="text-white font-black uppercase text-lg mb-2">Brecha de Seguridad</h4>
          <p className="text-gray-500 text-xs mb-6 h-10">Ponte el sombrero de hacker. Encuentra el código numérico secreto usando lógica de descarte.</p>
          <button className="w-full py-2 rounded-lg bg-white/5 text-purple-400 text-xs font-bold uppercase tracking-widest group-hover:bg-purple-500 group-hover:text-white transition">Jugar Ahora</button>
        </div>

      </div>
    </div>
  );
}

export default VistaJuegos;
