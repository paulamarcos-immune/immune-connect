import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, query, onSnapshot, orderBy, limit, serverTimestamp, addDoc } from 'firebase/firestore';

// ==========================================
// 🎮 CATÁLOGO DE 10 MINIJUEGOS (MEMORIA)
// ==========================================

// 1. Clicker
function JuegoClicker({ onFinish }) {
  const [jugando, setJugando] = useState(false);
  const [tiempo, setTiempo] = useState(10);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    let int;
    if (jugando && tiempo > 0) int = setInterval(() => setTiempo(t => t - 1), 1000);
    else if (tiempo === 0 && jugando) { setJugando(false); onFinish(puntos); }
    return () => clearInterval(int);
  }, [jugando, tiempo]);

  return (
    <div className="text-center flex flex-col items-center gap-6">
      <h3 className="text-xl font-black text-emerald-400">Ciber-Clicker</h3>
      {!jugando && tiempo === 10 ? (
        <button onClick={() => setJugando(true)} className="bg-emerald-400 text-black px-8 py-3 rounded-full font-black uppercase">Empezar</button>
      ) : (
        <>
          <div className="text-4xl font-black">{puntos} pts</div>
          <button onClick={() => setPuntos(p => p + 10)} disabled={!jugando} className="w-32 h-32 bg-emerald-400 rounded-full font-black text-black text-2xl active:scale-90 shadow-[0_0_30px_rgba(16,185,129,0.5)]">HACK!</button>
          <div className="text-xl font-bold">00:{tiempo < 10 ? `0${tiempo}` : tiempo}</div>
        </>
      )}
    </div>
  );
}

// 2. Reflejos
function JuegoReflejos({ onFinish }) {
  const [estado, setEstado] = useState('inicio'); 
  const [tInicio, setTInicio] = useState(0);

  const iniciar = () => {
    setEstado('esperando');
    setTimeout(() => { setTInicio(Date.now()); setEstado('verde'); }, Math.floor(Math.random() * 3000) + 2000);
  };
  const clic = () => {
    if (estado === 'esperando') alert("¡Muy pronto!");
    else if (estado === 'verde') {
      const ms = Date.now() - tInicio;
      const puntos = Math.max(0, 3000 - ms);
      onFinish(puntos);
    }
  };

  return (
    <div className="text-center flex flex-col items-center gap-6">
      <h3 className="text-xl font-black text-cyan-400">Reflejos CPU</h3>
      {estado === 'inicio' ? (
        <button onClick={iniciar} className="bg-cyan-400 text-black px-8 py-3 rounded-full font-black uppercase">Empezar</button>
      ) : (
        <div onClick={clic} className={`w-48 h-48 rounded-2xl cursor-pointer flex items-center justify-center shadow-2xl transition-colors duration-75 ${estado === 'esperando' ? 'bg-red-500' : 'bg-cyan-400 shadow-[0_0_50px_#22d3ee]'}`}>
          <span className={`font-black text-xl ${estado === 'esperando' ? 'text-white' : 'text-black'}`}>{estado === 'esperando' ? 'Espera...' : '¡CLIC AHORA!'}</span>
        </div>
      )}
    </div>
  );
}

// 3. Brecha (Código numérico)
function JuegoCodigo({ onFinish }) {
  const [secreto] = useState(Math.floor(Math.random() * 100) + 1);
  const [intento, setIntento] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [msg, setMsg] = useState('Adivina (1-100)');

  const probar = (e) => {
    e.preventDefault();
    const n = parseInt(intento);
    if (!n) return;
    setIntentos(i => i + 1);
    if (n === secreto) onFinish(Math.max(100, 1000 - (intentos * 100)));
    else setMsg(n < secreto ? 'El código es MAYOR' : 'El código es MENOR');
    setIntento('');
  };

  return (
    <div className="text-center flex flex-col items-center gap-4">
      <h3 className="text-xl font-black text-purple-400">Brecha Numérica</h3>
      <p className="font-bold text-gray-300 bg-black/50 p-4 rounded-xl border border-white/5">{msg}</p>
      <form onSubmit={probar} className="flex gap-2">
        <input type="number" value={intento} onChange={e => setIntento(e.target.value)} autoFocus className="bg-[#00241f] text-center border border-gray-600 rounded-lg px-4 py-2 w-24 outline-none focus:border-purple-400 text-xl font-bold" placeholder="00" />
        <button type="submit" className="bg-purple-500 px-6 rounded-lg font-bold">Probar</button>
      </form>
    </div>
  );
}

