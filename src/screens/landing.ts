import { getElement, setText } from "../lib/dom";
import { onScreenShown, showScreen } from "../lib/navigation";
import type { Bundle } from "../types/interfaces";

const ENVELOPE_OPEN_MS = 1100;

export const initLanding = ({ content, photo }: Bundle): void => {
  const { landing } = content;
  setText("landing-title", landing.title);
  setText("landing-subtitle", landing.subtitle);
  setText("envelope-hint", landing.envelopeHint);
  getElement<HTMLImageElement>("face-img").src = photo(landing.facePhoto);

  const envelope = getElement("envelope");
  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("is-open")) return;
    envelope.classList.add("is-open");
    window.setTimeout(() => showScreen("card"), ENVELOPE_OPEN_MS);
  });
  onScreenShown("landing", () => envelope.classList.remove("is-open"));
};
