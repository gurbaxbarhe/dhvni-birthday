import { getElement } from "./dom";

const HEART_COUNT = 36;

export const spawnHearts = (): void => {
  const container = getElement("bg-hearts");
  for (let heartIndex = 0; heartIndex < HEART_COUNT; heartIndex++) {
    const heart = document.createElement("span");
    const size = 10 + Math.random() * 18;
    heart.className = "px-heart";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size * 0.9}px`;
    heart.style.animationDuration = `${12 + Math.random() * 16}s`;
    heart.style.animationDelay = `${-Math.random() * 24}s`;
    heart.style.opacity = `${0.3 + Math.random() * 0.4}`;
    container.appendChild(heart);
  }
};
