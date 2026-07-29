import {
  type FilterSpecification,
  type LayerSpecification,
  type VectorSourceSpecification,
} from "mapbox-gl";

import { MAP_SOURCE_ID, MAP_SOURCE_LAYER, createMapLayers } from "./map-layer-style.ts";

export type MapLayerController = {
  addLayer: (layer: LayerSpecification) => unknown;
  addSource: (sourceId: string, source: VectorSourceSpecification) => unknown;
  getLayer: (layerId: string) => unknown;
  getSource: (sourceId: string) => unknown;
  setFilter: (layerId: string, filter?: FilterSpecification | null) => unknown;
};

export const syncMapLayers = (map: MapLayerController, featureIds: readonly string[]): void => {
  if (!map.getSource(MAP_SOURCE_ID)) {
    map.addSource(MAP_SOURCE_ID, {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
      promoteId: { [MAP_SOURCE_LAYER]: "iso_3166_1_alpha_3" },
    });
  }

  for (const layer of createMapLayers(featureIds)) {
    if (map.getLayer(layer.id)) {
      map.setFilter(layer.id, layer.filter);
      continue;
    }

    map.addLayer(layer);
  }
};
