
// src/pages/JobsMapPage.tsx

import { useState, useEffect } from "react";
import { Select, Spin, Empty, Button, Card } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // <-- firebase.ts dan import qilinyapti
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

// Markerlar uchun Leaflet icon sozlamasi
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const cities: City[] = [
  { name: "Toshkent", lat: 41.2995, lng: 69.2401 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Dubai", lat: 25.276987, lng: 55.296249 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
  { name: "Milan", lat: 45.4642, lng: 9.19 },
  { name: "Athens", lat: 37.9838, lng: 23.7275 },
  { name: "Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
  { name: "Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Brussels", lat: 50.8503, lng: 4.3517 },
  { name: "Lisbon", lat: 38.7169, lng: -9.139 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Karachi", lat: 24.8607, lng: 67.0011 },
  { name: "Tehran", lat: 35.6892, lng: 51.389 },
  { name: "Baghdad", lat: 33.3152, lng: 44.3661 },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Doha", lat: 25.2854, lng: 51.531 },
  { name: "Kuwait City", lat: 29.3759, lng: 47.9774 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Oslo", lat: 59.9139, lng: 10.7522 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Helsinki", lat: 60.1699, lng: 24.9384 },
  { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Reykjavik", lat: 64.1355, lng: -21.8954 },
  { name: "Zurich", lat: 47.3769, lng: 8.5417 },
  { name: "Geneva", lat: 46.2044, lng: 6.1432 },
  { name: "Luxembourg", lat: 49.6117, lng: 6.13 },
  { name: "Monaco", lat: 43.7384, lng: 7.4246 },
  { name: "San Marino", lat: 43.9336, lng: 12.4508 },
  { name: "Andorra la Vella", lat: 42.5078, lng: 1.5211 },
  { name: "Valletta", lat: 35.8997, lng: 14.5146 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Marrakesh", lat: 31.6295, lng: -7.9811 },
  { name: "Algiers", lat: 36.7538, lng: 3.0588 },
  { name: "Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Accra", lat: 5.6037, lng: -0.187 },
  { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
  { name: "Khartoum", lat: 15.5007, lng: 32.5599 },
  { name: "Damascus", lat: 33.5138, lng: 36.2765 },
  { name: "Beirut", lat: 33.8938, lng: 35.5018 },
  { name: "Amman", lat: 31.9454, lng: 35.9284 },
  { name: "Jerusalem", lat: 31.7683, lng: 35.2137 },
  { name: "Muscat", lat: 23.588, lng: 58.3829 },
  { name: "Baku", lat: 40.4093, lng: 49.8671 },
  { name: "Yerevan", lat: 40.1792, lng: 44.4991 },
  { name: "Tbilisi", lat: 41.7151, lng: 44.8271 },
  { name: "Astana", lat: 51.1694, lng: 71.4491 },
  { name: "Almaty", lat: 43.222, lng: 76.8512 },
  { name: "Bishkek", lat: 42.8746, lng: 74.5698 },
  { name: "Dushanbe", lat: 38.5598, lng: 68.787 },
  { name: "Ashgabat", lat: 37.9601, lng: 58.3261 },
  { name: "Ulaanbaatar", lat: 47.8864, lng: 106.9057 },
];

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
            jobName: data.jobName || "Noma'lum ish",
            address: data.address || "Manzil yo'q",
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
        <h1>Ishlar xaritasi</h1>
        <Button type="default" onClick={() => navigate("/login")}>
          ⬅ Orqaga (Login)
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
                    Ko‘rish
                  </Button>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {loading && <Spin style={{ marginTop: 20 }} />}
      {!loading && jobs.length === 0 && (
        <Empty description="Hozircha ishlar yo‘q" style={{ marginTop: 20 }} />
      )}

      {selectedJob && (
        <Card
          title={selectedJob.jobName}
          style={{ marginTop: 20 }}
          extra={
            <Button danger type="link" onClick={() => setSelectedJob(null)}>
              Yopish
            </Button>
          }
        >
          <p>
            <b>Manzil:</b> {selectedJob.address}
          </p>
          <p>
            <b>Tavsif:</b> {selectedJob.description || "Tavsif mavjud emas."}
          </p>
          <p>
            <b>Koordinatalar:</b> {selectedJob.lat}, {selectedJob.lng}
          </p>
        </Card>
      )}
    </div>
  );
}
