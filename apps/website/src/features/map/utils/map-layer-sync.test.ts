import { describe, expect, it, vi } from "vitest";
import {
  type FilterSpecification,
  type LayerSpecification,
  type VectorSourceSpecification,
} from "mapbox-gl";

import { MAP_BORDER_LAYER_ID, MAP_FILL_LAYER_ID } from "./map-layer-style.ts";
import { syncMapLayers } from "./map-layer-sync.ts";

const createMapController = () => {
  const layers = new Set<string>();
  let hasSource = false;

  return {
    addLayer: vi.fn((layer: LayerSpecification) => {
      layers.add(layer.id);
    }),
    addSource: vi.fn((_sourceId: string, _source: VectorSourceSpecification) => {
      hasSource = true;
    }),
    getLayer: vi.fn((layerId: string) => (layers.has(layerId) ? { id: layerId } : undefined)),
    getSource: vi.fn(() => (hasSource ? {} : undefined)),
    setFilter: vi.fn((_layerId: string, _filter?: FilterSpecification | null) => undefined),
  };
};

describe("syncMapLayers", () => {
  it("registers the country source and quiz layers once", () => {
    const map = createMapController();

    syncMapLayers(map, ["ARG", "BRA"]);

    expect(map.addSource).toHaveBeenCalledOnce();
    expect(map.addLayer).toHaveBeenCalledTimes(2);
    expect(map.setFilter).not.toHaveBeenCalled();
  });

  it("updates existing layer filters when the quiz scope changes", () => {
    const map = createMapController();
    syncMapLayers(map, ["ARG", "BRA"]);
    map.addLayer.mockClear();

    syncMapLayers(map, ["ESP", "PRT"]);

    expect(map.addSource).toHaveBeenCalledOnce();
    expect(map.addLayer).not.toHaveBeenCalled();
    expect(map.setFilter).toHaveBeenCalledTimes(2);
    expect(map.setFilter).toHaveBeenCalledWith(
      MAP_FILL_LAYER_ID,
      expect.arrayContaining([
        "all",
        expect.arrayContaining([
          "in",
          expect.any(Array),
          expect.arrayContaining(["literal", ["ESP", "PRT"]]),
        ]),
      ]),
    );
    expect(map.setFilter).toHaveBeenCalledWith(MAP_BORDER_LAYER_ID, expect.any(Array));
  });
});
