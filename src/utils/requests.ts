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
      const handler = handlers.find((handler) => handler.status === response.status);
      if (handler) {
        handler.callback(request, response);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const sendRequestWithToken = async (method: string, url: string, body: any, token: string, handlers: Handler[]) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  await sendRequest(method, url, headers, body, handlers);
}

export { sendRequest, sendRequestWithToken };
