import type { ScreenId } from "../types/interfaces";
import { getElement } from "./dom";

const SCREEN_FADE_MS = 300;

let currentScreen: ScreenId = "gate";
const onShow: Partial<Record<ScreenId, () => void>> = {};

export const getCurrentScreen = (): ScreenId => currentScreen;

export const onScreenShown = (screen: ScreenId, handler: () => void): void => {
  onShow[screen] = handler;
};

export const revealCurrentScreen = (): void => {
  getElement(currentScreen).classList.add("is-visible");
};

export const showScreen = (next: ScreenId, instant = false): void => {
  if (next === currentScreen) return;
  const from = getElement(currentScreen);
  const to = getElement(next);

  const swap = (): void => {
    from.classList.remove("is-active", "is-visible");
    to.classList.add("is-active");
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => requestAnimationFrame(() => to.classList.add("is-visible")));
    currentScreen = next;
    onShow[next]?.();
  };

  if (instant) {
    swap();
    return;
  }
  from.classList.remove("is-visible");
  window.setTimeout(swap, SCREEN_FADE_MS);
};
