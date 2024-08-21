// import { useState, useEffect, useMemo } from 'react';
// import { MapContainer, GeoJSON, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import countryData from '../data/countries.json';

// function CountryPopup({ countryNodes }) {
//   const [content, setContent] = useState(null);
//   const map = useMap();

//   useEffect(() => {
//     const popup = L.popup();

    

//     map.on('click', function (e) {
//       map.eachLayer((layer) => {
//         if (layer instanceof L.GeoJSON) {
//           const results = layer.getLayers().filter((l) => {
//             if (l.feature && l.feature.geometry) {
//               return isPointInPolygon(e.latlng, l.feature.geometry.coordinates);
//             }
//             return false;
//           });
//           if (results.length > 0) {
//             const country = results[0].feature.properties;
//             const nodes = countryNodes[country.iso] || [];
//             if (nodes.length > 0) {
//               const nodeNames = nodes.map(node => node.nodename).join(', ');
//               setContent(`<b>${country.name}</b><br>Nodes: ${nodeNames}`);
//               popup
//                 .setLatLng(e.latlng)
//                 .setContent(`<b>${country.name}</b><br>Nodes: ${nodeNames}`)
//                 .openOn(map);
//             }
//           }
//         }
//       });
//     });

//     return () => {
//       map.off('click');
//     };
//   }, [map, countryNodes]);

//   return content ? <Popup position={map.getCenter()}>{content}</Popup> : null;
// }

// function isPointInPolygon(point, coords) {
//   const x = point.lng, y = point.lat;
//   let inside = false;
//   for (let i = 0, j = coords[0].length - 1; i < coords[0].length; j = i++) {
//     const xi = coords[0][i][0], yi = coords[0][i][1];
//     const xj = coords[0][j][0], yj = coords[0][j][1];
//     const intersect = ((yi > y) !== (yj > y))
//         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//     if (intersect) inside = !inside;
//   }
//   return inside;
// }

// export default function CountryMap({ nodes }) {
//   const [countryNodes, setCountryNodes] = useState({});

//   useEffect(() => {
//     const nodesByCountry = nodes.reduce((acc, node) => {
//       const country = node.ipinfocountry;
//       if (!acc[country]) {
//         acc[country] = [];
//       }
//       acc[country].push(node);
//       return acc;
//     }, {});
//     setCountryNodes(nodesByCountry);
//   }, [nodes]);

//   const processedCountryData = useMemo(() => {
//     return {
//       type: "FeatureCollection",
//       features: countryData.features.map(feature => ({
//         type: "Feature",
//         properties: {
//           name: feature.properties.NAME,
//           iso: feature.properties.ISO_A2
//         },
//         geometry: feature.geometry
//       }))
//     };
//   }, []);

//   const style = (feature) => {
//     const countryCode = feature.properties.iso;
//     const hasNodes = countryNodes[countryCode]?.length > 0;
//     return {
//       fillColor: hasNodes ? '#FD8D3C' : '#FFF7BC',
//       weight: 1,
//       opacity: 1,
//       color: 'white',
//       fillOpacity: 0.7
//     };
//   };

//   return (
//     <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
//       <GeoJSON
//         data={processedCountryData}
//         style={style}
//       />
//       <CountryPopup countryNodes={countryNodes} />
//     </MapContainer>
//   );
// }


// components/CountryMap.js
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamically import components with ssr: false
const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

// Define a custom animated icon
const animatedIcon = L.divIcon({
  className: 'custom-animated-icon',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #FF5F6D, #FFC371);
      border-radius: 50%;
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const CountryMap = ({ nodes }) => {
  const [isClient, setIsClient] = useState(false);
  const [offsets, setOffsets] = useState({});

  useEffect(() => {
    setIsClient(true);

    // Initialize offsets
    const offsetMap = {};
    nodes.forEach((node) => {
      const [lat, lon] = node.ipinfolocation.split(',').map(Number);
      const key = `${lat},${lon}`;
      if (!offsetMap[key]) {
        offsetMap[key] = [0, 0];
      } else {
        // Apply a small offset if multiple markers have the same coordinates
        offsetMap[key] = [offsetMap[key][0] + 0.01, offsetMap[key][1] + 0.01];
      }
    });
    setOffsets(offsetMap);
  }, [nodes]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={5}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodes.map((node, index) => {
          const [lat, lon] = node.ipinfolocation.split(',').map(Number);
          const key = `${lat},${lon}`;
          const offset = offsets[key] || [0, 0];
          return (
            <Marker
              key={index}
              position={[lat + offset[0], lon + offset[1]]}
              icon={animatedIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="popup-title">{node.name}</h3>
                  <p><strong>Country:</strong> {node.ipinfocountry}</p>
                  <p><strong>City:</strong> {node.ipinfocity}</p>
                  <p><strong>Node Name:</strong> {node.nodename}</p>
                  <p><strong>Download Speed:</strong> {node.downloadSpeed} Mbps</p>
                  <p><strong>Upload Speed:</strong> {node.uploadSpeed} Mbps</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .popup-content {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .popup-title {
          margin-top: 0;
          font-size: 16px;
          font-weight: bold;
          color: #FF5F6D;
        }

        .popup-content p {
          margin: 5px 0;
        }

        .popup-content strong {
          color: #333;
        }
      `}</style>
    </>
  );
};

export default CountryMap;
