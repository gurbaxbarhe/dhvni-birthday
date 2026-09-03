export const getElement = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
};

export const setText = (id: string, text: string): void => {
  getElement(id).textContent = text;
};

export const restartAnimation = (element: HTMLElement, className: string): void => {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
};
