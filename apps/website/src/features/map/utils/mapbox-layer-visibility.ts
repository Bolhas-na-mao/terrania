import { type Map as MapboxMap } from "mapbox-gl";

export const hideQuizMapNoise = (map: MapboxMap): void => {
  for (const layer of map.getStyle().layers) {
    if (layer.id.startsWith("terrania-")) {
      continue;
    }

    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", "#dbe7ea");
      continue;
    }

    map.setLayoutProperty(layer.id, "visibility", "none");
  }
};
