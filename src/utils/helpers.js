export async function fetchAddress(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=he`
  );
  const data = await response.json();
  return data.display_name;
}

export function createMarker(router, point, type) {
  const iconUrl =
    type === "playgrounds"
      ? "/images/playgrounds.svg"
      : type === "dogParks"
        ? "/images/dogs.svg"
        : "/images/bicycle.svg";

  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return L.marker([point.lat, point.lon], { icon: customIcon }).on(
    "click",
    () => {
      router.push({
        name: "location",
        params: { id: point.id, type },
        query: { lat: point.lat, lng: point.lon },
      });
    }
  );
}
