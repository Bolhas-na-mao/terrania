import { describe, expect, it, vi } from "vitest";

import {
  createMapFeatureState,
  mapFeatureStatesEqual,
  syncMapFeatureStates,
  type MapFeatureStateSyncCache,
} from "./use-map-feature-state.ts";

const stateOptions = {
  correctFeatureIds: new Set(["BRA"]),
  disabledFeatureIds: new Set(["ARG"]),
  hoveredFeatureId: "CHL",
  incorrectFeatureIds: new Set(["PER"]),
  selectedFeatureId: "BRA",
};

describe("createMapFeatureState", () => {
  it("derives each quiz visual state from controlled application data", () => {
    expect(createMapFeatureState("BRA", stateOptions)).toEqual({
      correct: true,
      disabled: false,
      hover: false,
      incorrect: false,
      selected: true,
    });
    expect(createMapFeatureState("ARG", stateOptions).disabled).toBe(true);
    expect(createMapFeatureState("CHL", stateOptions).hover).toBe(true);
    expect(createMapFeatureState("PER", stateOptions).incorrect).toBe(true);
  });
});

describe("mapFeatureStatesEqual", () => {
  it("requires every visual state to match before skipping a Mapbox update", () => {
    const state = createMapFeatureState("BRA", stateOptions);

    expect(mapFeatureStatesEqual(state, { ...state })).toBe(true);
    expect(mapFeatureStatesEqual(state, { ...state, correct: false })).toBe(false);
    expect(mapFeatureStatesEqual(undefined, state)).toBe(false);
  });
});

describe("syncMapFeatureStates", () => {
  it("reapplies controlled state when the underlying map instance changes", () => {
    const firstMap = { setFeatureState: vi.fn() };
    const replacementMap = { setFeatureState: vi.fn() };
    const cache: MapFeatureStateSyncCache = {
      map: null,
      states: new Map(),
    };
    const options = {
      ...stateOptions,
      featureIds: ["BRA"],
    };

    syncMapFeatureStates(firstMap, options, cache);
    syncMapFeatureStates(firstMap, options, cache);
    syncMapFeatureStates(replacementMap, options, cache);

    expect(firstMap.setFeatureState).toHaveBeenCalledOnce();
    expect(replacementMap.setFeatureState).toHaveBeenCalledOnce();
    expect(replacementMap.setFeatureState).toHaveBeenCalledWith(
      expect.objectContaining({ id: "BRA" }),
      expect.objectContaining({ correct: true, selected: true }),
    );
  });
});
