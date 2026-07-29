import { describe, expect, it } from "vitest";

import { resolveMapRegion } from "./map-feature-resolution.ts";

const regions = new Map([
  ["ARG", { featureId: "ARG", label: "Argentina" }],
  ["BRA", { featureId: "BRA", label: "Brazil" }],
]);

describe("resolveMapRegion", () => {
  it("resolves Mapbox country properties to Terrania region metadata", () => {
    expect(
      resolveMapRegion(
        {
          properties: {
            iso_3166_1_alpha_3: "BRA",
          },
        },
        regions,
      ),
    ).toEqual({ featureId: "BRA", label: "Brazil" });
  });

  it("ignores unknown or malformed rendered features", () => {
    expect(
      resolveMapRegion(
        {
          properties: {
            iso_3166_1_alpha_3: "URY",
          },
        },
        regions,
      ),
    ).toBeUndefined();
    expect(
      resolveMapRegion(
        {
          properties: {
            iso_3166_1_alpha_3: 76,
          },
        },
        regions,
      ),
    ).toBeUndefined();
    expect(resolveMapRegion(undefined, regions)).toBeUndefined();
  });
});
