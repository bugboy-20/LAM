import variables from "@/variables.json";
import { Http, HttpOptions } from "@capacitor-community/http";
import { Preferences } from "@capacitor/preferences";
import { getToken, getUserLogin } from "./storage";
import { AudioAPI, AudioSummary} from "@/interfaces";

export type Handler = {
  status: number;
  callback: (req: Request, res: Response) => Promise<void>;
}

const fetchFn = async (request: Request) => {
  const method = request.method;
  const options : HttpOptions = {
    url: request.url,
    method: method,
    headers: request.headers as any,
    data: request.body,

  }
  const response = await Http.request(options);
  const res = new Response(response.data, {
    status: response.status,
    headers: response.headers as any,
  });
  return res;
  /*
  switch (method) {
    case 'GET':
      return fetch(request);
    case 'POST':
      return fetch(request);
    case 'PUT':
      return fetch(request);
    case 'DELETE':
      return fetch(request);
    default:
      return Promise.reject(new Error('Invalid method'));
  }*/
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

  const token = await fetch(`${variables.apiURL}/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: username,
      password: password,
    })}).then((response) => {
      if(response.status == 400) {
        return Promise.reject(new Error('Invalid username or password'));
      }
      if(response.status == 200) {
        return response.json();
      }
    }).then((json) => {
      const token = json.client_secret;
      if (!token) {
        return Promise.reject(new Error('No token found in response.'));
      }
      Preferences.set({key: 'token', value: token});
      return token as string;
      //return router.push(`/tabs/?token=${token}`); // TODO: secure this
    }) ?? ''; // This is a workaround to make TypeScript happy
    return token;
}

const getAudioSummary = async () : Promise<AudioSummary[]> => {
  const { promise, resolve, reject:_ } = Promise.withResolvers<AudioSummary[]>();
  sendRequestWithToken('GET', '${variables.apiURL}/audio/my', undefined, [
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
/*
const getAudio = async (id: number) : Promise<AudioAPI> => {
  let {promise: audioP, resolve: audioRes, reject: audioRej } = Promise.withResolvers<AudioAPI>()
  await sendRequestWithToken('GET', `${variables.apiURL}/audio/${id}`, undefined, [
    {
      status: 200,
      callback: async (_, res) => res.json().then(async (json) => {
        if (!json)
          audioRej(new Error('No audio found'));
        audioRes({
          coordinates: {
            latitude: json.latitude,
            longitude: json.longitude
          },
          id: json.id,
          creator_id: json.creator_id,
          creator_username: json.creator_username,
          metadata: {
            hidden: false,
            ...json.tags
          }
        })
      })}],
  async (_, res) => { console.error('Error:', res); audioRej('No audio found') });
  return await audioP;
}*/

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
