import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, query, onSnapshot, orderBy, limit, serverTimestamp, addDoc } from 'firebase/firestore';

// ==========================================
// 🕹️ JUEGO 1: GRAVEDAD CERO (Flappy Bird style)
// ==========================================
function JuegoGravedad({ onFinish }) {
  const canvasRef = useRef(null);
  const [jugando, setJugando] = useState(false);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    if (!jugando) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Variables físicas
    let bird = { x: 50, y: 150, velocity: 0, gravity: 0.5, jump: -7, size: 15 };
    let pipes = [];
    let frame = 0;
    let score = 0;
    let isGameOver = false;

    const addPipe = () => {
      const gap = 120;
      const minPipeHeight = 50;
      const maxPipeHeight = canvas.height - gap - minPipeHeight;
      const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
      pipes.push({ x: canvas.width, y: 0, w: 40, h: topHeight, passed: false }); // Arriba
      pipes.push({ x: canvas.width, y: topHeight + gap, w: 40, h: canvas.height - topHeight - gap, passed: false }); // Abajo
    };

    const handleJump = () => { bird.velocity = bird.jump; };
    // Escuchar clics y espacio
    canvas.addEventListener('mousedown', handleJump);
    const handleKeyDown = (e) => { if (e.code === 'Space') { e.preventDefault(); handleJump(); } };
    window.addEventListener('keydown', handleKeyDown);

    const loop = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fondo (cielo ciberpunk)
      ctx.fillStyle = '#001a17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pájaro
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;
      ctx.fillStyle = '#34d399'; // Emerald
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
      ctx.fill();

      // Generar tuberías
      if (frame % 90 === 0) addPipe();

      // Mover y dibujar tuberías
      for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 3; // Velocidad de las tuberías

        // Degradado de la tubería
        const gradient = ctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#047857');
        ctx.fillStyle = gradient;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Colisión
        if (bird.x + bird.size > p.x && bird.x - bird.size < p.x + p.w &&
            bird.y + bird.size > p.y && bird.y - bird.size < p.y + p.h) {
          isGameOver = true;
        }

        // Puntos (solo contamos las de arriba para no puntuar doble)
        if (p.x + p.w < bird.x && !p.passed && p.y === 0) {
          score += 10;
          p.passed = true;
          setPuntos(score);
        }
      }

      // Limpiar tuberías viejas
      pipes = pipes.filter(p => p.x + p.w > 0);

      // Colisión con techo/suelo
      if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) isGameOver = true;

      // Dibujar Score en el canvas
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '60px Arial';
      ctx.fillText(score, canvas.width / 2 - 20, 60);

      if (isGameOver) {
        setJugando(false);
        onFinish(score);
      } else {
        frame++;
        animationId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleJump);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jugando]);

  return (
    <div className="text-center flex flex-col items-center">
      <h3 className="text-xl font-black text-emerald-400 mb-4 uppercase tracking-widest">Gravedad Cero</h3>
      
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={300} className="border-4 border-emerald-400/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-[#001a17]"></canvas>
        
        {!jugando && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
            <button onClick={() => setJugando(true)} className="bg-emerald-400 text-black px-8 py-3 rounded-full font-black uppercase text-xl hover:scale-105 transition shadow-xl">
              Toca para volar
            </button>
            <p className="text-gray-400 text-xs mt-4 uppercase tracking-widest">Usa Clic o Espacio</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl font-black text-white">{puntos} pts</div>
    </div>
  );
}


// ==========================================
// 🕹️ JUEGO 2: REBOTE (Pong Solo)
// ==========================================
function JuegoRebote({ onFinish }) {
  const canvasRef = useRef(null);
  const [jugando, setJugando] = useState(false);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    if (!jugando) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    let ball = { x: canvas.width / 2, y: 50, radius: 10, dx: 4, dy: 4 };
    let paddle = { w: 100, h: 15, x: canvas.width / 2 - 50, y: canvas.height - 30 };
    let score = 0;
    let isGameOver = false;

    // Mover pala con el ratón
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddle.x = mouseX - paddle.w / 2;
      // Límites
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo
      ctx.fillStyle = '#001a17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pala
      ctx.fillStyle = '#22d3ee'; // Cyan
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Bola
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Mover Bola
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Colisión Paredes Izd/Der/Arriba
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
      if (ball.y - ball.radius < 0) ball.dy *= -1;

      // Colisión con la pala
      if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        ball.dy = -ball.dy;
        // Aumentar velocidad un poquito en cada golpe para dar dificultad
        ball.dx *= 1.05;
        ball.dy *= 1.05;
        score += 50;
        setPuntos(score);
      }

      // Si toca el suelo = Game Over
      if (ball.y + ball.radius > canvas.height) {
        isGameOver = true;
      }

      if (isGameOver) {
        setJugando(false);
        onFinish(score);
      } else {
        animationId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [jugando]);

  return (
    <div className="text-center flex flex-col items-center">
      <h3 className="text-xl font-black text-cyan-400 mb-4 uppercase tracking-widest">Rebote Infinito</h3>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="border-4 border-cyan-400/30 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-[#001a17] cursor-none"></canvas>
        {!jugando && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
            <button onClick={() => setJugando(true)} className="bg-cyan-400 text-black px-8 py-3 rounded-full font-black uppercase text-xl hover:scale-105 transition shadow-xl">
              Iniciar
            </button>
            <p className="text-gray-400 text-xs mt-4 uppercase tracking-widest">Mueve el ratón</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl font-black text-white">{puntos} pts</div>
    </div>
  );
}


