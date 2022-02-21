import * as Docker from 'dockerode';
import BaseProvider from './base';

class DockerProvider implements BaseProvider {
  docker: Docker;

  constructor(docker: Docker) {
    this.docker = docker;
  }

  async createInstance(image: string): Promise<void> {
    await this.docker.createContainer({ Image: image, name: `citadel_${image.split(':')[0]}` });
  }

  async fetchBinaries(repoTag: string): Promise<void> {
    const stream = await this.docker.pull(`${repoTag}`);

    await (() =>
      new Promise((resolve, reject) => {
        const onDownloadProgress = () => {};

        const onDownloadFinished = (err: Error) => {
          console.log('Download finished :D');

          if (err) {
            console.log(err);

            reject(err);
            return;
          }

          resolve(null);
        };

        this.docker.modem.followProgress(stream, onDownloadFinished, onDownloadProgress);
      }))();
  }
}

export default DockerProvider;
