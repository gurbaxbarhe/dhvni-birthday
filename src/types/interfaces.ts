export interface Content {
  name: string;
  landing: {
    title: string;
    subtitle: string;
    facePhoto: string;
    envelopeHint: string;
  };
  card: {
    badge: string;
    title: string;
    note: string;
    songLabel: string;
    spotifyTrackId: string;
    songCaption: string;
    nextButton: string;
  };
  things: {
    title: string;
    subtitle: string;
    items: { text: string; photos: string[] }[];
    nextButton: string;
  };
  letter: {
    badge: string;
    kicker: string;
    greeting: string;
    paragraphs: string[];
    signoff: string;
    signature: string;
  };
}

export interface RawBundle {
  content: Content;
  photos: Record<string, { mime: string; data: string }>;
}

export interface Bundle {
  content: Content;
  photo: (fileName: string) => string;
}

export type ScreenId = "gate" | "landing" | "card" | "things" | "letter";
