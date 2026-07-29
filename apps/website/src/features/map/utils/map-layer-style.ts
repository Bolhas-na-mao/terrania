import {
  type ExpressionSpecification,
  type FillLayerSpecification,
  type FilterSpecification,
  type LineLayerSpecification,
} from "mapbox-gl";

export const MAP_SOURCE_ID = "terrania-country-boundaries";
export const MAP_SOURCE_LAYER = "country_boundaries";
export const MAP_FILL_LAYER_ID = "terrania-country-fill";
export const MAP_BORDER_LAYER_ID = "terrania-country-border";

const fillColor: ExpressionSpecification = [
  "case",
  ["boolean", ["feature-state", "disabled"], false],
  "#a8b2ad",
  ["boolean", ["feature-state", "incorrect"], false],
  "#d95951",
  ["boolean", ["feature-state", "correct"], false],
  "#16a34a",
  ["boolean", ["feature-state", "selected"], false],
  "#f4c95d",
  ["boolean", ["feature-state", "hover"], false],
  "#94a3b8",
  "#64748b",
];

export const createMapLayers = (
  featureIds: readonly string[],
): [FillLayerSpecification, LineLayerSpecification] => {
  const scopeFilter: FilterSpecification = [
    "all",
    ["in", ["get", "iso_3166_1_alpha_3"], ["literal", featureIds]],
    ["==", ["get", "disputed"], "false"],
    ["any", ["==", ["get", "worldview"], "all"], ["in", "US", ["get", "worldview"]]],
  ];

  return [
    {
      id: MAP_FILL_LAYER_ID,
      type: "fill",
      source: MAP_SOURCE_ID,
      "source-layer": MAP_SOURCE_LAYER,
      filter: scopeFilter,
      paint: {
        "fill-color": fillColor,
        "fill-opacity": 0.96,
      },
    },
    {
      id: MAP_BORDER_LAYER_ID,
      type: "line",
      source: MAP_SOURCE_ID,
      "source-layer": MAP_SOURCE_LAYER,
      filter: scopeFilter,
      paint: {
        "line-color": "#d9f0e3",
        "line-opacity": 0.9,
        "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.6, 5, 1.4],
      },
    },
  ];
};
