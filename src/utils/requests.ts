
import { Preferences } from "@capacitor/preferences";
import { getUserLogin } from "./storage";

export type Handler = {
  status: number;
  callback: (req: Request, res: Response) => Promise<void>;
}

const sendRequest = async (method: string, url: string, headers: any, body: any, handlers: Handler[]) => {
  // GET request has no body
  if (method === 'GET') {
    body = undefined;
  }
  const request = new Request(url, {
    method: method,
    headers: headers,
    body: body,
  });

  await fetch(request)
    .then((response) => {
      if (response.status === 401) {
        renewToken();
        sendRequestWithToken(method, url, body, handlers);
      }
      const handler = handlers.find((handler) => handler.status === response.status);
      if (handler) {
        handler.callback(request, response);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const sendRequestWithToken = async (method: string, url: string, body: any, handlers: Handler[]) => {
  const token = (await Preferences.get({key: 'token'})).value;
  if (!token) {
    console.error('Token not found'); // This should never happen
  }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  await sendRequest(method, url, headers, body, handlers);
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


  const token = await fetch(`/api/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: username,
      password: password,
    })}).then((response) => {
      console.log('after fetch');
      if(response.status == 400) {
        return Promise.reject(new Error('Invalid username or password'));
      }
      console.log('status 200');
      if(response.status == 200) {
        console.log(response);
        return response.json();
      }
      console.log(response);
    }).then((json) => {
      console.log(json);
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


export { sendRequest, sendRequestWithToken, logUserIn, renewToken };
