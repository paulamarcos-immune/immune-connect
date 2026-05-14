import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Login() {
  const [errorAuth, setErrorAuth] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorAuth("");
    setCargando(true);
    
    const provider = new GoogleAuthProvider();
    // Esto obliga a Google a pedir la cuenta siempre, para que no entre con una personal por error
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email.toLowerCase();

      // 🛡️ FILTRO DE DOMINIO
      if (!email.endsWith("@immune.institute")) {
        await signOut(auth);
        setErrorAuth("🚨 Acceso denegado: Usa tu cuenta @immune.institute");
        setCargando(false);
        return;
      }

      // 🛡️ CREACIÓN DE PERFIL AUTOMÁTICA
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const prefijoCorreo = email.split('@')[0];
        // Convertimos "paula.marcos" en "Paula Marcos"
        const nombreLimpio = prefijoCorreo.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

        await setDoc(userDocRef, {
          nombre: nombreLimpio,
          pais: "España",
          avatarConfig: { top: "none", skinColor: "614335", eyes: "closed", mouth: "serious", accessories: "blank" }
        });
      }

    } catch (error) {
      console.error("Error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorAuth("❌ Error al conectar con Google.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#00241f] p-4 text-white">
      <div className="bg-[#001a17] p-10 rounded-3xl border border-emerald-400/20 shadow-2xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">IMMUNE <span className="text-white font-light">Connect</span></h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Inicia sesión con tu cuenta de la escuela</p>

        {errorAuth && (
          <div className="w-full bg-red-400/10 border border-red-400/30 p-3 rounded-xl mb-6 text-red-400 text-xs font-bold text-center">
            {errorAuth}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          disabled={cargando}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl text-sm hover:bg-gray-200 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {cargando ? "Cargando..." : "Entrar con Google"}
        </button>
      </div>
    </div>
  );
}

export default Login;
