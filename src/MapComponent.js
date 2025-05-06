// // MapComponent.jsx
// import React, { useEffect, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import teaIcon from "./tea.png";
// import constructionIcon from "./construction.png";
// import electricalIcon from "./electrical-service.png";
// import plumbingIcon from "./plumbering.png";
// import "./App.css";

// const MapComponent = () => {
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState([]);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [formData, setFormData] = useState({
//     lat: null,
//     lng: null,
//     jobType: "farm work",
//     duration: "",
//     salary: "",
//   });

//   // Load saved markers
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("markers")) || [];
//     setMarkers(saved);
//   }, []);

//   // Initialize map and render markers
//   useEffect(() => {
//     if (!map) {
//       const mapInstance = L.map("map").setView([12.9716, 77.5946], 13);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(mapInstance);
//       setMap(mapInstance);
//     } else {
//       // remove all Markers (preserve tile layer)
//       map.eachLayer(layer => {
//         if (layer instanceof L.Marker) map.removeLayer(layer);
//       });

//       // add each marker
//       markers.forEach(m => addMarkerToMap(m, map));

//       // double-click to open add form
//       map.off("dblclick").on("dblclick", e => {
//         setFormData({
//           lat: e.latlng.lat,
//           lng: e.latlng.lng,
//           jobType: "farm work",
//           duration: "",
//           salary: "",
//         });
//         setShowSidebar(true);
//       });
//     }
//   }, [map, markers]);

//   // pick icon
//   const getJobIcon = type => {
//     switch (type) {
//       case "farm work":
//         return teaIcon;
//       case "mason":
//         return constructionIcon;
//       case "electrician":
//         return electricalIcon;
//       case "plumbing":
//         return plumbingIcon;
//       default:
//         return teaIcon;
//     }
//   };

//   const createCustomIcon = jobType =>
//     L.icon({
//       iconUrl: getJobIcon(jobType),
//       iconSize: [32, 32],
//       iconAnchor: [16, 32],
//       popupAnchor: [0, -32],
//     });

//   // add marker + bindPopup
//   const addMarkerToMap = (marker, mapInstance) => {
//     const { lat, lng, jobType, duration, salary } = marker;
//     const m = L.marker([lat, lng], { icon: createCustomIcon(jobType) }).addTo(
//       mapInstance
//     );
//     // bind popup content
//     m.bindPopup(
//       `<b>Type of Job:</b> ${jobType}<br/>
//        <b>Duration:</b> ${duration}<br/>
//        <b>Salary:</b> ${salary}`
//     );
//     // open popup on click
//     m.on("click", () => m.openPopup());
//   };

//   // handle form submit
//   const handleFormSubmit = e => {
//     e.preventDefault();
//     const { lat, lng, jobType, duration, salary } = formData;
//     if (!duration || !salary) {
//       alert("Please fill in duration and salary.");
//       return;
//     }
//     const newMarker = { lat, lng, jobType, duration, salary };
//     const updated = [...markers, newMarker];
//     setMarkers(updated);
//     localStorage.setItem("markers", JSON.stringify(updated));
//     setShowSidebar(false);
//   };

//   return (
//     <div className="container">
//       <h2>Double-click on the map to add a marker</h2>
//       <div id="map" />

//       {showSidebar && (
//         <div className="sidebar">
//           <h3>Add Job Details</h3>
//           <form onSubmit={handleFormSubmit}>
//             <label>Job Type:</label>
//             <select
//               value={formData.jobType}
//               onChange={e =>
//                 setFormData({ ...formData, jobType: e.target.value })
//               }
//             >
//               <option value="farm work">Farm Work</option>
//               <option value="mason">Mason</option>
//               <option value="electrician">Electrician</option>
//               <option value="plumbing">Plumbing</option>
//             </select>

//             <label>Duration:</label>
//             <input
//               type="text"
//               placeholder="e.g. 1 month"
//               value={formData.duration}
//               onChange={e =>
//                 setFormData({ ...formData, duration: e.target.value })
//               }
//             />

//             <label>Salary:</label>
//             <input
//               type="text"
//               placeholder="e.g. ₹10000"
//               value={formData.salary}
//               onChange={e =>
//                 setFormData({ ...formData, salary: e.target.value })
//               }
//             />

//             <button type="submit">Submit</button>
//             <button type="button" onClick={() => setShowSidebar(false)}>
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapComponent;



  import React, { useEffect, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import teaIcon from "./tea.png";
import constructionIcon from "./construction.png";
import electricalIcon from "./electrical-service.png";
import plumbingIcon from "./plumbering.png";
import "./App.css";

// 🔗 Updated to use Render backend
const API_URL = "https://backendmap-2-pujn.onrender.com/api/markers";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState({
    lat: null,
    lng: null,
    jobType: "farm work",
    duration: "",
    salary: "",
  });

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setMarkers(res.data))
      .catch((err) => console.error("Failed to fetch markers:", err));
  }, []);

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("map").setView([12.9716, 77.5946], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);
    } else {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });

      markers.forEach((m) => addMarkerToMap(m, map));

      map.off("dblclick").on("dblclick", (e) => {
        setFormData({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          jobType: "farm work",
          duration: "",
          salary: "",
        });
        setShowSidebar(true);
      });
    }
  }, [map, markers]);

  const getIconUrl = (type) => {
    switch (type) {
      case "farm work":
        return teaIcon;
      case "mason":
        return constructionIcon;
      case "electrician":
        return electricalIcon;
      case "plumbing":
        return plumbingIcon;
      default:
        return teaIcon;
    }
  };

  const createIcon = (type) =>
    L.icon({
      iconUrl: getIconUrl(type),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

  const addMarkerToMap = (marker, mapInstance) => {
    const { lat, lng, jobType, duration, salary } = marker;
    const m = L.marker([lat, lng], { icon: createIcon(jobType) }).addTo(
      mapInstance
    );
    m.bindPopup(
      `<b>Type of Job:</b> ${jobType}<br/><b>Duration:</b> ${duration}<br/><b>Salary:</b> ${salary}`
    );
    m.on("click", () => m.openPopup());
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { lat, lng, jobType, duration, salary } = formData;
    if (!duration || !salary) {
      return alert("Please fill in duration and salary.");
    }

    axios
      .post(API_URL, formData)
      .then((res) => {
        setMarkers((prev) => [...prev, res.data]);
        setShowSidebar(false);
      })
      .catch((err) => console.error("Failed to save marker:", err));
  };

  return (
    <div className="container">
      <h2>Double-click on the map to add a marker</h2>
      <div id="map" />

      {showSidebar && (
        <div className="sidebar">
          <h3>Add Job Details</h3>
          <form onSubmit={handleFormSubmit}>
            <label>Job Type:</label>
            <select
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
            >
              <option value="farm work">Farm Work</option>
              <option value="mason">Mason</option>
              <option value="electrician">Electrician</option>
              <option value="plumbing">Plumbing</option>
            </select>

            <label>Duration:</label>
            <input
              type="text"
              placeholder="e.g. 1 month"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />

            <label>Salary:</label>
            <input
              type="text"
              placeholder="e.g. ₹10000"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />

            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowSidebar(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