// ==========================================
// 🕹️ JUEGO 3: CAZADOR DE BUGS (Aim Trainer)
// ==========================================
function JuegoBugs({ onFinish }) {
  const canvasRef = useRef(null);
  const [jugando, setJugando] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [tiempo, setTiempo] = useState(20);

  useEffect(() => {
    let int;
    if (jugando && tiempo > 0) int = setInterval(() => setTiempo(t => t - 1), 1000);
    else if (tiempo === 0 && jugando) { setJugando(false); onFinish(puntos); }
    return () => clearInterval(int);
  }, [jugando, tiempo]);

  useEffect(() => {
    if (!jugando) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    let bugs = [];
    let score = 0;

    const addBug = () => {
      bugs.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        radius: Math.random() * 15 + 10,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`, // Colores aleatorios vivos
        life: 100 // tiempo de vida
      });
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Comprobar si clicó en algún bug (de arriba a abajo)
      for (let i = bugs.length - 1; i >= 0; i--) {
        const b = bugs[i];
        const dist = Math.sqrt((mouseX - b.x) ** 2 + (mouseY - b.y) ** 2);
        if (dist <= b.radius) {
          score += Math.floor(100 - b.radius); // Bugs más pequeños = más puntos
          setPuntos(score);
          bugs.splice(i, 1); // Lo matamos
          addBug(); // Aparece otro
          break; // Solo matar uno por clic
        }
      }
    };
    canvas.addEventListener('mousedown', handleClick);

    // Bugs iniciales
    for(let i=0; i<3; i++) addBug();

    const loop = () => {
      if (tiempo === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#001a17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar bugs
      for (let i = 0; i < bugs.length; i++) {
        let b = bugs[i];
        b.life -= 0.5; // Se van desvaneciendo
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = Math.max(0, b.life / 100);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Si mueren de viejos, restamos puntos y hacemos otro
        if (b.life <= 0) {
          score = Math.max(0, score - 20); // Penalización
          setPuntos(score);
          bugs.splice(i, 1);
          addBug();
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleClick);
    };
  }, [jugando, tiempo]);

  return (
    <div className="text-center flex flex-col items-center">
      <h3 className="text-xl font-black text-purple-400 mb-4 uppercase tracking-widest">Caza Bugs</h3>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={300} className="border-4 border-purple-400/30 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-[#001a17] cursor-crosshair"></canvas>
        {!jugando && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center">
            {tiempo === 20 ? (
              <button onClick={() => setJugando(true)} className="bg-purple-500 text-white px-8 py-3 rounded-full font-black uppercase text-xl hover:scale-105 transition shadow-xl">
                Cazar
              </button>
            ) : <p className="text-purple-400 font-bold uppercase">Fin del tiempo</p>}
          </div>
        )}
      </div>
      <div className="flex gap-10 mt-4">
        <div className="text-2xl font-black text-white">{puntos} pts</div>
        <div className="text-2xl font-black text-gray-500">00:{tiempo < 10 ? `0${tiempo}` : tiempo}</div>
      </div>
    </div>
  );
}

// ==========================================
// 🧰 DICCIONARIO DE JUEGOS
// ==========================================
const ALL_GAMES = [
  { id: 'gravedad', nombre: 'Gravedad Cero', color: 'text-emerald-400', comp: JuegoGravedad,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> },
  
  { id: 'rebote', nombre: 'Rebote Infinito', color: 'text-cyan-400', comp: JuegoRebote,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg> },
  
  { id: 'bugs', nombre: 'Caza Bugs', color: 'text-purple-400', comp: JuegoBugs,
    icono: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg> }
];

// ==========================================
// ⚙️ MOTOR DEL JUEGO (Mismo de antes)
// ==========================================
function GameEngine({ game, nombreUsuario, avatarConfig, getAvatarUrl, volver }) {
  const [intentos, setIntentos] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);

  const hoyStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const q = query(collection(db, `ranking_${game.id}`), orderBy("puntuacion", "desc"), limit(15));
    const unsubs = onSnapshot(q, (snap) => setRanking(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

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
    
    await addDoc(collection(db, `ranking_${game.id}`), {
      nombre: nombreUsuario, puntuacion: puntosConseguidos, avatar: getAvatarUrl(avatarConfig), fecha: serverTimestamp()
    });

    const nuevosIntentos = intentos - 1;
    setIntentos(nuevosIntentos);
    await setDoc(doc(db, "intentos_juegos", `${nombreUsuario}_${game.id}`), { intentos: nuevosIntentos, fecha: hoyStr }, { merge: true });
  };

  const ComponenteJuego = game.comp;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
      <div className="lg:col-span-8 bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center min-h-[550px] relative">
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
            <div className="text-center bg-red-500/10 p-6 rounded-2xl border border-red-500/30 mt-10">
              <p className="text-red-400 font-bold uppercase tracking-widest">Fin de las vidas</p>
              <p className="text-gray-500 text-xs mt-2">Los intentos se reiniciarán a medianoche.</p>
            </div>
          )
        )}
      </div>

      <div className="lg:col-span-4 bg-[#00241f] rounded-3xl border border-emerald-400/20 shadow-xl overflow-hidden flex flex-col h-[550px]">
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
// 🏠 VISTA PRINCIPAL
// ==========================================
function VistaJuegos({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [juegoElegido, setJuegoElegido] = useState(null);

  if (juegoElegido) return <GameEngine game={juegoElegido} nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} volver={() => setJuegoElegido(null)} />;

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white font-bold text-sm mb-2 uppercase tracking-widest">&larr; Volver</button>
      
      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">IMMUNE Arcade</h3>
        <p className="text-gray-300 text-sm tracking-widest relative z-10">Pon a prueba tu habilidad. 3 intentos por día.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ALL_GAMES.map(juego => (
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
