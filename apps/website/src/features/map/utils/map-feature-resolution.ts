import { type MapRegion } from "../types/map-feature.ts";

type CountryBoundaryFeature = {
  properties?: {
    iso_3166_1_alpha_3?: unknown;
  };
};

export const resolveMapRegion = (
  feature: unknown,
  regionLookup: ReadonlyMap<string, MapRegion>,
): MapRegion | undefined => {
  const featureId = (feature as CountryBoundaryFeature | undefined)?.properties?.iso_3166_1_alpha_3;

  if (typeof featureId !== "string") {
    return undefined;
  }

  return regionLookup.get(featureId);
};
