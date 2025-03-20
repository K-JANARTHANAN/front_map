import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import teaIcon from "./tea.png";
import constructionIcon from "./construction.png";
import electricalIcon from "./electrical-service.png";
import plumbingIcon from "./plumbering.png";
import "./App.css";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

   
  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
    setMarkers(savedMarkers);
  }, []);

   
  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("map").setView([12.9716, 77.5946], 13); // Default to Bangalore

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      setMap(mapInstance);
    } else {
       
      markers.forEach((marker) => {
        addMarkerToMap(marker, map);
      });

      // Add double-click event to add new marker
      map.on("dblclick", (e) => {
        handleDoubleClick(e.latlng.lat, e.latlng.lng, map);
      });
    }
  }, [map, markers]);

  // Get icon based on job type
  const getJobIcon = (jobType) => {
    switch (jobType) {
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

  // Create marker with custom icon
  const createCustomIcon = (jobType) => {
    return L.icon({
      iconUrl: getJobIcon(jobType),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Add marker with existing data to the map
  const addMarkerToMap = (marker, mapInstance) => {
    const { lat, lng, jobType, duration, salary } = marker;

    L.marker([lat, lng], { icon: createCustomIcon(jobType) })
      .addTo(mapInstance)
      .bindPopup(
        `<b>Type of Job:</b> ${jobType}<br/>
         <b>Duration:</b> ${duration}<br/>
         <b>Salary:</b> ${salary}`
      );
  };

  // Handle double-click event to prompt for job details and add marker
  const handleDoubleClick = (lat, lng, mapInstance) => {
    const jobType = prompt(
      "Enter the type of job (farm work, mason, electrician, plumbing):",
      "farm work"
    );
    const duration = prompt("Enter duration of the job (e.g., 1 month):");
    const salary = prompt("Enter salary for the job:");

    if (jobType && duration && salary) {
      const newMarker = {
        lat,
        lng,
        jobType,
        duration,
        salary,
      };

      // Save to localStorage
      const updatedMarkers = [...markers, newMarker];
      setMarkers(updatedMarkers);
      localStorage.setItem("markers", JSON.stringify(updatedMarkers));

      // Add marker to the map
      addMarkerToMap(newMarker, mapInstance);
    } else {
      alert("Please fill in all the details to add a marker!");
    }
  };

  return (
    <div className="container">
      <h2>Double-click on the map to add a marker with job details</h2>

      {/* Display Map */}
      <div id="map"></div>
    </div>
  );
};

export default MapComponent;
