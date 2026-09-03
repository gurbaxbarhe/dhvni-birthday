import { getElement, setText } from "../lib/dom";
import { showScreen } from "../lib/navigation";
import type { Bundle } from "../types/interfaces";

export const initCard = ({ content, photo }: Bundle): void => {
  const { card, landing, name } = content;
  setText("card-badge", card.badge);
  setText("card-title", card.title);
  setText("card-name", name);
  setText("song-label", card.songLabel);
  setText("song-caption", card.songCaption);
  setText("spotify-fallback-title", card.songLabel);

  const note = getElement("card-note");
  note.textContent = card.note;
  note.hidden = !card.note;

  getElement<HTMLImageElement>("card-face-img").src = photo(landing.facePhoto);
  getElement<HTMLIFrameElement>("spotify").src =
    `https://open.spotify.com/embed/track/${card.spotifyTrackId}?utm_source=generator&theme=0`;
  getElement<HTMLAnchorElement>("spotify-fallback").href =
    `https://open.spotify.com/track/${card.spotifyTrackId}`;

  const nextButton = getElement("to-things");
  nextButton.textContent = card.nextButton;
  nextButton.addEventListener("click", () => showScreen("things"));
};
