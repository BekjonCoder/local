// src/pages/JobsMapPage.tsx

import { useState, useEffect } from "react";
import { Select, Spin, Empty, Button, Card } from "antd";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "leaflet/dist/leaflet.css";
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

type City = {
  name: string;
  lat: number;
  lng: number;
};

const cities: City[] = [
  { name: "Tashkent", lat: 41.2995, lng: 69.2401 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { name: "Sao Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Karachi", lat: 24.8607, lng: 67.0011 },
  { name: "Baghdad", lat: 33.3152, lng: 44.3661 },
  { name: "Tehran", lat: 35.6892, lng: 51.389 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "Hanoi", lat: 21.0278, lng: 105.8342 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Athens", lat: 37.9838, lng: 23.7275 },
  { name: "Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Brussels", lat: 50.8503, lng: 4.3517 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
  { name: "Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
  { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Oslo", lat: 59.9139, lng: 10.7522 },
  { name: "Helsinki", lat: 60.1695, lng: 24.9354 },
  { name: "Reykjavik", lat: 64.1466, lng: -21.9426 },
  { name: "Dublin", lat: 53.3498, lng: -6.2603 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
  { name: "Montreal", lat: 45.5017, lng: -73.5673 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", lat: 49.2827, lng: -123.1207 },
  { name: "Calgary", lat: 51.0447, lng: -114.0719 },
  { name: "Ottawa", lat: 45.4215, lng: -75.699 },
  { name: "Quebec City", lat: 46.8139, lng: -71.208 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Perth", lat: -31.9505, lng: 115.8605 },
  { name: "Brisbane", lat: -27.4698, lng: 153.0251 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Christchurch", lat: -43.5321, lng: 172.6362 },
  { name: "Wellington", lat: -41.2865, lng: 174.7762 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Algiers", lat: 36.7538, lng: 3.0588 },
  { name: "Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Tripoli", lat: 32.8872, lng: 13.1913 },
  { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Dar es Salaam", lat: -6.7924, lng: 39.2083 },
  { name: "Accra", lat: 5.6037, lng: -0.187 },
  { name: "Kampala", lat: 0.3476, lng: 32.5825 },
  { name: "Lusaka", lat: -15.3875, lng: 28.3228 },
  { name: "Harare", lat: -17.8252, lng: 31.0335 },
  { name: "Luanda", lat: -8.839, lng: 13.2894 },
  { name: "Kigali", lat: -1.9706, lng: 30.1044 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Monrovia", lat: 6.3156, lng: -10.8074 },
  { name: "Freetown", lat: 8.4844, lng: -13.2344 },
  { name: "Conakry", lat: 9.6412, lng: -13.5784 },
  { name: "Bamako", lat: 12.6392, lng: -8.0029 },
  { name: "Niamey", lat: 13.5128, lng: 2.1126 },
  { name: "Ouagadougou", lat: 12.3714, lng: -1.5197 },
  { name: "Bangui", lat: 4.3947, lng: 18.5582 },
  { name: "N’Djamena", lat: 12.1348, lng: 15.0557 },
  { name: "Kinshasa", lat: -4.4419, lng: 15.2663 },
  { name: "Brazzaville", lat: -4.2634, lng: 15.2429 },
  { name: "Port-au-Prince", lat: 18.5944, lng: -72.3074 },
  { name: "Santo Domingo", lat: 18.4861, lng: -69.9312 },
  { name: "Havana", lat: 23.1136, lng: -82.3666 },
  { name: "Kingston", lat: 17.9712, lng: -76.7936 },
  { name: "San Juan", lat: 18.4655, lng: -66.1057 },
  { name: "Guatemala City", lat: 14.6349, lng: -90.5069 },
  { name: "San Salvador", lat: 13.6929, lng: -89.2182 },
  { name: "Tegucigalpa", lat: 14.0723, lng: -87.1921 },
  { name: "Managua", lat: 12.1364, lng: -86.2514 },
  { name: "Panama City", lat: 8.9824, lng: -79.5199 },
  { name: "San Jose", lat: 9.9281, lng: -84.0907 },
  { name: "Quito", lat: -0.1807, lng: -78.4678 },
  { name: "Bogota", lat: 4.711, lng: -74.0721 },
  { name: "Caracas", lat: 10.4806, lng: -66.9036 },
  { name: "Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "Montevideo", lat: -34.9011, lng: -56.1645 },
  { name: "Asuncion", lat: -25.2637, lng: -57.5759 },
  { name: "La Paz", lat: -16.500, lng: -68.150 },
  { name: "Sucre", lat: -19.0333, lng: -65.2627 },
  { name: "Brasilia", lat: -15.8267, lng: -47.9218 },
  { name: "Salvador", lat: -12.9777, lng: -38.5016 },
  { name: "Fortaleza", lat: -3.7172, lng: -38.5434 },
  { name: "Recife", lat: -8.0476, lng: -34.877 },
  { name: "Manaus", lat: -3.119, lng: -60.0217 },
  { name: "Belgrade", lat: 44.7866, lng: 20.4489 },
  { name: "Zagreb", lat: 45.815, lng: 15.9819 },
  { name: "Ljubljana", lat: 46.0569, lng: 14.5058 },
  { name: "Sarajevo", lat: 43.8563, lng: 18.4131 },
  { name: "Skopje", lat: 41.9981, lng: 21.4254 },
  { name: "Podgorica", lat: 42.4304, lng: 19.2594 },
  { name: "Tirana", lat: 41.3275, lng: 19.8189 },
  { name: "Pristina", lat: 42.6629, lng: 21.1655 },
  { name: "Valletta", lat: 35.8997, lng: 14.5146 },
  { name: "Nicosia", lat: 35.1856, lng: 33.3823 },
  { name: "Reykjavik", lat: 64.1355, lng: -21.8954 },
  { name: "Luxembourg", lat: 49.6117, lng: 6.1319 },
  { name: "Monaco", lat: 43.7384, lng: 7.4246 },
  { name: "Andorra la Vella", lat: 42.5078, lng: 1.5211 },
  { name: "San Marino", lat: 43.9333, lng: 12.45 },
  { name: "Vaduz", lat: 47.141, lng: 9.5215 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Macau", lat: 22.1987, lng: 113.5439 },
  { name: "Taipei", lat: 25.033, lng: 121.5654 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Pyongyang", lat: 39.0392, lng: 125.7625 },
  { name: "Ulaanbaatar", lat: 47.8864, lng: 106.9057 },
  { name: "Helsinki", lat: 60.1695, lng: 24.9354 },
  { name: "Oslo", lat: 59.9139, lng: 10.7522 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Reykjavik", lat: 64.1355, lng: -21.8954 },
  { name: "Vilnius", lat: 54.6872, lng: 25.2797 },
  { name: "Riga", lat: 56.9496, lng: 24.1052 },
  { name: "Tallinn", lat: 59.437, lng: 24.7536 },
  { name: "Minsk", lat: 53.9006, lng: 27.559 },
  { name: "Kiev", lat: 50.4501, lng: 30.5234 },
  { name: "Chisinau", lat: 47.0105, lng: 28.8638 },
  { name: "Tbilisi", lat: 41.7151, lng: 44.8271 },
  { name: "Yerevan", lat: 40.1792, lng: 44.4991 },
  { name: "Baku", lat: 40.4093, lng: 49.8671 },
  { name: "Astana", lat: 51.1605, lng: 71.4704 },
  { name: "Almaty", lat: 43.222, lng: 76.8512 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Thane", lat: 19.2183, lng: 72.9781 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Pimpri-Chinchwad", lat: 18.6298, lng: 73.7997 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
  { name: "Ludhiana", lat: 30.901, lng: 75.8573 },
  { name: "Agra", lat: 27.1767, lng: 78.0081 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { name: "Meerut", lat: 28.9845, lng: 77.7064 },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
  { name: "Kalyan-Dombivli", lat: 19.2465, lng: 73.1303 },
  { name: "Vasai-Virar", lat: 19.3919, lng: 72.8397 },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304 },
  { name: "Amritsar", lat: 31.634, lng: 74.8723 },
  { name: "Navi Mumbai", lat: 19.033, lng: 73.0297 },
  { name: "Allahabad", lat: 25.4358, lng: 81.8463 },
  { name: "Ranchi", lat: 23.3441, lng: 85.3096 },
  { name: "Howrah", lat: 22.5958, lng: 88.2636 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Jabalpur", lat: 23.1815, lng: 79.9864 },
  { name: "Gwalior", lat: 26.2183, lng: 78.1828 },
  { name: "Vijayawada", lat: 16.5062, lng: 80.648 },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Raipur", lat: 21.2514, lng: 81.6296 },
  { name: "Kota", lat: 25.2138, lng: 75.8648 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Solapur", lat: 17.6599, lng: 75.9064 },
  { name: "Hubli-Dharwad", lat: 15.3647, lng: 75.1235 },
  { name: "Mysore", lat: 12.2958, lng: 76.6394 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { name: "Bareilly", lat: 28.367, lng: 79.4304 },
  { name: "Aligarh", lat: 27.8974, lng: 78.088 },
  { name: "Tiruppur", lat: 11.1081, lng: 77.3411 },
  { name: "Moradabad", lat: 28.8386, lng: 78.7744 },
  { name: "Jalandhar", lat: 31.326, lng: 75.5762 },
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
  { name: "Raurkela", lat: 22.2499, lng: 84.8828 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Warangal", lat: 17.9689, lng: 79.5941 },
  { name: "Mira-Bhayandar", lat: 19.3001, lng: 72.8541 },
  { name: "Jammu", lat: 32.7266, lng: 74.857 },
  { name: "Saharanpur", lat: 29.9673, lng: 77.5513 },
  { name: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
  { name: "Bikaner", lat: 28.0229, lng: 73.3119 },
  { name: "Amravati", lat: 20.9374, lng: 77.7796 },
  { name: "Noida", lat: 28.5355, lng: 77.391 },
  { name: "Jamshedpur", lat: 22.8046, lng: 86.2029 },
  { name: "Bhilai", lat: 21.2187, lng: 81.4332 },
  { name: "Cuttack", lat: 20.4625, lng: 85.8828 },
  { name: "Firozabad", lat: 27.1504, lng: 78.3944 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
  { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
  { name: "Durgapur", lat: 23.5204, lng: 87.3119 },
  { name: "Asansol", lat: 23.685, lng: 86.9515 },
  { name: "Nanded", lat: 19.1512, lng: 77.321 },
  { name: "Kolhapur", lat: 16.705, lng: 74.2433 },
  { name: "Ajmer", lat: 26.4499, lng: 74.6399 },
  { name: "Gulbarga", lat: 17.3297, lng: 76.8343 },
  { name: "Ujjain", lat: 23.1765, lng: 75.7885 },
  { name: "Jalgaon", lat: 21.0077, lng: 75.5626 },
  { name: "Jamnagar", lat: 22.4707, lng: 70.0577 },
  { name: "Mangalore", lat: 12.9141, lng: 74.856 },
  { name: "Belgaum", lat: 15.8497, lng: 74.4977 },
  { name: "Shimla", lat: 31.1048, lng: 77.1734 },
  { name: "Satna", lat: 24.6003, lng: 80.832 },
  { name: "Nellore", lat: 14.4426, lng: 79.9865 },
  { name: "Shimoga", lat: 13.9299, lng: 75.56 },
  { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
  { name: "Solan", lat: 30.9022, lng: 77.1025 },
  { name: "Imphal", lat: 24.817, lng: 93.9368 },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { name: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { name: "Malappuram", lat: 11.0735, lng: 76.0746 },
  { name: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { name: "Kollam", lat: 8.8932, lng: 76.6141 },
  { name: "Kottayam", lat: 9.5916, lng: 76.522 },
  { name: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { name: "Pathanamthitta", lat: 9.2642, lng: 76.787 },
  { name: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "Kannur", lat: 11.8745, lng: 75.3704 },
  { name: "Kasargod", lat: 12.5, lng: 75.0 },
  { name: "Munnar", lat: 10.0864, lng: 77.059 },
  { name: "Wayanad", lat: 11.6854, lng: 76.1312 },
  { name: "Idukki", lat: 9.8425, lng: 76.961 },
  { name: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { name: "Palakkad", lat: 10.7867, lng: 76.6548 },
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
