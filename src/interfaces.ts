export interface Audio {
  bpm: number;
  danceability: number;
  loudness: number;
  mood: object;
  genre: object;
  instruments: object;
}

export interface AudioInternal {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  audioBase64: string;
  mimeType: string;
  duration: number;
  coordinates: Coordinates | Promise<Coordinates>;
  metadata: Audio | null;
}

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};


