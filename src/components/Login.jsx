import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { SAMLAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Login() {
  const [errorAuth, setErrorAuth] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorAuth("");
    setCargando(true);
    
    // ⚠️ AQUÍ ESTÁ EL CAMBIO MAGNO: Usamos el proveedor SAML
    // Asegúrate de que en Firebase le pusiste exactamente 'saml.google' como ID
    const provider = new SAMLAuthProvider('saml.google'); 
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email.toLowerCase();

      // 🛡️ FILTRO DE SEGURIDAD: Solo correos de IMMUNE
      if (!email.endsWith("@immune.institute")) {
        await signOut(auth);
        setErrorAuth("🚨 Acceso denegado: Debes usar tu cuenta de @immune.institute");
        setCargando(false);
        return;
      }

      // 🛡️ GESTIÓN DE PERFIL EN FIRESTORE
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);

      // Si es un usuario nuevo, le creamos el perfil automáticamente
      if (!userDoc.exists()) {
        const prefijoCorreo = email.split('@')[0];
        // Convertimos "juan.perez" en "Juan Perez"
        const nombreBonito = prefijoCorreo
          .split('.')
          .map(p => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ');

        await setDoc(userDocRef, {
          nombre: nombreBonito,
          pais: "España",
          avatarConfig: { top: "none", skinColor: "614335", eyes: "closed", mouth: "serious", accessories: "blank" }
        });
      }

    } catch (error) {
      console.error("Error en Login SAML:", error);
      
      // Capturamos el error para que puedas verlo en pantalla si algo falla
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorAuth(`❌ Error: ${error.message || "No se pudo conectar con el servidor SAML."}`);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#00241f] p-4 text-white font-sans">
      <div className="bg-[#001a17] p-10 rounded-3xl border border-emerald-400/20 shadow-2xl w-full max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-[#00241f] rounded-2xl border border-white/5 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-emerald-400 mb-2 tracking-tighter">IMMUNE <span className="text-white font-light">Connect</span></h1>
        <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-widest font-bold">Campus Virtual</p>

        {errorAuth && (
          <div className="w-full bg-red-400/10 border border-red-400/30 p-3 rounded-xl mb-6 text-red-400 text-xs font-bold text-center animate-pulse">
            {errorAuth}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          disabled={cargando}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl text-sm hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {!cargando && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {cargando ? "CONECTANDO..." : "ACCESO INSTITUCIONAL"}
        </button>
      </div>
    </div>
  );
}

export default Login;
