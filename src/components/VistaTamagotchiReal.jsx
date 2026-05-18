import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import '../TamagotchiReal.css'; // Importamos los estilos retro

// Configuración de la rejilla (píxeles)
const GRID_SIZE = { x: 60, y: 40 }; 
const PIXEL_SCALE = 4; // Tamaño de cada píxel en rem/px

// Placeholder de Píxel Art de un "Osito"
// Representamos el sprite como una matriz de encendido/apagado
const SPRITE_BEAR = [
  [0,0,1,1,0,0],
  [0,1,1,1,1,0],
  [1,1,1,1,1,1],
  [1,0,1,1,0,1], // Ojos
  [1,1,1,1,1,1],
  [0,1,0,0,1,0], // Boca/hocico simple
  [0,1,1,1,1,0],
  [0,1,0,0,1,0]  // Patas
];

export default function VistaTamagotchiReal({ nombreUsuario, setVistaActiva }) {
  // Estadísticas básicas
  const [stats, setStats] = useState(null);
  // Estado visual/físico
  const [pos, setPos] = useState({ x: GRID_SIZE.x / 2, y: GRID_SIZE.y / 2 });
  const [direction, setDirection] = useState(1); // 1 derecha, -1 izquierda
  const [action, setAction] = useState('idle'); // idle, walking, eating, sleeping, playing
  // Inventario y Dinero
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState([]);
  // UI Estados
  const [currentTab, setCurrentTab] = useState('main'); // main, shop, game, stats
  const [cargando, setCargando] = useState(true);
  const [gameInput, setGameInput] = useState('');
  const [gameMessage, setGameMessage] = useState('Adivina el nº (1-10)');
  const gameSecretNumber = useRef(Math.floor(Math.random() * 10) + 1);

  // 1. CARGAR/INICIAR MASCOTA REAL
  useEffect(() => {
    const cargarMascotaReal = async () => {
      if (!nombreUsuario) return;
      const ref = doc(db, "mascotas_real_usuarios", nombreUsuario);
      const snap = await getDoc(ref);
      const ahora = Date.now();

      if (snap.exists()) {
        const data = snap.data();
        const horasPasadas = (ahora - data.lastUpdate) / (1000 * 60 * 60);
        const desgaste = Math.floor(horasPasadas * 3); // Desgaste más rápido

        const nuevasStats = {
          hunger: Math.max(0, data.hunger - desgaste),
          happiness: Math.max(0, data.happiness - desgaste),
          energy: Math.max(0, data.energy - (desgaste / 2)),
          poopCount: data.poopCount + Math.floor(desgaste / 5),
          isAlive: data.hunger > 0 && data.energy > 0,
          lastUpdate: ahora
        };

        setStats(nuevasStats);
        setMoney(data.money || 50);
        setInventory(data.inventory || []);
        evaluarAccion(nuevasStats);
        if (desgaste > 0) await updateDoc(ref, nuevasStats);

      } else {
        // Mascota Nueva
        const inicial = { 
          hunger: 80, happiness: 80, energy: 100, 
          poopCount: 0, isAlive: true, money: 100, 
          inventory: [], lastUpdate: ahora 
        };
        await setDoc(ref, inicial);
        setStats(inicial);
        setMoney(100);
        evaluarAccion(inicial);
      }
      setCargando(false);
    };

    cargarMascotaReal();
  }, [nombreUsuario]);

  // 2. BUCLE DE MOVIMIENTO ALEATORIO
  useEffect(() => {
    if (!stats || !stats.isAlive || action === 'sleeping' || action === 'playing') return;

    const moveInterval = setInterval(() => {
      // 70% de probabilidad de moverse
      if (Math.random() > 0.3) {
        setAction('walking');
        const newDirection = Math.random() > 0.5 ? 1 : -1;
        setDirection(newDirection);
        
        setPos(prev => {
          const nextX = prev.x + newDirection * 2;
          const clampedX = Math.max(5, Math.min(GRID_SIZE.x - 10, nextX));
          // Probabilidad de subir/bajar un poco
          const clampedY = Math.max(10, Math.min(GRID_SIZE.y - 10, prev.y + (Math.random() > 0.5 ? 1 : -1)));
          return { x: clampedX, y: clampedY };
        });

        // Volver a idle tras moverse
        setTimeout(() => setAction('idle'), 400);
      }
    }, 2500); // Se mueve cada 2.5s

    return () => clearInterval(moveInterval);
  }, [stats, action]);

  const evaluarAccion = (s) => {
    if (!s.isAlive) setAction('dead');
    else if (s.energy < 20) setAction('sleeping');
    else setAction('idle');
  };

  // 3. INTERACCIONES DEL CORE
  const interactuar = async (tipo, item = null) => {
    if (!stats || !stats.isAlive) return;
    let s = { ...stats, lastUpdate: Date.now() };
    const ref = doc(db, "mascotas_real_usuarios", nombreUsuario);

    if (tipo === 'feed') {
      if (item) {
        s.hunger = Math.min(100, s.hunger + item.value);
        s.happiness = Math.min(100, s.happiness + 5);
        setAction('eating');
        // Quitar objeto del inventario
        setInventory(prev => prev.filter(i => i.id !== item.id));
        setTimeout(() => setAction('idle'), 1500);
      } else {
        alert("¡No tienes comida! Ve de compras."); return;
      }
    } 
    else if (tipo === 'clean') {
      s.poopCount = 0;
      s.happiness = Math.min(100, s.happiness + 10);
    }

    setStats(s);
    evaluarAccion(s);
    await updateDoc(ref, { ...s, inventory: inventory });
  };

  // 4. SISTEMA DE TIENDA
  const SHOP_ITEMS = [
    { id: 'burger', name: 'Hacker Burger', cost: 15, value: 40, type: 'food' },
    { id: 'pizza', name: 'Code Pizza', cost: 10, value: 25, type: 'food' },
    { id: 'toy', name: 'Rubber Duck', cost: 30, value: 50, type: 'toy' }
  ];

  const comprarObjeto = async (item) => {
    if (money < item.cost) { alert("¡Dinero insuficiente!"); return; }
    
    const newMoney = money - item.cost;
    const newItem = { ...item, id: `${item.id}_${Date.now()}` };
    const newInventory = [...inventory, newItem];

    setMoney(newMoney);
    setInventory(newInventory);

    await updateDoc(doc(db, "mascotas_real_usuarios", nombreUsuario), {
      money: newMoney,
      inventory: newInventory
    });
    alert(`Compraste ${item.name}`);
  };

  // 5. MINIJUEGO: ADIVINA EL NÚMERO
  const jugarMinijuego = async () => {
    const guess = parseInt(gameInput);
    if (isNaN(guess) || guess < 1 || guess > 10) { setGameMessage("Nº inválido (1-10)"); return; }

    let s = { ...stats, lastUpdate: Date.now() };
    const ref = doc(db, "mascotas_real_usuarios", nombreUsuario);
    let wonMoney = 0;

    if (guess === gameSecretNumber.current) {
      wonMoney = 20;
      setGameMessage("¡Correcto! +20C");
      const newMoney = money + wonMoney;
      setMoney(newMoney);
      s.happiness = Math.min(100, s.happiness + 20);
      gameSecretNumber.current = Math.floor(Math.random() * 10) + 1; // Reset
      await updateDoc(ref, { money: newMoney });
    } else {
      setGameMessage(guess > gameSecretNumber.current ? "Muy alto..." : "Muy bajo...");
      s.happiness = Math.min(100, s.happiness + 5); // Jugar sube un poco
      s.energy = Math.max(0, s.energy - 5);
    }

    setStats(s);
    setGameInput('');
    await updateDoc(ref, s);
  };

  // Renderizado del Sprite Pixelado
  const renderPixelSprite = () => {
    return (
      <div 
        className={`tama-sprite ${action}`} 
        style={{ 
          left: `${pos.x * PIXEL_SCALE}px`, 
          top: `${pos.y * PIXEL_SCALE}px`,
          transform: `scaleX(${direction})` // Girar sprite
        }}
      >
        {SPRITE_BEAR.map((row, y) => (
          row.map((on, x) => (
            on ? <div key={`${x}-${y}`} className="pixel on" style={{ left: `${x*PIXEL_SCALE}px`, top: `${y*PIXEL_SCALE}px` }} /> : null
          ))
        ))}
      </div>
    );
  };

  if (cargando) return <div className="text-emerald-400 text-center mt-20 font-bold tracking-widest uppercase">Cargando chip de Pixel-Paw...</div>;

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm uppercase tracking-widest text-xs">
          &larr; Campus Principal
        </button>
      </div>

      <div className="bg-[#00241f] p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row gap-10 relative overflow-hidden">
        
        {/* LA PANTALLA LCD */}
        <div className="md:w-3/5 flex flex-col items-center">
          <div className="tama-screen" style={{ width: `${GRID_SIZE.x * PIXEL_SCALE}px`, height: `${GRID_SIZE.y * PIXEL_SCALE}px` }}>
            {/* El Muñeco */}
            {renderPixelSprite()}
            
            {/* Las Cacitas */}
            {[...Array(stats.poopCount)].map((_, i) => (
              <div key={i} className="poop" style={{ left: `${10 + i*8}px`, bottom: '10px' }}>💩</div>
            ))}

            {/* Comida si está comiendo */}
            {action === 'eating' && <div className="food-item-pixel eating-anim" style={{ left: `${(pos.x + direction*6) * PIXEL_SCALE}px`, top: `${(pos.y + 2) * PIXEL_SCALE}px` }}></div>}

            {/* Estado Muerto */}
            {!stats.isAlive && <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-500 font-black z-50">SISTEMA OFFLINE</div>}
          </div>

          <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            Créditos: <span className="text-white">{money}C</span>
          </div>
        </div>

        {/* INTERFAZ DE CONTROL (Botones retro) */}
        <div className="md:w-2/5 flex flex-col gap-5">
          
          {/* Tabs de Navegación de interfaz */}
          <div className="flex gap-2 bg-black/20 p-1 rounded-full border border-white/5">
            {['main', 'shop', 'game', 'stats'].map(tab => (
              <button key={tab} onClick={() => setCurrentTab(tab)} className={`flex-1 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${currentTab === tab ? 'bg-emerald-400 text-black' : 'text-gray-500 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* CONTENIDO SEGÚN TAB */}
          <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex-1 min-h-[180px]">
            
            {currentTab === 'main' && (
              <div className="grid grid-cols-2 gap-3 h-full">
                <button onClick={() => interactuar('feed', inventory.find(i => i.type === 'food'))} className="tama-btn flex flex-col items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" /></svg>
                  Dar Comida
                </button>
                <button onClick={() => interactuar('clean')} className="tama-btn flex flex-col items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Limpiar 💩
                </button>
              </div>
            )}

            {currentTab === 'shop' && (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {SHOP_ITEMS.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-xs">
                    <span className="text-gray-300">{item.name} (+{item.value})</span>
                    <button onClick={() => comprarObjeto(item)} className="bg-cyan-400 text-black px-3 py-1 rounded-full font-bold text-[10px]">
                      {item.cost}C
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'game' && (
              <div className="text-center space-y-3 flex flex-col h-full justify-center">
                <p className="text-[10px] text-emerald-400 font-mono tracking-tighter bg-black p-2 rounded">{gameMessage}</p>
                <input type="number" min="1" max="10" value={gameInput} onChange={e => setGameInput(e.target.value)} className="w-full bg-[#001a17] border border-gray-700 p-2 rounded text-center text-white" />
                <button onClick={jugarMinijuego} className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest">Adivinar</button>
              </div>
            )}

            {currentTab === 'stats' && (
              <div className="space-y-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <p>Hambre: <span className="text-white">{stats.hunger}%</span></p>
                <p>RAM (RAM-pa): <span className="text-white">{stats.happiness}%</span></p>
                <p>CPU (Energía): <span className="text-white">{stats.energy}%</span></p>
                <p>Inventario: <span className="text-emerald-400">{inventory.length} items</span></p>
              </div>
            )}

          </div>

        </div>
      </div>
      
    </div>
  );
}
