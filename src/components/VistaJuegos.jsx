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
          <button onClick={() => setPuntos(p => p + 10)} disabled={!jugando} className="w-32 h-32 bg-emerald-400 rounded-full font-black text-black text-2xl active:scale-90">HACK!</button>
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
      const puntos = Math.max(0, 3000 - ms); // Más rápido = más puntos
      onFinish(puntos);
    }
  };

  return (
    <div className="text-center flex flex-col items-center gap-6">
      <h3 className="text-xl font-black text-cyan-400">Reflejos CPU</h3>
      {estado === 'inicio' ? (
        <button onClick={iniciar} className="bg-cyan-400 text-black px-8 py-3 rounded-full font-black uppercase">Empezar</button>
      ) : (
        <div onClick={clic} className={`w-48 h-48 rounded-2xl cursor-pointer flex items-center justify-center ${estado === 'esperando' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          <span className="font-black text-xl">{estado === 'esperando' ? 'Espera...' : '¡CLIC AHORA!'}</span>
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
    if (n === secreto) onFinish(Math.max(100, 1000 - (intentos * 100))); // Menos intentos = más puntos
    else setMsg(n < secreto ? 'Es MAYOR' : 'Es MENOR');
    setIntento('');
  };

  return (
    <div className="text-center flex flex-col items-center gap-4">
      <h3 className="text-xl font-black text-purple-400">Brecha Numérica</h3>
      <p className="font-bold text-gray-300 bg-black/50 p-4 rounded-xl">{msg}</p>
      <form onSubmit={probar} className="flex gap-2">
        <input type="number" value={intento} onChange={e => setIntento(e.target.value)} className="bg-[#00241f] text-center border border-gray-600 rounded-lg px-4 py-2 w-24" placeholder="00" />
        <button type="submit" className="bg-purple-500 px-4 rounded-lg font-bold">Probar</button>
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
      {!jugando && tiempo === 15 ? <button onClick={() => {setJugando(true); generar();}} className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black">Empezar (15s)</button> : (
        <>
          <div className="text-3xl font-black">{a} + {b} = ?</div>
          <form onSubmit={probar}><input autoFocus type="number" value={ans} onChange={e=>setAns(e.target.value)} className="bg-black text-center text-xl p-2 rounded border border-yellow-400 w-24" /></form>
          <div className="text-sm">Puntos: {puntos} | Tiempo: {tiempo}s</div>
        </>
      )}
    </div>
  );
}

// 5 a 10. Minijuegos rápidos (Micro-juegos)
function JuegoRuleta({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-pink-400 mb-6">Ruleta Cuántica</h3>
      <button onClick={() => onFinish(Math.floor(Math.random() * 1000))} className="bg-pink-500 text-white w-32 h-32 rounded-full font-black hover:scale-110 transition shadow-[0_0_20px_#ec4899]">TIRAR</button>
    </div>
  );
}

function JuegoDado({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-white mb-6">Dado Criptográfico</h3>
      <button onClick={() => onFinish((Math.floor(Math.random() * 6) + 1) * 150)} className="bg-white text-black w-24 h-24 rounded-2xl font-black text-2xl hover:rotate-12 transition shadow-lg">🎲</button>
    </div>
  );
}

function JuegoMoneda({ onFinish }) {
  const jugar = (eleccion) => { const result = Math.random() > 0.5 ? 1 : 0; onFinish(eleccion === result ? 500 : 0); };
  return (
    <div className="text-center"><h3 className="text-xl font-black text-orange-400 mb-6">Cara o Cruz</h3>
      <div className="flex gap-4 justify-center">
        <button onClick={() => jugar(1)} className="bg-orange-400 text-black px-6 py-3 rounded-lg font-bold">CARA</button>
        <button onClick={() => jugar(0)} className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold">CRUZ</button>
      </div>
    </div>
  );
}

function JuegoBomba({ onFinish }) {
  const cables = [0, 1, 2]; const [bomba] = useState(Math.floor(Math.random() * 3));
  const cortar = (i) => onFinish(i === bomba ? 0 : 400);
  return (
    <div className="text-center"><h3 className="text-xl font-black text-red-500 mb-6">Desactivar Bomba</h3>
      <p className="text-xs text-gray-400 mb-4">Un cable explota (0 pts), dos son seguros (400 pts)</p>
      <div className="flex gap-4 justify-center">
        {cables.map(c => <button key={c} onClick={() => cortar(c)} className="w-12 h-32 bg-red-600 hover:bg-red-500 rounded-full border-4 border-black"></button>)}
      </div>
    </div>
  );
}

function JuegoCaja({ onFinish }) {
  return (
    <div className="text-center"><h3 className="text-xl font-black text-blue-400 mb-6">Loot Box</h3>
      <button onClick={() => onFinish(Math.floor(Math.random() * 800) + 100)} className="bg-blue-500 text-2xl p-8 rounded-xl shadow-[0_0_20px_#3b82f6] hover:scale-110 transition">🎁 ABRIR</button>
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
      <p className="mb-4">Escribe: <span className="font-mono bg-black p-1 text-yellow-300">javascript</span></p>
      <input autoFocus type="text" value={txt} onChange={probar} className="bg-[#00241f] border border-gray-500 px-4 py-2 rounded text-center w-full" />
    </div>
  );
}

// DICCIONARIO DE LOS 10 JUEGOS EN MEMORIA
const ALL_GAMES = [
  { id: 'clicker', nombre: 'Ciber-Clicker', icono: '🖱️', color: 'text-emerald-400', comp: JuegoClicker },
  { id: 'reflejos', nombre: 'Reflejos CPU', icono: '⚡', color: 'text-cyan-400', comp: JuegoReflejos },
  { id: 'codigo', nombre: 'Brecha Numérica', icono: '🔐', color: 'text-purple-400', comp: JuegoCodigo },
  { id: 'math', nombre: 'Math Hack', icono: '🔢', color: 'text-yellow-400', comp: JuegoMath },
  { id: 'ruleta', nombre: 'Ruleta Cuántica', icono: '🎡', color: 'text-pink-400', comp: JuegoRuleta },
  { id: 'dado', nombre: 'Dado Cripto', icono: '🎲', color: 'text-white', comp: JuegoDado },
  { id: 'moneda', nombre: 'Cara o Cruz', icono: '🪙', color: 'text-orange-400', comp: JuegoMoneda },
  { id: 'bomba', nombre: 'Desactivar Bomba', icono: '💣', color: 'text-red-500', comp: JuegoBomba },
  { id: 'caja', nombre: 'Loot Box', icono: '🎁', color: 'text-blue-400', comp: JuegoCaja },
  { id: 'typing', nombre: 'Speed Type', icono: '⌨️', color: 'text-yellow-300', comp: JuegoTyping },
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
        // Si no existe o es un día distinto, reseteamos a 3 intentos
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
        <button onClick={volver} className="absolute top-6 left-6 text-gray-500 hover:text-white text-xs font-bold uppercase">&larr; Menú</button>
        
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
        <div className="bg-[#001a17] p-5 border-b border-white/5"><h3 className="font-bold text-white uppercase text-xs">🏆 Ranking: {game.nombre}</h3></div>
        <div className="flex-1 overflow-y-auto p-3 bg-black/20">
          {ranking.length === 0 ? <p className="text-center text-gray-500 text-xs mt-10">Sé el primero en jugar</p> : 
            ranking.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-3 p-2 rounded-lg mb-1 ${r.nombre === nombreUsuario ? 'bg-white/10' : ''}`}>
                <span className="text-xs font-bold text-gray-500 w-4">{i + 1}º</span>
                <img src={r.avatar} alt="av" className="w-6 h-6 rounded-full bg-gray-800" />
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
      <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white font-bold text-sm mb-2">&larr; Volver</button>
      
      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-xl relative overflow-hidden mb-8">
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">Arcade Rotatorio</h3>
        <p className="text-gray-300 text-sm tracking-widest relative z-10">5 minijuegos nuevos cada 24 horas. Tienes 3 vidas en cada uno.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {juegosDeHoy.map(juego => (
          <div key={juego.id} onClick={() => setJuegoElegido(juego)} className="bg-[#001a17] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-emerald-400/50 hover:bg-[#00241f] transition duration-300 group shadow-lg text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition text-3xl">
              {juego.icono}
            </div>
            <h4 className={`font-black uppercase text-lg mb-4 ${juego.color}`}>{juego.nombre}</h4>
            <button className="w-full py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-bold uppercase tracking-widest group-hover:bg-emerald-400 group-hover:text-black transition">Jugar (3 Vidas)</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaJuegos;
