import { CapacitorSQLite, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';
import { AudioInternal } from '@/interfaces';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { renewToken } from './requests';
/*
 *
async function saveAudioFile(fileName: string, audioData: string) {
  console.log(await Filesystem.writeFile({
    path: fileName,
    data: audioData, // base64 
    directory: Directory.Data,
  }));
}

async function getAudioFile(fileName: string) {
  const result = await Filesystem.readFile({
    path: fileName,
    directory: Directory.Data,
  });
  return result.data; // Base64 o binario
}

async function deleteAudioFile(fileName: string) {
  await Filesystem.deleteFile({
    path: fileName
  });
}
*/

enum DbAudio { Found,
 FoundWithMetadata,
 NotFound
}

async function initializeDatabase() {
  try {
    // applyPolyfills().then(() => {jeepSqlite(window);});
    const platform = Capacitor.getPlatform();
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
    if(platform === "web") {
      // Create the 'jeep-sqlite' Stencil component
      customElements.define("jeep-sqlite", JeepSqlite)
      const jeepSqliteEl = document.createElement("jeep-sqlite")
      document.body.appendChild(jeepSqliteEl)
      await customElements.whenDefined("jeep-sqlite")
      // Initialize the Web store
      await sqlite.initWebStore()
    }

    const db = CapacitorSQLite;
    await CapacitorSQLite.createConnection({
      database: "audio_db",
      version: 1,
      encrypted: false,
      readonly: false,
    });
    await CapacitorSQLite.open({database: "audio_db", readonly: false});

    //console.log("Database aperto con successo!");
    // Creare una tabella per i metadati audio
    const createAudioTable = `
      CREATE TABLE IF NOT EXISTS audio (
        hash TEXT PRIMARY KEY NOT NULL,
        id INTEGER KEY UNIQUE,
        duration INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT NULL,
        audio_base64 TEXT NOT NULL,
        mime_type TEXT NOT NULL
      )
    `;

    const createAudioMetadataTable = `
      CREATE TABLE IF NOT EXISTS audio_metadata (
        id INTEGER KEY,
        bpm INTEGER NOT NULL,
        danceability REAL NOT NULL,
        loudness REAL NOT NULL,
        mood TEXT NOT NULL,
        genre TEXT NOT NULL,
        instrument TEXT NOT NULL,
        FOREIGN KEY (id) REFERENCES audio(id) ON DELETE CASCADE
      )
    `;

    const tables = [createAudioTable, createAudioMetadataTable];
    for (const table of tables) {
      const result = await db.execute({database: "audio_db", statements: table});
      //console.log(`Tabella creata con successo: ${result.changes}`);
    }

    //console.log("Database e tabella creati con successo!");

  } catch (error) {
    console.error("Errore nell'inizializzazione del database:", error);
  }
}

async function readAllAudioMetadata() {
  try {
    const db = CapacitorSQLite;
    const query = `
      SELECT * FROM audio LEFT JOIN audio_metadata ON audio.id = audio_metadata.id
      ORDER BY audio.created_at DESC
    `;
    const result = await db.query({database: "audio_db", statement: query});
    const audios : AudioInternal[] | undefined = result.values?.map((audio) => {
      return {
        hash: audio.hash as string,
        id: audio.id as number,
        duration: audio.duration,
        coordinates: Promise.resolve({latitude: audio.latitude, longitude: audio.longitude}),
        createdAt: new Date(audio.created_at),
        updatedAt: audio.updated_at ? new Date(audio.updated_at) : undefined,
        audioBase64: audio.audio_base64 as string,
        mimeType: audio.mime_type as string,
        metadata: audio.id ?{
          bpm: audio.bpm as number,
          danceability: JSON.parse(audio.danceability) as number,
          loudness: audio.loudness as number,
          mood: JSON.parse(audio.mood),
          genre: JSON.parse(audio.genre),
          instrument: JSON.parse(audio.instrument),
        } : undefined
      }
    });
    if (!audios) {
      console.log("Non ci sono audio salvati.");
      return [];
    }
    return audios;
  } catch (error) {
    console.error("Errore nel recupero dei metadati audio:", error);
    return [];
  }
}

async function isAudioSaved(db: CapacitorSQLitePlugin, hash: string) {
  try {
    const query = `
      SELECT * FROM audio
      WHERE hash = ?
    `;
    const result = await db.query({database: "audio_db", statement: query, values: [hash]});
    if (result.values && result.values.length > 0) {
      const audio = result.values[0] as AudioInternal;
      if(audio.id)
        return DbAudio.FoundWithMetadata;
      return DbAudio.Found;
    }
    return DbAudio.NotFound;
  } catch (error) {
    console.error("Errore nel recupero dell'audio:", error);
    return false;
  }
}

async function saveAudio(audioData: AudioInternal) {
  try {
    const db = CapacitorSQLite;

    const audioStatus = await isAudioSaved(db, audioData.hash);
    if((audioStatus === DbAudio.Found && !audioData.metadata) || audioStatus === DbAudio.FoundWithMetadata) {
      console.log("Audio già salvato.");
      return;
    }
    if(audioStatus != DbAudio.Found) {
      const query = `
        INSERT INTO audio (hash, duration, latitude, longitude, created_at, updated_at, audio_base64, mime_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const coordinates = await audioData.coordinates;
      const values = [audioData.hash, audioData.duration, coordinates.latitude, coordinates.longitude, audioData.createdAt.toString(), audioData.updatedAt?.toString(), audioData.audioBase64, audioData.mimeType];
      await db.run({database: "audio_db", statement: query, values});
    }
    if(audioData.metadata)
      await saveAudioMetadata(audioData);

  } catch (error) {
    console.error("Errore nel salvataggio dell'audio:", error);
  }

}

async function saveAudioMetadata(audio: AudioInternal) : Promise<void> {
  console.log("Salvataggio metadati audio:")
  console.log(JSON.stringify(audio.metadata));
  try {
    const db = CapacitorSQLite;
    // update audio with metadata
    const updateAudio = `
      UPDATE audio
      SET id = ?
      WHERE hash = ?;
    `;
    const updateValues = [audio.id, audio.hash];
    await db.run({database: "audio_db", statement: updateAudio, values: updateValues});


  
    const query = `
      INSERT INTO audio_metadata (id, bpm, danceability, loudness, mood, genre, instrument)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const audioData = audio.metadata;
    if(!audioData)
      return;
    const values = [audio.id, audioData.bpm, JSON.stringify(audioData.danceability), audioData.loudness, JSON.stringify(audioData.mood), JSON.stringify(audioData.genre), JSON.stringify(audioData.instrument)];
    await db.run({database: "audio_db", statement: query, values});


  } catch (error) {
    console.error("Errore nel salvataggio dei metadati audio:", error);
  }
}

async function deleteAudio(hash: string) {
  try {
    const db = CapacitorSQLite;
    const query = `
      DELETE FROM audio
      WHERE hash = ?;
    `;
    const result = await db.run({database: "audio_db", statement: query, values: [hash], transaction: true});
    return result
  } catch (error) {
    console.error("Errore nell'eliminazione dell'audio:", error);
  }
}

async function setToken(token: string) {
  await Preferences.set({key: "token", value: token});
}

async function getToken() {
  const token = await Preferences.get({key: "token"});
  return token.value ?? await renewToken();
}

async function saveUserLogin(username: string, password: string) {
  await Preferences.set({key: "username", value: username});
  await Preferences.set({key: "password", value: password});
}

async function getUserLogin() {
  const username = await Preferences.get({key: "username"});
  const password = await Preferences.get({key: "password"});
  return {username: username.value, password: password.value};
}

export { initializeDatabase, readAllAudioMetadata, saveAudio, deleteAudio, setToken, getToken, saveUserLogin, getUserLogin};
