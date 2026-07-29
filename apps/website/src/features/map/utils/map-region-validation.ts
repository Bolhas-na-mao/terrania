import { type MapRegion } from "../types/map-feature.ts";

export const validateMapRegions = (regions: readonly MapRegion[]): void => {
  if (regions.length === 0) {
    throw new Error("Map region collection cannot be empty");
  }

  const featureIds = new Set<string>();

  for (const region of regions) {
    if (region.featureId.trim().length === 0) {
      throw new Error("Every map region must have a feature id");
    }

    if (region.label.trim().length === 0) {
      throw new Error(`Map region ${region.featureId} must have a label`);
    }

    if (featureIds.has(region.featureId)) {
      throw new Error(`Duplicate map feature id: ${region.featureId}`);
    }

    featureIds.add(region.featureId);
  }
};

export const createMapRegionLookup = (
  regions: readonly MapRegion[],
): ReadonlyMap<string, MapRegion> => {
  validateMapRegions(regions);

  return new Map(regions.map((region) => [region.featureId, region]));
};
