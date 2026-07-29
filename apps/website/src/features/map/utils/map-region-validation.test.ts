import { describe, expect, it } from "vitest";

import { createMapRegionLookup, validateMapRegions } from "./map-region-validation.ts";

describe("validateMapRegions", () => {
  it("accepts regions with stable unique ids and labels", () => {
    expect(() =>
      validateMapRegions([
        { featureId: "ARG", label: "Argentina" },
        { featureId: "BRA", label: "Brazil" },
      ]),
    ).not.toThrow();
  });

  it("rejects an empty region collection", () => {
    expect(() => validateMapRegions([])).toThrow("cannot be empty");
  });

  it("rejects duplicate feature ids", () => {
    expect(() =>
      validateMapRegions([
        { featureId: "BRA", label: "Brazil" },
        { featureId: "BRA", label: "Brasil" },
      ]),
    ).toThrow("Duplicate map feature id: BRA");
  });

  it("rejects missing feature ids and labels", () => {
    expect(() => validateMapRegions([{ featureId: "", label: "Brazil" }])).toThrow("feature id");
    expect(() => validateMapRegions([{ featureId: "BRA", label: "" }])).toThrow("label");
  });
});

describe("createMapRegionLookup", () => {
  it("indexes metadata by the Mapbox feature id", () => {
    const lookup = createMapRegionLookup([{ featureId: "BRA", label: "Brazil" }]);

    expect(lookup.get("BRA")).toEqual({ featureId: "BRA", label: "Brazil" });
  });
});
