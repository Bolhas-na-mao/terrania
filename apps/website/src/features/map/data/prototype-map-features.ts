import { type MapRegion, type MapViewport } from "../types/map-feature.ts";

export const southAmericaRegions = [
  { featureId: "ARG", label: "Argentina" },
  { featureId: "BOL", label: "Bolivia" },
  { featureId: "BRA", label: "Brazil" },
  { featureId: "CHL", label: "Chile" },
  { featureId: "COL", label: "Colombia" },
  { featureId: "ECU", label: "Ecuador" },
  { featureId: "GUY", label: "Guyana" },
  { featureId: "PRY", label: "Paraguay" },
  { featureId: "PER", label: "Peru" },
  { featureId: "SUR", label: "Suriname" },
  { featureId: "URY", label: "Uruguay" },
  { featureId: "VEN", label: "Venezuela" },
] as const satisfies readonly MapRegion[];

export const southAmericaViewport: MapViewport = {
  bounds: [
    [-83, -57],
    [-33, 14],
  ],
  padding: 24,
};
