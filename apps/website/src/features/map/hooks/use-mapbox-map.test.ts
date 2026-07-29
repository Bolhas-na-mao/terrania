import { describe, expect, it } from "vitest";

import { createMapErrorResponse } from "./use-mapbox-map.ts";

describe("createMapErrorResponse", () => {
  it("blocks the map when initialization fails before the first load", () => {
    expect(createMapErrorResponse(false, "Style request failed")).toEqual({
      errorMessage: "Style request failed",
      status: "error",
    });
  });

  it("keeps an initialized map ready when a later resource request fails", () => {
    expect(createMapErrorResponse(true, "Tile request failed")).toEqual({
      status: "ready",
      warningMessage: "Tile request failed",
    });
  });
});
