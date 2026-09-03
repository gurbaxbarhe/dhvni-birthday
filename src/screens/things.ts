import { getElement, setText } from "../lib/dom";
import { getCurrentScreen, showScreen } from "../lib/navigation";
import type { Bundle } from "../types/interfaces";

const CARD_SLIDE_MS = 250;
const SWIPE_THRESHOLD_PX = 40;

type Direction = 1 | -1;

const padIndex = (value: number): string => String(value).padStart(2, "0");

export const initThings = ({ content, photo }: Bundle): void => {
  const { things } = content;
  const { items } = things;
  setText("things-title", things.title);
  setText("things-subtitle", things.subtitle);

  const card = getElement("thing-card");
  const photoGrid = getElement("thing-photos");
  const indexLabel = getElement("thing-index");
  const caption = getElement("thing-text");
  const dotList = getElement("dots");
  const nextButton = getElement<HTMLButtonElement>("to-letter");
  const seenIndexes = new Set<number>();
  let currentIndex = 0;

  nextButton.textContent = things.nextButton;
  nextButton.hidden = true;
  nextButton.addEventListener("click", () => showScreen("letter"));
  const dots = items.map(() => dotList.appendChild(document.createElement("span")));

  const revealNext = (): void => {
    nextButton.hidden = false;
    nextButton.classList.add("unlocked");
  };

  const render = (): void => {
    const item = items[currentIndex];
    caption.textContent = item.text;
    indexLabel.textContent = `${padIndex(currentIndex + 1)} / ${padIndex(items.length)}`;
    photoGrid.dataset.count = String(item.photos.length);
    photoGrid.replaceChildren(
      ...item.photos.map((fileName) => {
        const image = document.createElement("img");
        image.src = photo(fileName);
        image.alt = "";
        return image;
      }),
    );
    dots.forEach((dot, dotIndex) => dot.classList.toggle("on", dotIndex === currentIndex));

    seenIndexes.add(currentIndex);
    if (seenIndexes.size === items.length && nextButton.hidden) revealNext();
  };

  const move = (direction: Direction): void => {
    card.classList.add(direction === 1 ? "slide-out-left" : "slide-out-right");
    window.setTimeout(() => {
      currentIndex = (currentIndex + direction + items.length) % items.length;
      render();
      card.classList.remove("slide-out-left", "slide-out-right");
    }, CARD_SLIDE_MS);
  };

  getElement("prev").addEventListener("click", () => move(-1));
  getElement("next").addEventListener("click", () => move(1));
  document.addEventListener("keydown", (event) => {
    if (getCurrentScreen() !== "things") return;
    if (event.key === "ArrowRight") move(1);
    if (event.key === "ArrowLeft") move(-1);
  });

  let touchStartX = 0;
  card.addEventListener("touchstart", (event) => (touchStartX = event.touches[0].clientX), {
    passive: true,
  });
  card.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) move(deltaX < 0 ? 1 : -1);
  });

  render();
};
