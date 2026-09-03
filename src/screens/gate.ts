import { unlockBundle } from "../lib/crypto";
import { getElement, restartAnimation, setText } from "../lib/dom";
import { showScreen } from "../lib/navigation";
import type { Bundle } from "../types/interfaces";

const TITLE = "for my baby";
const SUBTITLE = "enter the password to open your surprise";
const BUTTON = "open";
const BUTTON_LOADING = "unlocking...";
const ERROR_WRONG = "hmm, that's not it. try again";
const ERROR_MISSING = "the surprise isn't here yet. try again later";

export const initGate = (onUnlock: (bundle: Bundle) => void): void => {
  setText("gate-title", TITLE);
  setText("gate-subtitle", SUBTITLE);

  const form = getElement<HTMLFormElement>("gate-form");
  const input = getElement<HTMLInputElement>("gate-input");
  const button = getElement<HTMLButtonElement>("gate-button");
  const error = getElement("gate-error");
  button.textContent = BUTTON;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    button.textContent = BUTTON_LOADING;
    error.textContent = "";

    const bundle = await unlockBundle(input.value.trim());
    button.disabled = false;
    button.textContent = BUTTON;

    if (bundle) {
      onUnlock(bundle);
      showScreen("landing");
      return;
    }
    error.textContent = ERROR_WRONG;
    restartAnimation(form, "shake");
    input.select();
  });
};

export const showGateMissing = (): void => {
  setText("gate-error", ERROR_MISSING);
  getElement<HTMLButtonElement>("gate-button").disabled = true;
};
