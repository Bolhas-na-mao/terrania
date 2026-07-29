import mapboxgl, { type Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef, useState, type RefObject } from "react";

import { type MapLifecycle, type MapStatus, type MapViewport } from "../types/map-feature.ts";

let createdMapCount = 0;
let activeMapCount = 0;

type UseMapboxMapResult = {
  containerRef: RefObject<HTMLDivElement | null>;
  errorMessage?: string;
  isLoaded: boolean;
  lifecycle?: MapLifecycle;
  mapRef: RefObject<MapboxMap | null>;
  status: MapStatus;
  warningMessage?: string;
};

export type MapErrorResponse =
  | {
      errorMessage: string;
      status: "error";
    }
  | {
      status: "ready";
      warningMessage: string;
    };

export const createMapErrorResponse = (hasLoaded: boolean, message: string): MapErrorResponse =>
  hasLoaded
    ? {
        status: "ready",
        warningMessage: message,
      }
    : {
        errorMessage: message,
        status: "error",
      };

export const useMapboxMap = (
  accessToken: string | undefined,
  viewport: MapViewport,
): UseMapboxMapResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap>(null);
  const initialViewportRef = useRef(viewport);
  const [status, setStatus] = useState<MapStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [warningMessage, setWarningMessage] = useState<string>();
  const [lifecycle, setLifecycle] = useState<MapLifecycle>();

  useEffect(() => {
    if (!accessToken) {
      setStatus("error");
      setErrorMessage("VITE_MAPBOX_PUBLIC_TOKEN is required to render the map.");
      return;
    }

    if (!containerRef.current || mapRef.current) {
      return;
    }

    setStatus("loading");
    setErrorMessage(undefined);
    setWarningMessage(undefined);
    createdMapCount += 1;
    activeMapCount += 1;

    const instanceId = createdMapCount;
    const initialViewport = initialViewportRef.current;
    const map = new mapboxgl.Map({
      accessToken,
      boxZoom: false,
      bounds: initialViewport.bounds,
      container: containerRef.current,
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      fitBoundsOptions: { padding: initialViewport.padding },
      keyboard: false,
      projection: "mercator",
      scrollZoom: false,
      style: "mapbox://styles/mapbox/light-v11",
      touchZoomRotate: false,
    });

    mapRef.current = map;
    setLifecycle({
      activeCount: activeMapCount,
      createdCount: createdMapCount,
      instanceId,
    });

    if (import.meta.env.DEV) {
      console.info(
        `[Terrania map] Created instance ${instanceId}. Total created: ${createdMapCount}.`,
      );
    }

    let hasLoaded = false;

    const handleLoad = () => {
      hasLoaded = true;
      setErrorMessage(undefined);
      setStatus("ready");
    };
    const handleError = (event: mapboxgl.ErrorEvent) => {
      const message = event.error?.message ?? "Mapbox failed to load a map resource.";
      const response = createMapErrorResponse(hasLoaded, message);

      if (response.status === "error") {
        setStatus("error");
        setErrorMessage(response.errorMessage);
        return;
      }

      setWarningMessage(response.warningMessage);
      console.warn(`[Terrania map] Recoverable Mapbox error: ${response.warningMessage}`);
    };

    map.once("load", handleLoad);
    map.on("error", handleError);

    return () => {
      map.off("error", handleError);
      map.remove();
      mapRef.current = null;
      activeMapCount -= 1;

      if (import.meta.env.DEV) {
        console.info(`[Terrania map] Removed instance ${instanceId}. Active: ${activeMapCount}.`);
      }
    };
  }, [accessToken]);

  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;

    if (!map || !container || status !== "ready") {
      return;
    }

    let animationFrame: number | undefined;

    const fitViewport = () => {
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        map.resize();
        map.fitBounds(viewport.bounds, {
          duration: 0,
          padding: viewport.padding,
        });
      });
    };

    const resizeObserver = new ResizeObserver(fitViewport);
    resizeObserver.observe(container);
    fitViewport();

    return () => {
      resizeObserver.disconnect();

      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [status, viewport]);

  return {
    containerRef,
    errorMessage,
    isLoaded: status === "ready",
    lifecycle,
    mapRef,
    status,
    warningMessage,
  };
};