// 4. Math Hack (Matemáticas rápidas)
function JuegoMath({ onFinish }) {
  const [a, setA] = useState(0); const [b, setB] = useState(0);
  const [ans, setAns] = useState(''); const [puntos, setPuntos] = useState(0);
  const [tiempo, setTiempo] = useState(15); const [jugando, setJugando] = useState(false);

  const generar = () => { setA(Math.floor(Math.random() * 20)); setB(Math.floor(Math.random() * 20)); setAns(''); };
  
  useEffect(() => {
    let int;
    if (jugando && tiempo > 0) int = setInterval(() => setTiempo(t => t - 1), 1000);
    else if (tiempo === 0 && jugando) { setJugando(false); onFinish(puntos); }
    return () => clearInterval(int);
  }, [jugando, tiempo]);

  const probar = (e) => {
    e.preventDefault();
    if (parseInt(ans) === a + b) { setPuntos(p => p + 100); generar(); }
    else setAns('');
  };

  return (
    <div className="text-center flex flex-col items-center gap-4">
      <h3 className="text-xl font-black text-yellow-400">Math Hack</h3>
      {!jugando && tiempo === 15 ? <button onClick={() => {setJugando(true); generar();}} className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase">Empezar (15s)</button> : (
        <>
          <div className="text-4xl font-black">{a} + {b} = ?</div>
          <form onSubmit={probar}><input autoFocus type="number" value={ans} onChange={e=>setAns(e.target.value)} className="bg-[#00241f] text-center text-3xl p-3 rounded-xl border-2 border-yellow-400 w-32 outline-none font-black" /></form>
          <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Puntos: {puntos} | Tiempo: {tiempo}s</div>
        </>
      )}
    </div>
  );
}

// 5 a 10. Minijuegos rápidos (Micro-juegos)
function JuegoRuleta({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-pink-400 mb-6">Ruleta Cuántica</h3>
      <button onClick={() => onFinish(Math.floor(Math.random() * 1000))} className="bg-pink-500 text-white w-32 h-32 rounded-full font-black hover:scale-110 transition shadow-[0_0_30px_rgba(236,72,153,0.4)] text-xl border-4 border-black">TIRAR</button>
    </div>
  );
}

function JuegoDado({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-white mb-6">Dado Criptográfico</h3>
      <button onClick={() => onFinish((Math.floor(Math.random() * 6) + 1) * 150)} className="bg-white text-black w-24 h-24 rounded-2xl font-black text-sm uppercase tracking-widest hover:rotate-12 transition shadow-[0_0_30px_rgba(255,255,255,0.2)] border-4 border-gray-300">Lanzar</button>
    </div>
  );
}

function JuegoMoneda({ onFinish }) {
  const jugar = (eleccion) => { const result = Math.random() > 0.5 ? 1 : 0; onFinish(eleccion === result ? 500 : 0); };
  return (
    <div className="text-center"><h3 className="text-xl font-black text-orange-400 mb-6">Cara o Cruz</h3>
      <div className="flex gap-4 justify-center">
        <button onClick={() => jugar(1)} className="bg-orange-400 text-black px-8 py-10 rounded-2xl font-black text-xl hover:scale-105 transition shadow-[0_0_20px_rgba(251,146,60,0.3)]">CARA</button>
        <button onClick={() => jugar(0)} className="bg-gray-600 text-white px-8 py-10 rounded-2xl font-black text-xl hover:scale-105 transition shadow-[0_0_20px_rgba(75,85,99,0.3)]">CRUZ</button>
      </div>
    </div>
  );
}

function JuegoBomba({ onFinish }) {
  const cables = [0, 1, 2]; const [bomba] = useState(Math.floor(Math.random() * 3));
  const cortar = (i) => onFinish(i === bomba ? 0 : 400);
  return (
    <div className="text-center"><h3 className="text-xl font-black text-red-500 mb-2">Desactivar Bomba</h3>
      <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-bold">1 explota. 2 son seguros.</p>
      <div className="flex gap-6 justify-center">
        {cables.map(c => <button key={c} onClick={() => cortar(c)} className="w-8 h-32 bg-red-500 hover:bg-red-400 rounded-full border-4 border-black shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors"></button>)}
      </div>
    </div>
  );
}

