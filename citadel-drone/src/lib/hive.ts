import axios from 'axios';

const connectToHive = async () => {
  const { HIVE_URL, HIVE_API_KEY } = process.env;

  try {
    await axios.post(`${HIVE_URL}/servers/register`, {}, { headers: { 'X-Api-Key': HIVE_API_KEY } });
  } catch (e) {
    throw new Error('Cannot connect to the hive');
  }
};

export default connectToHive;
