import variables from "@/variables.json";
import { Preferences } from "@capacitor/preferences";
import { getToken, getUserLogin } from "./storage";
import { AudioAPI, AudioSummary} from "@/interfaces";

export type Handler = {
  status: number;
  callback: (req: Request, res: Response) => Promise<void>;
}

const fetchFn = async (request: Request) => {
   return await window.fetch(request);
}

const sendRequest = async (method: string, url: string, headers: any, body: any, handlers: Handler[], fallback?: Handler['callback']) => {
  // GET request has no body
  if (method === 'GET') {
    body = undefined;
  }
  const request = new Request(url, {
    method: method,
    headers: headers,
    body: body,
  });

  await fetchFn(request)
    .then(async (response) => {
      if (response.status === 401) {
        const errMsg = (await response.json()).detail;
        if (errMsg != "Not authenticated" && errMsg != "Token expired")
          return Promise.reject(new Error(errMsg));

        await renewToken();
        return sendRequestWithToken(method, url, body, handlers);
      }
      const handler = handlers.find((handler) => handler.status === response.status);

      if (handler)
        handler.callback(request, response);
      else if (fallback)
        fallback(request, response);
      else
        return Promise.reject(new Error('No handler found for status ' + response.status + ', response: ' + await response.text()));
    })
    .catch((error) => {
      console.error('Error:', error);
      return Promise.reject(error);
    });
}

const sendRequestWithToken = async (method: string, url: string, body: any, handlers: Handler[], fallback?: Handler['callback']) => {
  const token = await getToken();
  if (!token) {
    console.error('Token not found'); // This should never happen
  }
  const headers = {
    //'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  await sendRequest(method, url, headers, body, handlers, fallback);
}

const logUserIn = async (username: string, password: string) => {
  await Preferences.set({key: 'username', value: username});
  await Preferences.set({key: 'password', value: password});

  await renewToken(username, password);
}

const renewToken = async (username?: string, password?: string) => {
  if (!username || !password) {
    const user = await getUserLogin();
    username = user.username ?? '';
    password = user.password ?? '';
  }

  const body = new URLSearchParams({
      username: username,
      password: password,
    })
  let token = window.fetch(new Request( `${variables.apiURL}/auth/token`,{
    method: 'POST',
    mode: 'no-cors',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: body
  })).then(async (response : Response) => {       
    if (response.status === 400) {
      return Promise.reject(new Error('Invalid username or password'));
    }
    if (response.status === 200) {
      return response.json();
    }
  }).then((json) => {
    const token = json.client_secret;
    console.log(token);
    if (!token) {
      return Promise.reject(new Error('No token found in response.'));
    }
    Preferences.set({key: 'token', value: token});
    return token;
  }) ?? '';
  return token;
}

const getAudioSummary = async () : Promise<AudioSummary[]> => {
  const { promise, resolve, reject:_ } = Promise.withResolvers<AudioSummary[]>();
  sendRequestWithToken('GET', `${variables.apiURL}/audio/my`, undefined, [
    {
      status: 200,
      callback: async (_, res) => {
        resolve(await res.json());
      }
    }
  ])
  return await promise;
}
/*
{ "longitude": float, "longitude":
float, "id": int, "creator id": int,
"creator username": string, "tags": See Table
}
*/

const getAudioInfo = async (id: number) : Promise<AudioAPI> => {

  let audioInfos : Promise<AudioAPI> = new Promise(async (resolve, reject) => {
    await sendRequestWithToken('GET',`${variables.apiURL}/audio/${id}`,null,[{
      status: 200,
      callback: async (_,res) => {
        res.json().then((data) => {
          resolve({
            id: data.id,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            creator_username: data.creator_username,
            tags: data.tags,
          })
        });
      }}],async (_,res) => reject(`Error: ${res}`));
  });
  return await audioInfos;
}



// get the last uploaded audio id by confronting the user's audios before and after the upload
const getUploadedAudioId = async (uploadSucessful : Promise<boolean>) : Promise<number> => {
  const audioSummariesBefore = await getAudioSummary().then(a => a.map(e => e.id));

  if (!(await uploadSucessful))
    return Promise.reject(new Error('Upload failed'));

  const audioSummariesAfter = await getAudioSummary().then(a => a.map(e => e.id));

  const addeAudio = audioSummariesAfter.find(e => !audioSummariesBefore.includes(e))
  if (!addeAudio) // this should never happen
    return Promise.reject(new Error('No audio found'));
  return addeAudio
}


export { sendRequest, sendRequestWithToken, logUserIn, renewToken, getUploadedAudioId, getAudioSummary, getAudioInfo };