function JuegoCaja({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-blue-400 mb-6">Loot Box</h3>
      <button onClick={() => onFinish(Math.floor(Math.random() * 800) + 100)} className="bg-blue-500 text-white font-black text-xl px-10 py-10 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110 hover:-rotate-3 transition border-4 border-black">ABRIR CAJA</button>
    </div>
  );
}

function JuegoTyping({ onFinish }) {
  const [txt, setTxt] = useState(''); const [tInicio, setTInicio] = useState(Date.now());
  const probar = (e) => {
    setTxt(e.target.value);
    if (e.target.value.toLowerCase() === "javascript") onFinish(Math.max(0, 2000 - (Date.now() - tInicio)));
  };
  return (
    <div className="text-center"><h3 className="text-xl font-black text-yellow-300 mb-4">Speed Type</h3>
      <p className="mb-4 text-gray-400">Escribe exactamente: <span className="font-mono bg-black p-2 rounded text-yellow-300 font-bold border border-white/10">javascript</span></p>
      <input autoFocus type="text" value={txt} onChange={probar} className="bg-[#00241f] border border-gray-600 px-6 py-4 rounded-xl text-center w-64 text-xl outline-none focus:border-yellow-300 text-white font-mono" />
    </div>
  );
}

// ==========================================
// 🧰 DICCIONARIO DE LOS 10 JUEGOS EN MEMORIA CON ICONOS SVG
// ==========================================
const ALL_GAMES = [
  { id: 'clicker', nombre: 'Ciber-Clicker', color: 'text-emerald-400', comp: JuegoClicker,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg> },
  
  { id: 'reflejos', nombre: 'Reflejos CPU', color: 'text-cyan-400', comp: JuegoReflejos,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  
  { id: 'codigo', nombre: 'Brecha Numérica', color: 'text-purple-400', comp: JuegoCodigo,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  
  { id: 'math', nombre: 'Math Hack', color: 'text-yellow-400', comp: JuegoMath,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
  
  { id: 'ruleta', nombre: 'Ruleta Cuántica', color: 'text-pink-400', comp: JuegoRuleta,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
  
  { id: 'dado', nombre: 'Dado Cripto', color: 'text-white', comp: JuegoDado,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  
  { id: 'moneda', nombre: 'Cara o Cruz', color: 'text-orange-400', comp: JuegoMoneda,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  
  { id: 'bomba', nombre: 'Desactivar Bomba', color: 'text-red-500', comp: JuegoBomba,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> },
  
  { id: 'caja', nombre: 'Loot Box', color: 'text-blue-400', comp: JuegoCaja,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> },
  
  { id: 'typing', nombre: 'Speed Type', color: 'text-yellow-300', comp: JuegoTyping,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 14h6" /></svg> },
];

// ==========================================
// ⚙️ MOTOR DEL JUEGO (Lógica de Intentos Diarios y Rankings Separados)
// ==========================================
function GameEngine({ game, nombreUsuario, avatarConfig, getAvatarUrl, volver }) {
  const [intentos, setIntentos] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Fecha de hoy en formato "YYYY-MM-DD"
  const hoyStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Cargar Ranking específico de este juego
    const q = query(collection(db, `ranking_${game.id}`), orderBy("puntuacion", "desc"), limit(15));
    const unsubs = onSnapshot(q, (snap) => setRanking(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    // 2. Cargar/Resetear Intentos Diarios
    const cargarIntentos = async () => {
      const ref = doc(db, "intentos_juegos", `${nombreUsuario}_${game.id}`);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().fecha === hoyStr) {
        setIntentos(snap.data().intentos);
      } else {
        await setDoc(ref, { intentos: 3, fecha: hoyStr });
        setIntentos(3);
      }
      setCargando(false);
    };
    cargarIntentos();
    return () => unsubs();
  }, [game.id, nombreUsuario, hoyStr]);

  const manejarFinDePartida = async (puntosConseguidos) => {
    if (intentos <= 0) return;
    
    // Guardar puntos en su ranking
    await addDoc(collection(db, `ranking_${game.id}`), {
      nombre: nombreUsuario, puntuacion: puntosConseguidos, avatar: getAvatarUrl(avatarConfig), fecha: serverTimestamp()
    });

    // Restar 1 intento
    const nuevosIntentos = intentos - 1;
    setIntentos(nuevosIntentos);
    await setDoc(doc(db, "intentos_juegos", `${nombreUsuario}_${game.id}`), { intentos: nuevosIntentos, fecha: hoyStr }, { merge: true });
  };

  const ComponenteJuego = game.comp;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
      <div className="lg:col-span-8 bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center min-h-[450px] relative">
        <button onClick={volver} className="absolute top-6 left-6 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest">&larr; Menú</button>
        
        <div className="absolute top-6 right-8 text-right">
           <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Vidas de Hoy</p>
           <div className="flex gap-1 justify-end">
             {[...Array(3)].map((_, i) => (
               <div key={i} className={`w-3 h-3 rounded-full ${i < intentos ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-gray-800'}`}></div>
             ))}
           </div>
        </div>

        {cargando ? <p className="text-emerald-400">Cargando partida...</p> : (
          intentos > 0 ? <ComponenteJuego onFinish={manejarFinDePartida} /> : (
            <div className="text-center bg-red-500/10 p-6 rounded-2xl border border-red-500/30">
              <p className="text-red-400 font-bold uppercase tracking-widest">Fin de las vidas</p>
              <p className="text-gray-500 text-xs mt-2">Los intentos de este juego se reiniciarán a medianoche.</p>
            </div>
          )
        )}
      </div>

      <div className="lg:col-span-4 bg-[#00241f] rounded-3xl border border-emerald-400/20 shadow-xl overflow-hidden flex flex-col h-[500px]">
        <div className="bg-[#001a17] p-5 border-b border-white/5 flex items-center gap-2">
           <span className={game.color}>{game.icono}</span>
           <h3 className="font-bold text-white uppercase text-xs tracking-widest">Ranking: {game.nombre}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 bg-black/20 custom-scrollbar">
          {ranking.length === 0 ? <p className="text-center text-gray-500 text-xs mt-10 uppercase tracking-widest">Sé el primero en jugar</p> : 
            ranking.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl mb-2 border ${r.nombre === nombreUsuario ? 'bg-white/10 border-white/20' : 'bg-[#001a17] border-transparent'}`}>
                <span className="text-xs font-bold text-gray-500 w-4">{i + 1}º</span>
                <img src={r.avatar} alt="av" className="w-8 h-8 rounded-full bg-gray-800 border border-white/10" />
                <h4 className="text-xs font-bold text-white truncate flex-1">{r.nombre}</h4>
                <div className={`font-black text-sm ${game.color}`}>{r.puntuacion}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🏠 VISTA PRINCIPAL (Generador Diario)
// ==========================================
function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [juegoElegido, setJuegoElegido] = useState(null);
  const [juegosDeHoy, setJuegosDeHoy] = useState([]);

  useEffect(() => {
    // Algoritmo para elegir siempre los mismos 5 juegos dependiendo del DÍA actual
    const hoy = new Date();
    const seedString = `${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()}`;
    
    // Generador pseudo-aleatorio basado en la semilla del día
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) hash = Math.imul(31, hash) + seedString.charCodeAt(i) | 0;
    const rnd = () => { hash = Math.imul(741103597, hash) + 1 | 0; return (hash >>> 0) / 4294967296; };

    let shuffle = [...ALL_GAMES];
    for (let i = shuffle.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    
    // Cogemos los primeros 5 resultantes
    setJuegosDeHoy(shuffle.slice(0, 5));
  }, []);

  if (juegoElegido) return <GameEngine game={juegoElegido} nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} volver={() => setJuegoElegido(null)} />;

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white font-bold text-sm mb-2 uppercase tracking-widest">&larr; Volver</button>
      
      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">Arcade Rotatorio</h3>
        <p className="text-gray-300 text-sm tracking-widest relative z-10">5 minijuegos nuevos cada 24 horas. Tienes 3 vidas en cada uno.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {juegosDeHoy.map(juego => (
          <div key={juego.id} onClick={() => setJuegoElegido(juego)} className="bg-[#001a17] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-white/30 hover:bg-[#00241f] transition duration-300 group shadow-lg text-center flex flex-col items-center">
            
            <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300 ${juego.color}`}>
              {juego.icono}
            </div>
            
            <h4 className={`font-black uppercase text-lg mb-6 ${juego.color}`}>{juego.nombre}</h4>
            <button className={`w-full py-3 rounded-xl bg-white/5 text-gray-300 text-xs font-bold uppercase tracking-widest group-hover:text-black transition border border-transparent ${
              juego.color.replace('text', 'group-hover:bg').replace('400', '400')
            }`}>
              Jugar (3 Vidas)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaJuegos;
