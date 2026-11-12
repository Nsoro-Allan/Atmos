import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icons when bundling with Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], 11, { duration: 0.75 })
  }, [lat, lon, map])
  return null
}

interface Props {
  lat: number
  lon: number
  name: string
  dark?: boolean
}

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'

export default function WeatherMap({ lat, lon, name }: Props) {
  const mapKey = `${lat.toFixed(4)},${lon.toFixed(4)}`

  return (
    <div className="rounded-3xl overflow-hidden glass-strong h-[280px] md:h-[320px] relative bg-slate-800">
      <MapContainer
        key={mapKey}
        center={[lat, lon]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer attribution={OSM_ATTR} url={OSM_URL} maxZoom={19} />
        <Marker position={[lat, lon]}>
          <Popup>
            <strong>{name}</strong>
          </Popup>
        </Marker>
        <MapUpdater lat={lat} lon={lon} />
      </MapContainer>
    </div>
  )
}