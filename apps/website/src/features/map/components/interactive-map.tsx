import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useMapFeatureState } from "../hooks/use-map-feature-state.ts";
import { useMapboxMap } from "../hooks/use-mapbox-map.ts";
import {
  type MapLifecycle,
  type MapRegion,
  type MapSelection,
  type MapStatus,
  type MapViewport,
} from "../types/map-feature.ts";
import { MAP_FILL_LAYER_ID } from "../utils/map-layer-style.ts";
import { resolveMapRegion } from "../utils/map-feature-resolution.ts";
import { syncMapLayers } from "../utils/map-layer-sync.ts";
import { createMapRegionLookup } from "../utils/map-region-validation.ts";
import { hideQuizMapNoise } from "../utils/mapbox-layer-visibility.ts";
import { MapTooltip } from "./map-tooltip.tsx";

const EMPTY_FEATURE_IDS: ReadonlySet<string> = new Set();

type InteractiveMapProps = {
  accessToken?: string;
  correctFeatureIds?: ReadonlySet<string>;
  disabledFeatureIds?: ReadonlySet<string>;
  incorrectFeatureIds?: ReadonlySet<string>;
  onHoverChange?: (region?: MapRegion) => void;
  onLifecycleChange?: (lifecycle?: MapLifecycle) => void;
  onSelection: (selection: MapSelection) => void;
  onStatusChange?: (status: MapStatus) => void;
  regions: readonly MapRegion[];
  selectedFeatureId?: string;
  viewport: MapViewport;
};

export const InteractiveMap = ({
  accessToken,
  correctFeatureIds = EMPTY_FEATURE_IDS,
  disabledFeatureIds = EMPTY_FEATURE_IDS,
  incorrectFeatureIds = EMPTY_FEATURE_IDS,
  onHoverChange,
  onLifecycleChange,
  onSelection,
  onStatusChange,
  regions,
  selectedFeatureId,
  viewport,
}: InteractiveMapProps) => {
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string>();
  const hoveredFeatureIdRef = useRef<string | undefined>(undefined);
  const [layersReady, setLayersReady] = useState(false);
  const regionLookup = useMemo(() => createMapRegionLookup(regions), [regions]);
  const featureIds = useMemo(() => regions.map((region) => region.featureId), [regions]);
  const { containerRef, errorMessage, isLoaded, lifecycle, mapRef, status, warningMessage } =
    useMapboxMap(accessToken, viewport);

  useEffect(() => {
    onLifecycleChange?.(lifecycle);
  }, [lifecycle, onLifecycleChange]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isLoaded) {
      return;
    }

    const handlePointerMove = (event: mapboxgl.MapLayerMouseEvent) => {
      const region = resolveMapRegion(event.features?.[0], regionLookup);

      map.getCanvas().style.cursor =
        region && !disabledFeatureIds.has(region.featureId) ? "pointer" : "";

      if (hoveredFeatureIdRef.current !== region?.featureId) {
        hoveredFeatureIdRef.current = region?.featureId;
        setHoveredFeatureId(region?.featureId);
        onHoverChange?.(region);
      }
    };
    const handlePointerLeave = () => {
      map.getCanvas().style.cursor = "";
      hoveredFeatureIdRef.current = undefined;
      setHoveredFeatureId(undefined);
      onHoverChange?.(undefined);
    };
    const handleClick = (event: mapboxgl.MapLayerMouseEvent) => {
      const region = resolveMapRegion(event.features?.[0], regionLookup);

      if (!region || disabledFeatureIds.has(region.featureId)) {
        return;
      }

      onSelection({
        ...region,
        lngLat: {
          lat: event.lngLat.lat,
          lng: event.lngLat.lng,
        },
      });
    };

    const initializeLayers = () => {
      hideQuizMapNoise(map);
      syncMapLayers(map, featureIds);

      map.on("mousemove", MAP_FILL_LAYER_ID, handlePointerMove);
      map.on("mouseleave", MAP_FILL_LAYER_ID, handlePointerLeave);
      map.on("click", MAP_FILL_LAYER_ID, handleClick);
      setLayersReady(true);
    };

    if (map.isStyleLoaded()) {
      initializeLayers();
    } else {
      map.once("load", initializeLayers);
    }

    return () => {
      map.off("load", initializeLayers);
      map.off("mousemove", MAP_FILL_LAYER_ID, handlePointerMove);
      map.off("mouseleave", MAP_FILL_LAYER_ID, handlePointerLeave);
      map.off("click", MAP_FILL_LAYER_ID, handleClick);
    };
  }, [disabledFeatureIds, featureIds, isLoaded, mapRef, onHoverChange, onSelection, regionLookup]);

  useMapFeatureState({
    correctFeatureIds,
    disabledFeatureIds,
    featureIds,
    hoveredFeatureId,
    incorrectFeatureIds,
    isLoaded: isLoaded && layersReady,
    map: mapRef.current,
    selectedFeatureId,
  });

  const hoveredRegion = hoveredFeatureId ? regionLookup.get(hoveredFeatureId) : undefined;

  return (
    <div className="relative isolate min-h-[460px] w-full flex-1 overflow-hidden bg-[#dbe7ea]">
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" aria-label="Interactive map" />
      </div>
      <MapTooltip region={hoveredRegion} />

      {status === "loading" ? (
        <div className="absolute inset-0 grid place-items-center bg-[#dbe7ea]">
          <LoaderCircle className="size-6 animate-spin text-emerald-800" aria-label="Loading map" />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-neutral-100 p-6">
          <div className="max-w-md text-center">
            <TriangleAlert className="mx-auto mb-3 size-6 text-red-700" aria-hidden="true" />
            <p className="font-medium">Map unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && warningMessage ? (
        <div
          className="absolute bottom-3 left-3 z-10 max-w-sm border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950 shadow-sm"
          role="status"
          title={warningMessage}
        >
          Some map resources could not be loaded.
        </div>
      ) : null}
    </div>
  );
};
