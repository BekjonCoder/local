import React, { useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, GeoPoint } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fix Leaflet default marker images
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDsyD_cVcBnnin4DWc9XPb6xQ6xZtX6jk4",
  authDomain: "link-ddaac.firebaseapp.com",
  projectId: "link-ddaac",
  storageBucket: "link-ddaac.appspot.com",
  messagingSenderId: "285266088509",
  appId: "1:285266088509:web:ef32b9628fea44646c1054",
  measurementId: "G-NHH8EKFPXC",
};

// Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

interface SavedJob {
  lat: number;
  lng: number;
  jobName: string;
}

const EmployerDashboard: React.FC = () => {
  const [form, setForm] = useState({
    jobName: "",
    address: "",
    coordinates: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [savedJob, setSavedJob] = useState<SavedJob | null>(null);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateCoordinates = (coordsString: string) => {
    const coords = coordsString
      .split(",")
      .map((c) => parseFloat(c.trim()))
      .filter((n) => !isNaN(n));

    if (coords.length !== 2) return null;

    const [lat, lng] = coords;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    return coords;
  };

  const handleSubmit = async () => {
    const { jobName, address, coordinates, description } = form;

    if (!jobName.trim() || !address.trim() || !coordinates.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const coords = validateCoordinates(coordinates);
    if (!coords) {
      toast.error('Please enter coordinates in "lat, lng" format');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        jobName: jobName.trim(),
        address: address.trim(),
        coordinates: new GeoPoint(coords[0], coords[1]),
        description: description.trim(),
        createdAt: new Date(),
      });

      setSavedJob({ lat: coords[0], lng: coords[1], jobName: jobName.trim() });
      setForm({ jobName: "", address: "", coordinates: "", description: "" });

      toast.success("Job saved successfully!");
    } catch (error) {
      console.error("Firestore write error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 8,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Employer Dashboard</h2>
        <Button type="default" onClick={() => navigate("/login")}>
          ⬅ Back (Login)
        </Button>
      </div>

      <input
        type="text"
        name="jobName"
        placeholder="Job name"
        value={form.jobName}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: 16,
          padding: 10,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: 16,
          padding: 10,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        name="coordinates"
        placeholder='Coordinates (e.g., 41.2995, 69.2401)'
        value={form.coordinates}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: 16,
          padding: 10,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={5}
        style={{
          width: "100%",
          marginBottom: 16,
          padding: 10,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: loading ? "#8bb9ff" : "#1890ff",
          color: "#fff",
          fontSize: 18,
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
          marginBottom: 20,
        }}
      >
        {loading ? "Loading..." : "Add Job"}
      </button>

      {savedJob && (
        <div>
          <h3 style={{ textAlign: "center", marginBottom: 16 }}>
            Your posted job on the map:
          </h3>
          <MapContainer
            center={[savedJob.lat, savedJob.lng]}
            zoom={15}
            style={{ height: 300, width: "100%", borderRadius: 12 }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[savedJob.lat, savedJob.lng]}>
              <Popup>{savedJob.jobName}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;

// 41.2995, 69.2401