import React, { useState, useEffect, useRef } from 'react'
import { db, auth } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Importamos el nuevo componente de Login con Google
import Login from './components/Login'

import ModalMusica from './components/ModalMusica'
import ModalAvatar from './components/ModalAvatar'
import VistaJuegos from './components/VistaJuegos'
import VistaProyectos from './components/VistaProyectos'
import VistaForo from './components/VistaForo'
import VistaCafeteria from './components/VistaCafeteria'
import VistaClubs from './components/VistaClubs'
import VistaChatGlobal from './components/VistaChatGlobal'
import VistaSpotify from './components/VistaSpotify'
import VistaMadrid from './components/VistaMadrid' 
import VistaEmpleabilidad from './components/VistaEmpleabilidad'
import VistaConnect from './components/VistaConnect'

// ==========================================
// 🌧️ COMPONENTE: LLUVIA MATRIX (Cargador)
// ==========================================
const MatrixLoader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ajustar al tamaño de la ventana
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Caracteres que van a caer (mezcla de letras, números y el nombre)
    const letters = 'IMMUNECONNECT010101XYZ101010HACK';
    const characters = letters.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Array para guardar la posición Y (caída) de cada columna
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Fondo semitransparente para dejar "rastro" al caer
      ctx.fillStyle = 'rgba(0, 36, 31, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color de las letras (emerald-400)
      ctx.fillStyle = '#34d399'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Si la gota llega abajo y un factor aleatorio se cumple, vuelve arriba
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // Movemos la gota hacia abajo
        drops[i]++;
      }
    };

    // Velocidad de la lluvia (33ms = ~30fps)
    const interval = setInterval(draw, 33);

    // Si cambian el tamaño de la ventana, recalculamos el canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#00241f] flex items-center justify-center">
      {/* Canvas de fondo */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
      
      {/* Cartel central flotante */}
      <div className="z-10 bg-[#001a17]/80 px-8 py-6 rounded-3xl border border-emerald-400/30 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col items-center gap-4">
        <svg className="w-10 h-10 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-xl font-black text-emerald-400 tracking-widest uppercase animate-pulse">Cargando Immune Connect...</h1>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 COMPONENTE PRINCIPAL APP
// ==========================================
function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  const [vistaActiva, setVistaActiva] = useState("inicio");

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [paisUsuario, setPaisUsuario] = useState("España");
  const [musicaActivada, setMusicaActivada] = useState(false);

  // 🏰 NUEVO ESTADO PARA LA CASA
  const [casaUsuario, setCasaUsuario] = useState(null);

  const [avatarConfig, setAvatarConfig] = useState({
    top: "none", 
    skinColor: "614335", 
    eyes: "closed",      
    mouth: "serious",
    accessories: "blank"
  });

  const [mostrarModalMusica, setMostrarModalMusica] = useState(false);
  const [mostrarModalAvatar, setMostrarModalAvatar] = useState(false);

  const audioRef = useRef(null);

  const banderas = {
    "España": "🇪🇸", "Colombia": "🇨🇴", "México": "🇲🇽", 
    "Argentina": "🇦🇷", "Chile": "🇨🇱", "Perú": "🇵🇪"
  };
  const banderaActual = banderas[paisUsuario] || "🌍";

  const codigosPaises = {
    "España": "es", "Colombia": "co", "México": "mx", 
    "Argentina": "ar", "Chile": "cl", "Perú": "pe"
  };
  const codigoActual = codigosPaises[paisUsuario] || "es";

  const getAvatarUrl = (config) => {
    let url = `https://api.dicebear.com/9.x/avataaars/svg?seed=Lienzo&skinColor=${config.skinColor}&mouth=${config.mouth}&eyes=${config.eyes}`;
    if (config.top === "none") url += `&topProbability=0`;
    else url += `&top=${config.top}&topProbability=100`;
    if (config.accessories === "blank") url += `&accessoriesProbability=0`;
    else url += `&accessories=${config.accessories}&accessoriesProbability=100`;
    return url;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setNombreUsuario(data.nombre);
            setPaisUsuario(data.pais || "España");
            if (data.avatarConfig) setAvatarConfig(data.avatarConfig);
            
            // 🛡️ BÚSQUEDA A PRUEBA DE BALAS PARA USUARIOS ANTIGUOS
            // Buscamos si la casa está guardada como 'casa', 'house', 'casaAsignada' o 'houseCode'
            const casaGuardada = data.casa || data.house || data.casaAsignada || data.houseCode;
            if (casaGuardada) {
              setCasaUsuario(casaGuardada);
            }
            
            setUsuarioLogueado(user);
          }
        } else {
          setUsuarioLogueado(null);
        }
      } catch (error) {
        console.error("Error interno cargando el usuario:", error);
        setUsuarioLogueado(null);
      } finally {
        setCargandoAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 👂 ESCUCHA DE MENSAJES DEL IFRAME DEL TEST DE LAS CASAS
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.tipo === 'CASA_ASIGNADA') {
        const nuevaCasa = event.data.casa;
        setCasaUsuario(nuevaCasa);
        
        // Guardar en Firebase para que no tenga que repetir el test
        if (auth.currentUser) {
          await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
            casa: nuevaCasa
          }, { merge: true });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const cerrarSesion = () => {
    setMusicaActivada(false);
    signOut(auth);
  };

  const cambiarAvatar = async (nuevaConfig) => {
    setAvatarConfig(nuevaConfig); 
    if (auth.currentUser) {
      await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
        avatarConfig: nuevaConfig
      }, { merge: true });
    }
  };

  if (cargandoAuth) return <MatrixLoader />;

  if (!usuarioLogueado) {
    return <Login />;
  }

  const linkMenuClass = (vista) => `w-full flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${vistaActiva === vista ? "bg-emerald-400/10 text-emerald-400 font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white text-left"}`;

  // 🎨 LÓGICA A PRUEBA DE BALAS PARA LOS ESTILOS DE LA CASA
  const getHouseTheme = () => {
    if (!casaUsuario) return ''; // Sin borde si no ha hecho el test

    // Convertimos a mayúsculas para evitar problemas de "Zefirion" vs "zefirion"
    const casa = String(casaUsuario).toUpperCase();

    // Buscamos coincidencias flexibles (por si guardaron 'ZEF' en vez de 'Zefirion')
    if (casa.includes('ABY')) return 'border-[6px] border-purple-600 shadow-[inset_0_0_50px_rgba(147,51,234,0.3)]';
    if (casa.includes('ZEF')) return 'border-[6px] border-blue-500 shadow-[inset_0_0_50px_rgba(59,130,246,0.3)]';
    if (casa.includes('DRA')) return 'border-[6px] border-red-600 shadow-[inset_0_0_50px_rgba(220,38,38,0.3)]';
    if (casa.includes('TER')) return 'border-[6px] border-green-500 shadow-[inset_0_0_50px_rgba(34,197,94,0.3)]';
    
    return ''; 
  };

  return (
    // ⚠️ AQUÍ APLICAMOS EL TEMA DE LA CASA A LA ETIQUETA RAÍZ
    <div className={`flex h-screen bg-[#00241f] text-white font-sans overflow-hidden relative transition-all duration-1000 ${getHouseTheme()}`}>
      
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" loop />

      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-6 bg-[#001a17] z-10 hidden md:flex">
        
        <div className="flex flex-col gap-1 items-start mb-2 cursor-pointer" onClick={() => setVistaActiva("inicio")}>
          <h1 className="text-2xl font-bold text-emerald-400 tracking-tighter">IMMUNE <span className="text-white font-light">Connect</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
          
          {/* MENÚ PRINCIPAL */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 px-2">Menú Principal</p>
            <div className="space-y-1">
              <button onClick={() => setVistaActiva("inicio")} className={linkMenuClass("inicio")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Inicio
              </button>
              <button onClick={() => setVistaActiva("clubs")} className={linkMenuClass("clubs")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                Clubs y Campus
              </button>
              <button onClick={() => setVistaActiva("chats")} className={linkMenuClass("chats")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Chat Global
              </button>
              <button onClick={() => setVistaActiva("people like you")} className={linkMenuClass("people like you")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                People like you
              </button>
              <button onClick={() => setVistaActiva("juegos")} className={linkMenuClass("juegos")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Retos y Juegos
              </button>
              <button onClick={() => setVistaActiva("bienestar")} className={linkMenuClass("bienestar")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                Bienestar
              </button>
            </div>
          </div>

          {/* MENÚ DE EMPLEABILIDAD */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 px-2">Menú Empleabilidad</p>
            <div className="space-y-1">
              <button onClick={() => setVistaActiva("ofertas")} className={linkMenuClass("ofertas")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Ofertas
              </button>
              <button onClick={() => setVistaActiva("networking")} className={linkMenuClass("networking")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Networking
              </button>
              <button onClick={() => setVistaActiva("mentorias")} className={linkMenuClass("mentorias")}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                Mentorías
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 px-2">Tu Perfil</p>
            <div className="space-y-4 px-2 text-sm text-gray-400">
              <div className="flex justify-between items-center cursor-pointer hover:text-white transition" onClick={() => setMostrarModalMusica(true)}>
                <span>Configuración</span>
                <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {musicaActivada && <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-gray-500">
                <span>Nombre</span>
                <span className="text-xs text-emerald-400 truncate max-w-[80px] cursor-default">{nombreUsuario}</span>
              </div>
              
              <div className="flex justify-between items-center cursor-pointer hover:text-white transition" onClick={() => setMostrarModalAvatar(true)}>
                <span>Avatar</span>
                <img src={getAvatarUrl(avatarConfig)} className="w-6 h-6 rounded-full bg-gray-700" alt="avatar-mini" />
              </div>
              <div className="flex justify-between items-center cursor-pointer hover:text-red-400 transition pt-2 border-t border-white/5" onClick={cerrarSesion}>
                <span>Cerrar Sesión</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-24 z-0">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer flex-shrink-0" onClick={() => setMostrarModalAvatar(true)}>
               <img src={getAvatarUrl(avatarConfig)} className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-emerald-400 p-1 bg-gray-800 hover:scale-105 transition" alt="Avatar" />
               <img src={`https://flagcdn.com/w40/${codigoActual}.png`} className="absolute bottom-0 right-0 w-[20px] h-[14px] md:w-[24px] md:h-[16px] object-cover rounded shadow border border-white/20" alt={paisUsuario} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold uppercase italic leading-tight text-white">
                Hola, <br className="block sm:hidden" />{nombreUsuario} <span className="text-gray-400 font-normal text-sm md:text-base">({paisUsuario})</span>
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex flex-1 justify-center px-4"></div>

          <div className="hidden md:flex gap-4 items-center flex-shrink-0">
             <img src="/immune-logo.png" alt="IMMUNE Logo" className="h-10 md:h-12 lg:h-14 object-contain drop-shadow-lg" />
          </div>
        </header>

        {vistaActiva === "inicio" && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col gap-6">

              <div className="bg-[#001a17]/80 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
                <h3 className="font-bold text-sm uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Agenda Campus Life
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  <div className="min-w-[200px] bg-black/30 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1 block">Mañana - 18:00</span>
                    <h4 className="font-bold text-sm text-white mb-2">Taller de Entrevistas</h4>
                    <p className="text-xs text-gray-400">Supera entrevistas técnicas con expertos HR.</p>
                  </div>
                  <div className="min-w-[200px] bg-black/30 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 block">Jueves - 19:30</span>
                    <h4 className="font-bold text-sm text-white mb-2">Torneo Ciberreto</h4>
                    <p className="text-xs text-gray-400">Demuestra tus habilidades de lógica.</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Ecosistema Cultural
                  </h3>
                  <button onClick={() => setVistaActiva("clubs")} className="text-xs text-cyan-400 font-bold hover:underline transition">Ver todo →</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div onClick={() => setVistaActiva("foroCine")} className="group relative h-52 rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition duration-500 shadow-xl cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60" alt="Cine" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001a17] via-[#001a17]/80 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Cine y Series</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black uppercase text-white leading-none">Foro Abierto</h4>
                        <p className="text-xs text-gray-300 mt-2">Recomienda y debate.</p>
                      </div>
                    </div>
                  </div>

                  <div onClick={() => setVistaActiva("foroLectura")} className="group relative h-52 rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition duration-500 shadow-xl cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-40" alt="Libros" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001a17] via-[#001a17]/80 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="bg-cyan-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Lectura</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black uppercase text-white leading-none">Club de Lectura</h4>
                        <p className="text-xs text-gray-300 mt-2">Descubre libros.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div onClick={() => setVistaActiva("spotify")} className="mt-6 relative rounded-3xl overflow-hidden border border-[#1db954]/30 bg-gradient-to-r from-[#1db954]/20 to-[#001a17] shadow-[0_0_30px_rgba(29,185,84,0.1)] group cursor-pointer hover:border-[#1db954]/60 transition-colors">
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="relative p-6 flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 hidden sm:block group-hover:scale-105 transition-transform">
                       <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1db954] to-emerald-400 animate-[spin_3s_linear_infinite] opacity-50 blur-xl group-hover:opacity-80 transition-opacity"></div>
                       <div className="relative w-full h-full rounded-full border-[4px] border-gray-900 overflow-hidden shadow-2xl animate-[spin_4s_linear_infinite]">
                         <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-90" alt="Album" />
                         <div className="absolute inset-0 bg-black/40 rounded-full border border-white/10"></div>
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700 shadow-inner flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#1db954] rounded-full animate-ping"></div>
                         </div>
                       </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] text-[#1db954] font-bold uppercase tracking-widest border border-[#1db954]/30 px-2 py-0.5 rounded-md bg-[#1db954]/10 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse"></span> Connect
                        </span>
                      </div>
                      <h4 className="font-black text-2xl uppercase text-white leading-none italic tracking-tight mt-2">Tech Beats</h4>
                      <p className="text-xs text-gray-400 mt-1 truncate">Conecta tu Spotify y escucha música.</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-[#1db954] text-black flex items-center justify-center group-hover:bg-[#1ed760] transition-all shadow-[0_0_25px_rgba(29,185,84,0.5)] flex-shrink-0 group-hover:scale-110">
                       <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* RUTAS Y VISTAS */}
        {vistaActiva === "spotify" && <VistaSpotify setVistaActiva={setVistaActiva} />}
        {vistaActiva === "chats" && <VistaChatGlobal nombreUsuario={nombreUsuario} paisUsuario={paisUsuario} banderaActual={banderaActual} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} isWidget={false} />}
        {vistaActiva === "clubs" && <VistaClubs setVistaActiva={setVistaActiva} paisUsuario={paisUsuario} />}
        {vistaActiva === "madrid" && <VistaMadrid setVistaActiva={setVistaActiva} />}
        {vistaActiva === "foroCine" && <VistaForo categoria="cine" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        {vistaActiva === "foroLectura" && <VistaForo categoria="lectura" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        {vistaActiva === "proyectos" && <VistaProyectos defaultTab="tech" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        {vistaActiva === "sos" && <VistaProyectos defaultTab="sos" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        {vistaActiva === "cafeteria" && <VistaCafeteria nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "people like you" && <VistaConnect setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "juegos" && <VistaJuegos nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {/* RUTAS DE EMPLEABILIDAD Y BIENESTAR */}
        {['ofertas', 'networking', 'mentorias', 'bienestar'].includes(vistaActiva) && (
          <VistaEmpleabilidad 
            nombreUsuario={nombreUsuario} 
            vistaActiva={vistaActiva === 'bienestar' ? 'mentorias' : vistaActiva} 
            setVistaActiva={setVistaActiva} 
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#001a17]/95 backdrop-blur-md border-t border-white/10 flex justify-center py-2 px-4 z-50">
        <div className="flex justify-between max-w-4xl w-full">
          <button onClick={() => setVistaActiva("inicio")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "inicio" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Inicio</span></button>
          <button onClick={() => setVistaActiva("people like you")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "people like you" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Connect</span></button>
          <button onClick={() => setVistaActiva("clubs")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "clubs" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Clubs</span></button>
          <button onClick={() => setVistaActiva("juegos")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "juegos" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Juegos</span></button>
          <button onClick={() => setVistaActiva("bienestar")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "bienestar" || vistaActiva === "mentorias" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Salud</span></button>
        </div>
      </nav>

      {mostrarModalMusica && <ModalMusica musicaActivada={musicaActivada} setMusicaActivada={setMusicaActivada} setMostrarModalMusica={setMostrarModalMusica} />}
      {mostrarModalAvatar && <ModalAvatar avatarConfig={avatarConfig} setAvatarConfig={cambiarAvatar} setMostrarModalAvatar={setMostrarModalAvatar} getAvatarUrl={getAvatarUrl} />}

    </div>
  )
}

export default App
