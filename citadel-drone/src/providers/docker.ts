import * as Docker from 'dockerode';
import BaseProvider from './base';

class DockerProvider implements BaseProvider {
  docker: Docker;

  constructor(docker: Docker) {
    this.docker = docker;
  }

  async getContainerByName(name: string): Promise<Docker.ContainerInfo | undefined> {
    const containers = await this.docker.listContainers({ all: true });

    return containers.find((currentContainer) => currentContainer.Names.includes(`/${name}`));
  }

  async startInstance(name: string): Promise<void> {
    const containerInfo = await this.getContainerByName(name);

    if (!containerInfo) {
      throw new Error('Instance not found by name');
    }

    const container = this.docker.getContainer(containerInfo.Id);
    await container.start();
  }

  async createInstance(image: string): Promise<string> {
    const name = `citadel_${image.split(':')[0]}`;
    await this.docker.createContainer({ Image: image, name });

    return name;
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
