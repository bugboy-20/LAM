export interface Audio {
  bpm: number;
  danceability: number;
  loudness: number;
  mood: object;
  genre: object;
  instruments: object;
}

export interface AudioInternal {
  hash: string;
  id?: number; // this is given by the API
  createdAt: Date;
  updatedAt?: Date;
  audioBase64: string;
  mimeType: string;
  duration: number;
  coordinates: Promise<Coordinates>;
  metadata?: Audio;
}

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface AudioSummary {
  id: number;
  longitude: number;
  latitude: number;
  hidden: boolean;
}
