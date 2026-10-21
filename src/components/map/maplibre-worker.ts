import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

// maplibre-gl v6 cannot locate its worker inside a bundle: point it to the
// worker file emitted by Vite. Import this module before creating any map.
setWorkerUrl(workerUrl);
