// src/pages/JobsMapPage.tsx

import { useState, useEffect } from "react";
import { Select, Spin, Empty, Button, Card } from "antd";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "leaflet/dist/leaflet.css";

interface City {
  name: string;
  lat: number;
  lng: number;
}

interface Job {
  id: string;
  jobName: string;
  address: string;
  description?: string;
  lat?: number;
  lng?: number;
}

// Marker icon setup
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const cities: City[] = [
  { name: "Tashkent", lat: 41.2995, lng: 69.2401 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
  // ... other cities remain the same
];

// Helper component to change map view
function ChangeMapView({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], 12);
  return null;
}

export default function JobsMapPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobsData: Job[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            jobName: data.jobName || "Unknown Job",
            address: data.address || "No address",
            description: data.description || "",
            lat: data.coordinates?.latitude,
            lng: data.coordinates?.longitude,
          };
        });
        setJobs(jobsData);
      } catch (error) {
        console.error("Firestore error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Jobs Map</h1>
        <Button type="default" onClick={() => navigate("/login")}>
          ⬅ Back (Login)
        </Button>
      </div>

      <Select
        value={selectedCity.name}
        style={{ width: 250, marginBottom: 20 }}
        onChange={(value: string) => {
          const city = cities.find((c) => c.name === value);
          if (city) {
            setSelectedCity(city);
            setSelectedJob(null);
          }
        }}
        options={cities.map((city) => ({ label: city.name, value: city.name }))}
      />

      <MapContainer
        center={[selectedCity.lat, selectedCity.lng]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ChangeMapView lat={selectedCity.lat} lng={selectedCity.lng} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {!loading &&
          jobs
            .filter((job) => job.lat !== undefined && job.lng !== undefined)
            .map((job) => (
              <Marker key={job.id} position={[job.lat!, job.lng!]}>
                <Popup>
                  <b>{job.jobName}</b>
                  <br />
                  {job.address}
                  <br />
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginTop: 5 }}
                    onClick={() => setSelectedJob(job)}
                  >
                    View
                  </Button>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {loading && <Spin style={{ marginTop: 20 }} />}
      {!loading && jobs.length === 0 && (
        <Empty description="No jobs available yet" style={{ marginTop: 20 }} />
      )}

      {selectedJob && (
        <Card
          title={selectedJob.jobName}
          style={{ marginTop: 20 }}
          extra={
            <Button danger type="link" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
          }
        >
          <p>
            <b>Address:</b> {selectedJob.address}
          </p>
          <p>
            <b>Description:</b> {selectedJob.description || "No description available."}
          </p>
          <p>
            <b>Coordinates:</b> {selectedJob.lat}, {selectedJob.lng}
          </p>
        </Card>
      )}
    </div>
  );
}
