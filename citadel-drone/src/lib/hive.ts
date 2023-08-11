import axios, { AxiosError } from 'axios';

const connectToHive = async (host: string, token: string) => {
  try {
    await axios.post(`${host}/servers/register`, {}, { headers: { 'X-Api-Key': token } });
  } catch (e) {
    throw new Error(`Cannot connect to the hive (${e.response.data.message})`);
  }
};

export default connectToHive;
