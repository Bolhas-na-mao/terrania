import { type MapRegion } from "../types/map-feature.ts";

type MapTooltipProps = {
  region?: MapRegion;
};

export const MapTooltip = ({ region }: MapTooltipProps) => {
  if (!region) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 border border-white/50 bg-neutral-950 px-3 py-1.5 text-sm font-medium text-white shadow-sm">
      {region.label}
    </div>
  );
};
