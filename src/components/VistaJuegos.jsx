import React, { useState, useEffect, useRef } from 'react';

// Emojis para la memoria
const BARAJAS = [
  ['🚀', '👾', '🔋', '💾', '📡', '🌐', '🎧', '⚡'],
  ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'],
  ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
];

export default function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl }) {
  const [fase, setFase] = useState("inicio"); // inicio, jugando, intento_fallido, victoria, derrota
  const [intentosRestantes, setIntentosRestantes] = useState(2);
  const [tiempo, setTiempo] = useState(60);
  const [tiempoSiguiente, setTiempoSiguiente] = useState("");
  
  const [retoDiario, setRetoDiario] = useState({ tipo: 'pelota', objetivo: 20, baraja: 0 });

  const [cartas, setCartas] = useState([]);
  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  const [parejasEncontradas, setParejasEncontradas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const [puntosPelota, setPuntosPelota] = useState(0);
  const [posPelota, setPosPelota] = useState({ top: '40%', left: '40%' });
  const contenedorPelotaRef = useRef(null);

  // 1. IDENTIFICADOR DEL CICLO DE 24H (De 9:00 AM a 9:00 AM)
  const getCicloActual = () => {
    const ahora = new Date();
    const fechaBase = new Date(ahora);
    // Si aún no son las 9:00 AM, seguimos en el ciclo del día anterior
    if (ahora.getHours() < 9) {
      fechaBase.setDate(fechaBase.getDate() - 1);
    }
    return `${fechaBase.getFullYear()}-${fechaBase.getMonth()}-${fechaBase.getDate()}`;
  };

  // Función maestra para guardar el estado y evitar trampas al recargar
  const actualizarEstadoJuego = (nuevaFase, nuevosIntentos) => {
    setFase(nuevaFase);
    setIntentosRestantes(nuevosIntentos);
    localStorage.setItem('immune_juego_diario', JSON.stringify({
      ciclo: getCicloActual(),
      fase: nuevaFase,
      intentosRestantes: nuevosIntentos
    }));
  };

  // 2. INICIALIZACIÓN Y LECTURA DE MEMORIA
  useEffect(() => {
    const cicloActual = getCicloActual();
    const guardado = localStorage.getItem('immune_juego_diario');
    
    // Calcular qué juego toca en este ciclo
    const diaNum = parseInt(cicloActual.split('-')[2]);
    setRetoDiario({
      tipo: diaNum % 2 === 0 ? 'pelota' : 'memoria',
      objetivo: 15 + (diaNum % 10),
      baraja: diaNum % BARAJAS.length
    });

    if (guardado) {
      const datos = JSON.parse(guardado);
      if (datos.ciclo === cicloActual) {
        // Si recarga a mitad de una partida, le devolvemos al inicio pero manteniendo sus intentos gastados
        if (datos.fase === "jugando") {
          setFase("inicio");
          setIntentosRestantes(datos.intentosRestantes);
        } else {
          setFase(datos.fase);
          setIntentosRestantes(datos.intentosRestantes);
        }
      } else {
        // Nuevo ciclo de 24h: Limpiamos la memoria del día anterior
        localStorage.removeItem('immune_juego_diario');
        setFase("inicio");
        setIntentosRestantes(2);
      }
    }
  }, []);

  // 3. CUENTA REGRESIVA HASTA LAS 9:00 AM (Solo aparece si ganas o pierdes)
  useEffect(() => {
    let intervaloTimer;
    if (fase === "victoria" || fase === "derrota") {
      intervaloTimer = setInterval(() => {
        const ahora = new Date();
        const objetivo = new Date(ahora);
        if (ahora.getHours() >= 9) {
          objetivo.setDate(objetivo.getDate() + 1); // Próximas 9 AM son mañana
        }
        objetivo.setHours(9, 0, 0, 0);

        const diff = objetivo - ahora;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTiempoSiguiente(`${h}h ${m}m ${s}s`);
      }, 1000);
    }
    return () => clearInterval(intervaloTimer);
  }, [fase]);

  // 4. PREPARACIÓN DE TABLEROS
  const prepararJuego = () => {
    if (retoDiario.tipo === 'memoria') {
      const emojisHoy = BARAJAS[retoDiario.baraja];
      const mazo = [...emojisHoy, ...emojisHoy]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, volteada: false, encontrada: false }));
      setCartas(mazo);
      setCartasVolteadas([]);
      setParejasEncontradas(0);
      setBloqueado(false);
    } else {
      setPuntosPelota(0);
      moverPelota();
    }
    setTiempo(60);
  };

  const iniciarJuego = () => {
    prepararJuego();
    actualizarEstadoJuego("jugando", 2);
  };

  const reintentar = () => {
    prepararJuego();
    actualizarEstadoJuego("jugando", intentosRestantes);
  };

  // 5. TEMPORIZADOR DE LA PARTIDA (60s)
  useEffect(() => {
    let intervalo;
    if (fase === "jugando" && tiempo > 0) {
      intervalo = setInterval(() => setTiempo((t) => t - 1), 1000);
    } else if (tiempo === 0 && fase === "jugando") {
      const nuevosIntentos = intentosRestantes - 1;
      if (nuevosIntentos === 0) {
        actualizarEstadoJuego("derrota", 0);
      } else {
        actualizarEstadoJuego("intento_fallido", nuevosIntentos);
      }
    }
    return () => clearInterval(intervalo);
  }, [fase, tiempo, intentosRestantes]);

  // 6. LÓGICA JUEGO: MEMORIA
  const manejarClickCarta = (indice) => {
    if (bloqueado || cartas[indice].volteada || cartas[indice].encontrada) return;

    const nuevasCartas = [...cartas];
    nuevasCartas[indice].volteada = true;
    setCartas(nuevasCartas);

    const nuevasVolteadas = [...cartasVolteadas, indice];
    setCartasVolteadas(nuevasVolteadas);

    if (nuevasVolteadas.length === 2) {
      setBloqueado(true);
      const [i1, i2] = nuevasVolteadas;

      if (nuevasCartas[i1].emoji === nuevasCartas[i2].emoji) {
        nuevasCartas[i1].encontrada = true;
        nuevasCartas[i2].encontrada = true;
        setCartas(nuevasCartas);
        setCartasVolteadas([]);
        setBloqueado(false);
        const nuevasParejas = parejasEncontradas + 1;
        setParejasEncontradas(nuevasParejas);
        
        if (nuevasParejas === 8) actualizarEstadoJuego("victoria", intentosRestantes);
      } else {
        setTimeout(() => {
          nuevasCartas[i1].volteada = false;
          nuevasCartas[i2].volteada = false;
          setCartas([...nuevasCartas]);
          setCartasVolteadas([]);
          setBloqueado(false);
        }, 800);
      }
    }
  };

  // 7. LÓGICA JUEGO: PELOTA
  const moverPelota = () => {
    if (contenedorPelotaRef.current) {
      setPosPelota({
        top: `${Math.floor(Math.random() * 80)}%`,
        left: `${Math.floor(Math.random() * 80)}%`
      });
    }
  };

  const manejarClickPelota = () => {
    const nuevosPuntos = puntosPelota + 1;
    setPuntosPelota(nuevosPuntos);
    if (nuevosPuntos >= retoDiario.objetivo) {
      actualizarEstadoJuego("victoria", intentosRestantes);
    } else {
      moverPelota();
    }
  };

  return (
    <section className="animate-in fade-in duration-300 h-full flex flex-col items-center pb-10">
      <div className="bg-[#002e29] rounded-3xl border border-emerald-400/30 p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] max-w-2xl w-full text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>

        <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">Reto Diario</h2>
        <h1 className="text-3xl font-black italic mb-6 uppercase text-white">
          {retoDiario.tipo === 'memoria' ? 'Hackeo de Memoria' : 'Interceptor de Datos'}
        </h1>

        {/* INICIO */}
        {fase === "inicio" && (
          <div className="space-y-6 py-4">
            <div className="text-6xl animate-bounce mb-4">{retoDiario.tipo === 'memoria' ? '🖧' : '🎯'}</div>
            <p className="text-gray-300">
              {retoDiario.tipo === 'memoria' 
                ? 'Encuentra todos los pares idénticos antes de que se acabe el tiempo.' 
                : `Demuestra tus reflejos. Atrapa el núcleo de datos ${retoDiario.objetivo} veces.`}
            </p>
            <p className="text-sm font-bold text-emerald-400">Tienes 60 segundos y {intentosRestantes} intento(s).</p>
            <button onClick={intentosRestantes === 2 ? iniciarJuego : reintentar} className="mt-4 bg-cyan-400 text-black font-black text-lg px-10 py-4 rounded-xl hover:bg-cyan-300 hover:scale-105 transition shadow-[0_0_20px_rgba(34,211,238,0.4)] uppercase tracking-widest">
              Iniciar Reto
            </button>
          </div>
        )}

        {/* JUGANDO */}
        {fase === "jugando" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-black/30 px-6 py-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <span className={`text-2xl font-black font-mono ${tiempo <= 15 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>00:{tiempo < 10 ? `0${tiempo}` : tiempo}</span>
              </div>
              
              {retoDiario.tipo === 'pelota' && (
                <div className="text-cyan-400 font-bold text-lg">{puntosPelota} / {retoDiario.objetivo}</div>
              )}

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Intentos</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full ${i < intentosRestantes ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-gray-700 border border-gray-600'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            {retoDiario.tipo === 'memoria' ? (
              <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                {cartas.map((carta, index) => (
                  <div key={carta.id} onClick={() => manejarClickCarta(index)} className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-3xl transition-all duration-300 transform ${carta.volteada || carta.encontrada ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-95' : 'bg-gray-800 border-2 border-transparent hover:bg-emerald-400/50 hover:scale-105'}`}>
                    <span className={`transition-opacity duration-300 ${carta.volteada || carta.encontrada ? 'opacity-100' : 'opacity-0'}`}>{carta.emoji}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={contenedorPelotaRef} className="relative w-full h-64 bg-black/40 rounded-xl border border-gray-700 overflow-hidden cursor-crosshair">
                <div onClick={manejarClickPelota} className="absolute w-12 h-12 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] flex items-center justify-center cursor-pointer hover:scale-95 transition-transform" style={{ top: posPelota.top, left: posPelota.left, transition: 'top 0.2s, left 0.2s' }}>
                  <div className="w-6 h-6 bg-white rounded-full opacity-50"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTENTO FALLIDO */}
        {fase === "intento_fallido" && (
          <div className="space-y-6 py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-3xl font-black text-red-400 uppercase">Intento Fallido</h3>
            <p className="text-gray-300">Aún te queda <span className="text-white font-bold">1 intento</span>.</p>
            <button onClick={reintentar} className="bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-cyan-300 transition uppercase tracking-widest">Reintentar</button>
          </div>
        )}

        {/* VICTORIA / DERROTA (BLOQUEO DE 24H) */}
        {(fase === "victoria" || fase === "derrota") && (
          <div className="space-y-6 py-8">
            <div className={`text-6xl mb-4 ${fase === "victoria" ? 'animate-bounce' : ''}`}>
              {fase === "victoria" ? '🏆' : '💀'}
            </div>
            <h3 className={`text-3xl font-black uppercase ${fase === "victoria" ? 'text-emerald-400' : 'text-red-400'}`}>
              {fase === "victoria" ? '¡Reto Superado!' : 'Game Over'}
            </h3>
            
            <div className="bg-black/30 p-6 rounded-2xl border border-white/5 mt-6 inline-block">
              <span className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Próximo reto en:</span>
              <span className="text-3xl font-mono font-black text-cyan-400">{tiempoSiguiente}</span>
            </div>
          </div>
        )}
      </div>

      {/* RANKING SIMULADO */}
      {(fase === "inicio" || fase === "victoria" || fase === "derrota") && (
        <div className="mt-8 max-w-2xl w-full pb-20">
          <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4 px-2">Ranking Global - Hoy</h3>
          <div className="bg-[#002e29]/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-white/5">
              <span className="font-bold text-emerald-400">#1</span>
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Javier&eyes=happy" className="w-8 h-8 rounded-full bg-gray-800" alt="avatar" />
              <span className="flex-1 font-bold text-sm">Javier</span>
              <span className="text-cyan-400 font-bold text-sm">18s</span>
            </div>
            {fase === "victoria" && (
              <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                <span className="font-bold text-emerald-400">#2</span>
                <img src={getAvatarUrl(avatarConfig)} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-emerald-400" alt="tu-avatar" />
                <span className="flex-1 font-bold text-sm">{nombreUsuario} <span className="text-xs text-emerald-500 ml-2">(Tú)</span></span>
                <span className="text-cyan-400 font-bold text-sm">Superado</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}