import { Geolocation } from '@capacitor/geolocation';

const getCoordinates = async () => { // TODO: refactor this function, that's a workaround, I retry to get the coordinates until it works
  const coords : Function = async () => Geolocation.getCurrentPosition()
    .then((position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return {latitude, longitude};
    })
    .catch(async (err) => {
      console.error(err);
      return await coords();
    });
  return await coords();
};


export { getCoordinates };
