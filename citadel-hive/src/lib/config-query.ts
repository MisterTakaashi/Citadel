import axios from 'axios';

const CONFIGS_REGISTRY_URL = 'https://raw.githubusercontent.com/MisterTakaashi/Citadel/master/citadel-images';

type ImageConfig = {
  name: string;
  appid: number;
  ports: string[];
  docker: {
    image: string;
  };
  persistences: { name: string; path: string; type: string }[];
};

const getImageConfig = async (image: string): Promise<ImageConfig> => {
  const config = await axios.get(`${CONFIGS_REGISTRY_URL}/${image}/config.json`);

  return config.data;
};

export { getImageConfig };
