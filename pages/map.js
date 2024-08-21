import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });
const CountryMap = dynamic(() => import('../components/CountryMap'), { ssr: false });

export default function MapPage() {
  const [nodes, setNodes] = useState([]);
  const [activeMap, setActiveMap] = useState('pin');

  useEffect(() => {
    async function fetchNodes() {
      const response = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
      const data = await response.json();
      setNodes(data.payload);
    }
    fetchNodes();
  }, []);

  return (
    <div className="map-page" style={{ height: '100vh', width: '100vw' }}>
      <Head>
        <title>Node Locations Map</title>
      </Head>
      <div className="map-controls" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={() => setActiveMap('pin')}>Pin Map</button>
        <button onClick={() => setActiveMap('country')}>Country Map</button>
      </div>
      <div className="map-container" style={{ height: '100%', width: '100%' }}>
        {activeMap === 'pin' ? (
          <WorldMap nodes={nodes} />
        ) : (
          <CountryMap nodes={nodes} />
        )}
      </div>
    </div>
  );
}


// pages/index.js
// import { useEffect, useState } from 'react';
// import WorldMap from '../components/WorldMap';

// export default function Home() {
//   const [nodes, setNodes] = useState([]);

//   useEffect(() => {
//     async function fetchNodes() {
//       const response = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
//       const data = await response.json();
//       setNodes(data.payload);
//     }
//     fetchNodes();
//   }, []);

//   return (
//     <div>
//       <h1>World Map of Nodes</h1>
//       <WorldMap nodes={nodes} />
//     </div>
//   );
// }
