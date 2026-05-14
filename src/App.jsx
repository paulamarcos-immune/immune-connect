import React, { useState, useEffect, useRef } from 'react'
import { db, auth } from './firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth'

import ModalMusica from './components/ModalMusica'
import ModalNombre from './components/ModalNombre'
import ModalAvatar from './components/ModalAvatar'
import VistaJuegos from './components/VistaJuegos'
import VistaProyectos from './components/VistaProyectos'
import VistaForo from './components/VistaForo'
import VistaCafeteria from './components/VistaCafeteria'
import VistaClubs from './components/VistaClubs'
import VistaChatGlobal from './components/VistaChatGlobal'
import VistaSpotify from './components/VistaSpotify'
import VistaMadrid from './components/VistaMadrid' 

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [modoAuth, setModoAuth] = useState("login");
  const [emailAuth, setEmailAuth] = useState("");
  const [passwordAuth, setPasswordAuth] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const [mensajeExito, setMensajeExito] = useState(""); // Nuevo estado para avisar del correo

  const [vistaActiva, setVistaActiva] = useState("inicio");

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [paisUsuario, setPaisUsuario] = useState("España");
  const [musicaActivada, setMusicaActivada] = useState(false);
  const [ultimaFechaCambioNombre, setUltimaFechaCambioNombre] = useState(null);

  const [avatarConfig, setAvatarConfig] = useState({
    top: "none", 
    skinColor: "614335", 
    eyes: "closed",      
    mouth: "serious",
    accessories: "blank"
  });

  const [mostrarModalMusica, setMostrarModalMusica] = useState(false);
  const [mostrarModalNombre, setMostrarModalNombre] = useState(false);
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
    if (audioRef.current) {
      if (musicaActivada) {
        audioRef.current.play().catch(error => console.log("Esperando interacción del usuario."));
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicaActivada]);

  useEffect(() => {
    if (window.location.hash.includes("access_token")) setVistaActiva("spotify");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 🛡️ ESCUDO 3: Solo entra si existe Y si ha verificado su correo
      if (user && user.emailVerified) {
        setUsuarioLogueado(user);
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNombreUsuario(data.nombre);
          setPaisUsuario(data.pais || "España");
          if (data.avatarConfig) setAvatarConfig(data.avatarConfig);
          if (data.ultimaFechaCambioNombre) {
            setUltimaFechaCambioNombre(data.ultimaFechaCambioNombre.toDate ? data.ultimaFechaCambioNombre.toDate() : new Date(data.ultimaFechaCambioNombre));
          }
        }
      } else {
        setUsuarioLogueado(null);
      }
      setCargandoAuth(false);
    });
    return () => unsubscribe();
  }, []);

 const handleLoginRegistro = async (e) => {
    e.preventDefault();
    setErrorAuth("");
    setMensajeExito("");

    const correoLimpio = emailAuth.trim().toLowerCase();
    const emailRegex = /^[a-zñáéíóúü]+\.[a-zñáéíóúü]+@immune\.institute$/;

    if (!emailRegex.test(correoLimpio)) {
      setErrorAuth("Algo no está bien."); 
      return; 
    }

    try {
      if (modoAuth === "registro") {
        const cred = await createUserWithEmailAndPassword(auth, correoLimpio, passwordAuth);
        await sendEmailVerification(cred.user);
        
        await setDoc(doc(db, "usuarios", cred.user.uid), {
          nombre: nombreUsuario || "Nuevo Alumno",
          pais: paisUsuario,
          avatarConfig: avatarConfig,
          ultimaFechaCambioNombre: null
        });

        localStorage.setItem("immune_registros_count", (parseInt(localStorage.getItem("immune_registros_count") || 0) + 1));
        await signOut(auth);
        setModoAuth("login");
        setMensajeExito("Registro completado. Se ha enviado un enlace de verificación a tu correo.");

      } else {
        // --- LOGIN PARA USUARIOS YA CREADOS ---
        const cred = await signInWithEmailAndPassword(auth, correoLimpio, passwordAuth);
        
        if (!cred.user.emailVerified) {
          // 🛡️ Si el usuario existe pero no está verificado, le enviamos el correo AHORA
          await sendEmailVerification(cred.user);
          await signOut(auth);
          setMensajeExito("Tu cuenta aún no está verificada. Acabamos de enviarte un nuevo enlace a tu correo institucional. ¡Revisalo!");
          return;
        }
        
        setMusicaActivada(true);
      }

    } catch (error) {
      // Si el error es que el usuario no existe o contraseña mal
      setErrorAuth("Algo no está bien."); 
    }
  };

  const cerrarSesion = () => {
    setMusicaActivada(false);
    signOut(auth);
  };

  const cambiarNombreConFecha = async (nuevoNombre) => {
    setNombreUsuario(nuevoNombre);
    const ahora = new Date();
    setUltimaFechaCambioNombre(ahora);
    if (auth.currentUser) {
      await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
        nombre: nuevoNombre,
        ultimaFechaCambioNombre: serverTimestamp()
      }, { merge: true });
    }
  };

  const cambiarAvatar = async (nuevaConfig) => {
    setAvatarConfig(nuevaConfig); 
    if (auth.currentUser) {
      await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
        avatarConfig: nuevaConfig
      }, { merge: true });
    }
  };

  const intentarAbrirModalNombre = () => {
    if (ultimaFechaCambioNombre) {
      const ahora = new Date();
      const diferenciaTiempo = ahora.getTime() - ultimaFechaCambioNombre.getTime();
      const unaSemanaMs = 7 * 24 * 60 * 60 * 1000;
      if (diferenciaTiempo < unaSemanaMs) {
        const tiempoRestante = unaSemanaMs - diferenciaTiempo;
        const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
        const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        alert(`Límite de seguridad: debes esperar ${dias} días y ${horas} horas más para cambiar tu nombre.`);
        return;
      }
    }
    setMostrarModalNombre(true);
  };

  if (cargandoAuth) return <div className="h-screen flex items-center justify-center bg-[#00241f] text-emerald-400 font-bold">Cargando IMMUNE Connect...</div>;

  if (!usuarioLogueado) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#00241f] p-4 text-white font-sans">
        <div className="bg-[#001a17] p-8 rounded-3xl border border-emerald-400/20 shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tighter text-center mb-2">IMMUNE <span className="text-white font-light">Connect</span></h1>
          
         {mensajeExito && (
  <div className="mb-4 space-y-2 animate-in fade-in zoom-in duration-300">
    <p className="text-emerald-400 text-xs text-center font-bold bg-emerald-400/10 p-2 rounded border border-emerald-400/30">
      {mensajeExito}
    </p>
    <p className="text-red-400 text-[11px] text-center font-black uppercase tracking-widest bg-red-400/10 p-3 rounded-lg border border-red-400/30 shadow-[0_0_15px_rgba(248,113,113,0.2)]">
      ⚠️ IMPORTANTE: Revisa tu carpeta de SPAM o "Correo No Deseado". El email suele esconderse ahí.
    </p>
  </div>
)}
          
          <form onSubmit={handleLoginRegistro} className="space-y-4">
            {modoAuth === "registro" && (
              <>
                <input type="text" placeholder="Tu Nombre" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} className="w-full bg-[#00241f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" required />
                <select value={paisUsuario} onChange={(e) => setPaisUsuario(e.target.value)} className="w-full bg-[#00241f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                  {Object.keys(banderas).map(pais => <option key={pais} value={pais}>{pais} {banderas[pais]}</option>)}
                </select>
              </>
            )}
            <input type="email" placeholder="Correo (nombre.apellido@immune.institute)" value={emailAuth} onChange={(e) => setEmailAuth(e.target.value)} className="w-full bg-[#00241f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" required />
            <input type="password" placeholder="Contraseña" value={passwordAuth} onChange={(e) => setPasswordAuth(e.target.value)} className="w-full bg-[#00241f] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" required />
            
            {errorAuth && <p className="text-red-400 text-xs text-center">{errorAuth}</p>}
            
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black py-3 rounded-xl text-sm uppercase">{modoAuth === "login" ? "Entrar" : "Registrarme"}</button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6 cursor-pointer hover:text-emerald-400" onClick={() => {setModoAuth(modoAuth === "login" ? "registro" : "login"); setErrorAuth(""); setMensajeExito("");}}>{modoAuth === "login" ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}</p>
        </div>
      </div>
    );
  }

  const linkMenuClass = (vista) => `w-full flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${vistaActiva === vista ? "bg-emerald-400/10 text-emerald-400 font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white text-left"}`;

  return (
    <div className="flex h-screen bg-[#00241f] text-white font-sans overflow-hidden relative">
      
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" loop />

      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-6 bg-[#001a17] z-10 hidden md:flex">
        <h1 className="text-2xl font-bold text-emerald-400 tracking-tighter">IMMUNE <span className="text-white font-light">Connect</span></h1>
        
        <nav className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
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

          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 px-2">Tu Perfil</p>
            <div className="space-y-4 px-2 text-sm text-gray-400">
              <div className="flex justify-between items-center cursor-pointer hover:text-white transition" onClick={() => setMostrarModalMusica(true)}>
                <span>Configuración</span>
                <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {musicaActivada && <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                </div>
              </div>
              <div className="flex justify-between items-center cursor-pointer hover:text-white transition" onClick={intentarAbrirModalNombre}>
                <span>Nombre</span>
                <span className="text-xs text-emerald-400 truncate max-w-[80px]">{nombreUsuario}</span>
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
              <h2 className="text-xl md:text-2xl font-bold uppercase italic cursor-pointer hover:text-emerald-400 transition leading-tight" onClick={intentarAbrirModalNombre}>
                Hola, <br className="block sm:hidden" />{nombreUsuario} <span className="text-gray-400 font-normal text-sm md:text-base">({paisUsuario})</span>
              </h2>
            </div>
          </div>
          <div className="hidden md:flex gap-4 items-center">
             <span className="text-sm text-gray-400">IMMUNE.edu</span>
             <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden border border-emerald-400"><img src={getAvatarUrl(avatarConfig)} alt="avatar" /></div>
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

        {/* TODAS LAS RUTAS CORRECTAMENTE CONECTADAS */}
        {vistaActiva === "spotify" && <VistaSpotify setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "chats" && (
          <VistaChatGlobal nombreUsuario={nombreUsuario} paisUsuario={paisUsuario} banderaActual={banderaActual} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} isWidget={false} />
        )}
        
        {vistaActiva === "clubs" && <VistaClubs setVistaActiva={setVistaActiva} paisUsuario={paisUsuario} />}
        
        {vistaActiva === "madrid" && <VistaMadrid setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "foroCine" && <VistaForo categoria="cine" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "foroLectura" && <VistaForo categoria="lectura" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "proyectos" && <VistaProyectos defaultTab="tech" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "sos" && <VistaProyectos defaultTab="sos" nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "cafeteria" && <VistaCafeteria nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "people like you" && <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10"><section className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div><h3 className="font-bold text-emerald-400 uppercase text-2xl mb-2 tracking-widest relative z-10">People like you</h3><p className="text-gray-300 text-sm mb-6 uppercase tracking-widest relative z-10">Descubre alumnos con tus mismos intereses</p></section></div>}
        
        {vistaActiva === "juegos" && <VistaJuegos nombreUsuario={nombreUsuario} avatarConfig={avatarConfig} getAvatarUrl={getAvatarUrl} setVistaActiva={setVistaActiva} />}
        
        {vistaActiva === "bienestar" && <div className="p-8 text-center border-2 border-dashed border-emerald-400/30 rounded-2xl mt-10"><h2 className="text-emerald-400 font-bold uppercase mb-2">Bienestar y Apoyo</h2><p className="text-gray-400 text-sm">Apoyo psicológico y académico confidencial.</p></div>}
        
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#001a17]/95 backdrop-blur-md border-t border-white/10 flex justify-center py-2 px-4 z-50">
        <div className="flex justify-between max-w-4xl w-full">
          <button onClick={() => setVistaActiva("inicio")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "inicio" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Inicio</span></button>
          <button onClick={() => setVistaActiva("people like you")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "people like you" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Connect</span></button>
          <button onClick={() => setVistaActiva("clubs")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "clubs" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Clubs</span></button>
          <button onClick={() => setVistaActiva("juegos")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "juegos" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Juegos</span></button>
          <button onClick={() => setVistaActiva("bienestar")} className={`flex-1 flex flex-col items-center gap-1 p-2 border-b-2 transition-colors ${vistaActiva === "bienestar" ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-400 hover:text-white"}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span className="text-[10px] uppercase font-bold tracking-wider">Salud</span></button>
        </div>
      </nav>

      {mostrarModalMusica && <ModalMusica musicaActivada={musicaActivada} setMusicaActivada={setMusicaActivada} setMostrarModalMusica={setMostrarModalMusica} />}
      {mostrarModalNombre && <ModalNombre nombreActual={nombreUsuario} setNombreUsuario={cambiarNombreConFecha} setMostrarModalNombre={setMostrarModalNombre} />}
      {mostrarModalAvatar && <ModalAvatar avatarConfig={avatarConfig} setAvatarConfig={cambiarAvatar} setMostrarModalAvatar={setMostrarModalAvatar} getAvatarUrl={getAvatarUrl} />}

    </div>
  )
}

export default App
