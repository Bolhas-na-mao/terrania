import { type Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";

import { MAP_SOURCE_ID, MAP_SOURCE_LAYER } from "../utils/map-layer-style.ts";

export type MapFeatureState = {
  correct: boolean;
  disabled: boolean;
  hover: boolean;
  incorrect: boolean;
  selected: boolean;
};

export const createMapFeatureState = (
  featureId: string,
  {
    correctFeatureIds,
    disabledFeatureIds,
    hoveredFeatureId,
    incorrectFeatureIds,
    selectedFeatureId,
  }: Pick<
    UseMapFeatureStateOptions,
    | "correctFeatureIds"
    | "disabledFeatureIds"
    | "hoveredFeatureId"
    | "incorrectFeatureIds"
    | "selectedFeatureId"
  >,
): MapFeatureState => ({
  correct: correctFeatureIds.has(featureId),
  disabled: disabledFeatureIds.has(featureId),
  hover: hoveredFeatureId === featureId,
  incorrect: incorrectFeatureIds.has(featureId),
  selected: selectedFeatureId === featureId,
});

export const mapFeatureStatesEqual = (
  left: MapFeatureState | undefined,
  right: MapFeatureState,
): boolean =>
  left !== undefined &&
  left.correct === right.correct &&
  left.disabled === right.disabled &&
  left.hover === right.hover &&
  left.incorrect === right.incorrect &&
  left.selected === right.selected;

type UseMapFeatureStateOptions = {
  correctFeatureIds: ReadonlySet<string>;
  disabledFeatureIds: ReadonlySet<string>;
  featureIds: readonly string[];
  hoveredFeatureId?: string;
  incorrectFeatureIds: ReadonlySet<string>;
  isLoaded: boolean;
  map: MapboxMap | null;
  selectedFeatureId?: string;
};

type MapFeatureStateController = {
  setFeatureState: (
    target: {
      id: string;
      source: string;
      sourceLayer: string;
    },
    state: MapFeatureState,
  ) => unknown;
};

export type MapFeatureStateSyncCache = {
  map: MapFeatureStateController | null;
  states: Map<string, MapFeatureState>;
};

export const syncMapFeatureStates = (
  map: MapFeatureStateController,
  options: Pick<
    UseMapFeatureStateOptions,
    | "correctFeatureIds"
    | "disabledFeatureIds"
    | "featureIds"
    | "hoveredFeatureId"
    | "incorrectFeatureIds"
    | "selectedFeatureId"
  >,
  cache: MapFeatureStateSyncCache,
): void => {
  if (cache.map !== map) {
    cache.map = map;
    cache.states.clear();
  }

  for (const featureId of options.featureIds) {
    const state = createMapFeatureState(featureId, options);
    const previousState = cache.states.get(featureId);

    if (mapFeatureStatesEqual(previousState, state)) {
      continue;
    }

    map.setFeatureState(
      {
        id: featureId,
        source: MAP_SOURCE_ID,
        sourceLayer: MAP_SOURCE_LAYER,
      },
      state,
    );
    cache.states.set(featureId, state);
  }
};

export const useMapFeatureState = ({
  correctFeatureIds,
  disabledFeatureIds,
  featureIds,
  hoveredFeatureId,
  incorrectFeatureIds,
  isLoaded,
  map,
  selectedFeatureId,
}: UseMapFeatureStateOptions): void => {
  const syncCacheRef = useRef<MapFeatureStateSyncCache>({
    map: null,
    states: new Map(),
  });

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    syncMapFeatureStates(
      map,
      {
        correctFeatureIds,
        disabledFeatureIds,
        featureIds,
        hoveredFeatureId,
        incorrectFeatureIds,
        selectedFeatureId,
      },
      syncCacheRef.current,
    );
  }, [
    correctFeatureIds,
    disabledFeatureIds,
    featureIds,
    hoveredFeatureId,
    incorrectFeatureIds,
    isLoaded,
    map,
    selectedFeatureId,
  ]);
};
