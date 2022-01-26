import * as Docker from 'dockerode';

const pullImage = async (docker: Docker, repoTag: string) => {
  try {
    const stream = await docker.pull(`${repoTag}`);

    const result = await (() =>
      new Promise((resolve, reject) => {
        const onDownloadProgress = () => {};

        const onDownloadFinished = (err: Error, output: string[]) => {
          console.log('Download finished :D');

          if (err) {
            console.log(err);

            reject(err);
            return;
          }

          resolve(output);
        };

        docker.modem.followProgress(stream, onDownloadFinished, onDownloadProgress);
      }))();

    return [result, null];
  } catch (err) {
    return [null, err];
  }
};

export { pullImage };
