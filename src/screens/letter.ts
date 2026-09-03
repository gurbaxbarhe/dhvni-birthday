import { getElement, restartAnimation, setText } from "../lib/dom";
import { onScreenShown, showScreen } from "../lib/navigation";
import type { Bundle } from "../types/interfaces";

const PARAGRAPH_DELAY_BASE_S = 0.2;
const PARAGRAPH_DELAY_STEP_S = 0.3;

export const initLetter = ({ content }: Bundle): void => {
  const { letter } = content;
  setText("letter-badge", letter.badge);
  setText("letter-kicker", letter.kicker);
  setText("letter-greeting", letter.greeting);
  setText("letter-signoff", letter.signoff);
  setText("letter-signature", letter.signature);
  getElement("to-start").addEventListener("click", () => showScreen("landing"));

  const paragraphs = letter.paragraphs.map((text, paragraphIndex) => {
    const element = document.createElement("p");
    element.textContent = text;
    element.style.animationDelay = `${PARAGRAPH_DELAY_BASE_S + paragraphIndex * PARAGRAPH_DELAY_STEP_S}s`;
    return element;
  });
  getElement("letter-body").replaceChildren(...paragraphs);

  // Replay the fade-in each time the letter is opened
  onScreenShown("letter", () => paragraphs.forEach((element) => restartAnimation(element, "rise")));
};
