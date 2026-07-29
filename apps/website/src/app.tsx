import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import { Button } from "./components/ui/button.tsx";
import { websiteConfig } from "./config.ts";
import { InteractiveMap } from "./features/map/components/interactive-map.tsx";
import { MapDebugPanel } from "./features/map/components/map-debug-panel.tsx";
import {
  southAmericaRegions,
  southAmericaViewport,
} from "./features/map/data/prototype-map-features.ts";
import {
  type MapLifecycle,
  type MapRegion,
  type MapSelection,
  type MapStatus,
} from "./features/map/types/map-feature.ts";

export const App = () => {
  const [selection, setSelection] = useState<MapSelection>();
  const [hoveredRegion, setHoveredRegion] = useState<MapRegion>();
  const [lifecycle, setLifecycle] = useState<MapLifecycle>();
  const [mapStatus, setMapStatus] = useState<MapStatus>("idle");
  const [correctFeatureIds, setCorrectFeatureIds] = useState<ReadonlySet<string>>(new Set());
  const [incorrectFeatureIds, setIncorrectFeatureIds] = useState<ReadonlySet<string>>(new Set());

  const markSelection = (result: "correct" | "incorrect") => {
    if (!selection) {
      return;
    }

    if (result === "correct") {
      setCorrectFeatureIds((featureIds) => new Set(featureIds).add(selection.featureId));
      setIncorrectFeatureIds((featureIds) => {
        const nextFeatureIds = new Set(featureIds);
        nextFeatureIds.delete(selection.featureId);
        return nextFeatureIds;
      });
      return;
    }

    setIncorrectFeatureIds((featureIds) => new Set(featureIds).add(selection.featureId));
    setCorrectFeatureIds((featureIds) => {
      const nextFeatureIds = new Set(featureIds);
      nextFeatureIds.delete(selection.featureId);
      return nextFeatureIds;
    });
  };

  const resetStates = () => {
    setSelection(undefined);
    setCorrectFeatureIds(new Set());
    setIncorrectFeatureIds(new Set());
  };

  return (
    <main className="min-h-screen bg-neutral-100 text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-background">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase text-emerald-700">Terrania</p>
            <h1 className="text-xl font-semibold">South America map prototype</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Mark selected region correct"
              disabled={!selection}
              onClick={() => markSelection("correct")}
              size="icon"
              title="Mark correct"
            >
              <Check />
            </Button>
            <Button
              aria-label="Mark selected region incorrect"
              disabled={!selection}
              onClick={() => markSelection("incorrect")}
              size="icon"
              title="Mark incorrect"
              variant="destructive"
            >
              <X />
            </Button>
            <Button
              aria-label="Reset map states"
              onClick={resetStates}
              size="icon"
              title="Reset map states"
              variant="outline"
            >
              <RotateCcw />
            </Button>
          </div>
        </header>

        <section className="flex min-h-[calc(100vh-73px)] flex-1 flex-col">
          <div className="flex min-h-14 items-center justify-center border-b bg-neutral-950 px-4 py-2 text-center text-white">
            <p className="text-sm text-neutral-300">
              Select a country
              <span className="ml-2 font-semibold text-white">
                {selection?.label ?? "on the map"}
              </span>
            </p>
          </div>
          <div className="flex min-h-[460px] flex-1">
            <InteractiveMap
              accessToken={websiteConfig.mapboxPublicToken}
              correctFeatureIds={correctFeatureIds}
              incorrectFeatureIds={incorrectFeatureIds}
              onHoverChange={setHoveredRegion}
              onLifecycleChange={setLifecycle}
              onSelection={setSelection}
              onStatusChange={setMapStatus}
              regions={southAmericaRegions}
              selectedFeatureId={selection?.featureId}
              viewport={southAmericaViewport}
            />
          </div>
          <MapDebugPanel
            correctCount={correctFeatureIds.size}
            disabledCount={0}
            hoveredRegion={hoveredRegion}
            incorrectCount={incorrectFeatureIds.size}
            lifecycle={lifecycle}
            selection={selection}
            status={mapStatus}
          />
        </section>
      </section>
    </main>
  );
};
