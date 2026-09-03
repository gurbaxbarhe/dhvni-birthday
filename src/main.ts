import { spawnHearts } from "./lib/background";
import { fetchBundle, restoreBundle } from "./lib/crypto";
import { revealCurrentScreen, showScreen } from "./lib/navigation";
import { initCard } from "./screens/card";
import { initGate, showGateMissing } from "./screens/gate";
import { initLanding } from "./screens/landing";
import { initLetter } from "./screens/letter";
import { initThings } from "./screens/things";
import type { Bundle } from "./types/interfaces";

const openSite = (bundle: Bundle): void => {
  initLanding(bundle);
  initCard(bundle);
  initThings(bundle);
  initLetter(bundle);
};

const boot = async (): Promise<void> => {
  spawnHearts();
  initGate(openSite);

  const hasBundle = await fetchBundle();
  if (!hasBundle) {
    showGateMissing();
    revealCurrentScreen();
    return;
  }

  const restored = await restoreBundle();
  if (restored) {
    openSite(restored);
    showScreen("landing", true);
    return;
  }
  revealCurrentScreen();
};

void boot();
