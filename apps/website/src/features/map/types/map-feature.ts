export type MapRegion = {
  featureId: string;
  label: string;
};

export type MapSelection = MapRegion & {
  lngLat: {
    lat: number;
    lng: number;
  };
};

export type MapViewport = {
  bounds: [[number, number], [number, number]];
  padding: number;
};

export type MapLifecycle = {
  activeCount: number;
  createdCount: number;
  instanceId: number;
};

export type MapStatus = "idle" | "loading" | "ready" | "error";
