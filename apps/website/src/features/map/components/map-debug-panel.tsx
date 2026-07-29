import { Activity, MapPin } from "lucide-react";

import {
  type MapLifecycle,
  type MapRegion,
  type MapSelection,
  type MapStatus,
} from "../types/map-feature.ts";

type MapDebugPanelProps = {
  correctCount: number;
  disabledCount: number;
  hoveredRegion?: MapRegion;
  incorrectCount: number;
  lifecycle?: MapLifecycle;
  selection?: MapSelection;
  status: MapStatus;
};

export const MapDebugPanel = ({
  correctCount,
  disabledCount,
  hoveredRegion,
  incorrectCount,
  lifecycle,
  selection,
  status,
}: MapDebugPanelProps) => (
  <aside className="grid gap-px overflow-hidden border border-border bg-border text-sm sm:grid-cols-2 lg:grid-cols-4">
    <div className="flex min-h-16 items-center gap-3 bg-background px-4 py-3">
      <Activity className="size-4 text-emerald-700" aria-hidden="true" />
      <div>
        <p className="text-xs text-muted-foreground">Map status</p>
        <p className="font-medium capitalize">{status}</p>
        <p className="text-xs text-muted-foreground">
          {lifecycle
            ? `Instance ${lifecycle.instanceId} · ${lifecycle.createdCount} created`
            : "Not created"}
        </p>
      </div>
    </div>
    <div className="min-h-16 bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">Hovered region</p>
      <p className="font-medium">
        {hoveredRegion ? `${hoveredRegion.label} (${hoveredRegion.featureId})` : "None"}
      </p>
    </div>
    <div className="flex min-h-16 items-center gap-3 bg-background px-4 py-3">
      <MapPin className="size-4 text-amber-600" aria-hidden="true" />
      <div>
        <p className="text-xs text-muted-foreground">Last selection</p>
        <p className="font-medium">
          {selection ? `${selection.label} (${selection.featureId})` : "None"}
        </p>
        {selection ? (
          <p className="text-xs text-muted-foreground">
            {selection.lngLat.lat.toFixed(3)}, {selection.lngLat.lng.toFixed(3)}
          </p>
        ) : null}
      </div>
    </div>
    <div className="min-h-16 bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">Visual states</p>
      <p className="font-medium">
        {correctCount} correct · {incorrectCount} incorrect
      </p>
      <p className="text-xs text-muted-foreground">{disabledCount} disabled</p>
    </div>
  </aside>
);
