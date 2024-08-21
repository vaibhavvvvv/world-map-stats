// import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Custom icon
// const customIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
//   shadowSize: [41, 41],
// });

// export default function WorldMap({ nodes }) {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0">
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         style={{ height: '100%', width: '100%' }}
//         maxBounds={[[-90, -180], [90, 180]]}
//         maxBoundsViscosity={1.0}
//       >
//         <TileLayer
//           url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//           noWrap={true}
//         />
//         {nodes.map((node) => {
//           const [lat, lon] = node.ipinfolocation.split(',').map(Number);
//           return (
//             <Marker key={node.id} position={[lat, lon]} icon={customIcon}>
//               <Popup>
//                 <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
//                   <h6 className="text-blue-400 text-lg font-semibold">{node.name}</h6>
//                   {Object.entries(node).map(([key, value]) => (
//                     <p key={key} className="text-md">
//                       <span className="font-bold">{key}:</span> {JSON.stringify(value)}
//                     </p>
//                   ))}
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }


// // components/WorldMap.js
// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Dynamically import components with ssr: false
// const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
// const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
// const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

// // Define a custom animated icon
// const animatedIcon = L.divIcon({
//   className: 'custom-animated-icon',
//   html: `
//     <div style="
//       width: 20px;
//       height: 20px;
//       background: radial-gradient(circle, #FF5F6D, #FFC371);
//       border-radius: 50%;
//       animation: pulse 2s infinite;
//     "></div>
//   `,
//   iconSize: [20, 20],
//   iconAnchor: [10, 10],
//   popupAnchor: [0, -10],
// });

// const WorldMap = ({ nodes }) => {
//   const [isClient, setIsClient] = useState(false);
//   const [offsets, setOffsets] = useState({});

//   useEffect(() => {
//     setIsClient(true);

//     // Initialize offsets
//     const offsetMap = {};
//     nodes.forEach((node) => {
//       const [lat, lon] = node.ipinfolocation.split(',').map(Number);
//       const key = `${lat},${lon}`;
//       if (!offsetMap[key]) {
//         offsetMap[key] = [0, 0];
//       } else {
//         // Apply a small offset if multiple markers have the same coordinates
//         offsetMap[key] = [offsetMap[key][0] + 0.01, offsetMap[key][1] + 0.01];
//       }
//     });
//     setOffsets(offsetMap);
//   }, [nodes]);

//   if (!isClient) {
//     return null;
//   }

//   return (
//     <>
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         minZoom={2}
//         maxZoom={5}
//         style={{ height: '500px', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {nodes.map((node, index) => {
//           const [lat, lon] = node.ipinfolocation.split(',').map(Number);
//           const key = `${lat},${lon}`;
//           const offset = offsets[key] || [0, 0];
//           return (
//             <Marker
//               key={index}
//               position={[lat + offset[0], lon + offset[1]]}
//               icon={animatedIcon}
//             >
//               <Popup>
//                 <div className="popup-content">
//                   <h3 className="popup-title">{node.name}</h3>
//                   <p><strong>Country:</strong> {node.ipinfocountry}</p>
//                   <p><strong>City:</strong> {node.ipinfocity}</p>
//                   <p><strong>Node Name:</strong> {node.nodename}</p>
//                   <p><strong>Download Speed:</strong> {node.downloadSpeed} Mbps</p>
//                   <p><strong>Upload Speed:</strong> {node.uploadSpeed} Mbps</p>
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//       <style jsx>{`
//         @keyframes pulse {
//           0% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.2);
//           }
//           100% {
//             transform: scale(1);
//           }
//         }

//         .popup-content {
//           font-family: Arial, sans-serif;
//           font-size: 14px;
//           line-height: 1.6;
//           color: #333;
//           background-color: #f9f9f9;
//           border-radius: 8px;
//           padding: 10px;
//           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//         }

//         .popup-title {
//           margin-top: 0;
//           font-size: 16px;
//           font-weight: bold;
//           color: #FF5F6D;
//         }

//         .popup-content p {
//           margin: 5px 0;
//         }

//         .popup-content strong {
//           color: #333;
//         }
//       `}</style>
//     </>
//   );
// };

// export default WorldMap;

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function WorldMap() {
  const [nodes, setNodes] = useState([]);
  const socketRef = useRef(null); // Use ref to maintain WebSocket across renders

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = function () {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      console.log('Received:', event.data);
    };

    socket.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    socket.onclose = function (event) {
      console.log('WebSocket is closed now.', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    function connectWebSocket() {
      // Initialize the WebSocket connection
      socketRef.current = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

      // Handle the WebSocket connection opening
      socketRef.current.onopen = function () {
        console.log('WebSocket is open now.');
      };

      // Handle incoming WebSocket messages
      socketRef.current.onmessage = function (event) {
        const newNode = JSON.parse(event.data);
        setNodes((prevNodes) => {
          const existingIndex = prevNodes.findIndex((node) => node.id === newNode.id);
          if (existingIndex !== -1) {
            return prevNodes.map((node) => (node.id === newNode.id ? newNode : node));
          } else {
            return [...prevNodes, newNode];
          }
        });
      };

      // Handle WebSocket errors
      socketRef.current.onerror = function (event) {
        console.error('WebSocket error:', event);
      };

      // Handle WebSocket closure
      socketRef.current.onclose = function () {
        console.log('WebSocket is closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
      };
    }

    // Establish WebSocket connection
    connectWebSocket();

    // Cleanup function
    return () => {
      console.log('Cleaning up WebSocket connection...');
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this runs once

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodes.map((node) => {
          const [lat, lon] = node.co_ordinates.split(',').map(Number);
          return (
            <Marker key={node.id} position={[lat, lon]} icon={customIcon}>
              <Popup>
                <div className="text-blue-800">
                  <h6 className="text-blue-600 text-lg "><strong>Address:</strong> {node.location}</h6>
                  <p><strong>Gateway:</strong> {node.gateway}</p>
                  <p><strong>Price per Minute:</strong> {node.price_per_min}</p>
                  <p><strong>Wallet Address:</strong> <span style={{ wordWrap: 'break-word' }}>{node.wallet_address}</span></p>
                  <p><strong>Chain Name:</strong> {node.chain_name}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
