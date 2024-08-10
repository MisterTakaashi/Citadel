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
  const config = await import(`${__dirname}/../configurations/${image}/config.json`);

  return config;
};

export { getImageConfig };
