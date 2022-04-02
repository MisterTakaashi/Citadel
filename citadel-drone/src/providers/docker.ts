import { InstanceInfo, InstanceState } from 'citadel-lib';
import * as Docker from 'dockerode';
import BaseProvider from './base';

class DockerProvider implements BaseProvider {
  docker: Docker;

  constructor(docker: Docker) {
    this.docker = docker;
  }

  async getContainer(name: string): Promise<Docker.ContainerInfo | undefined> {
    const containers = await this.docker.listContainers({ all: true });

    return containers.find((currentContainer) => currentContainer.Names.includes(`/${name}`));
  }

  async getInstances(): Promise<InstanceInfo[]> {
    const containers = (await this.docker.listContainers({ all: true })).filter((currentContainer) =>
      currentContainer.Names.find((currentName) => currentName.startsWith('/citadel_'))
    );

    return containers.map(({ Names, Image, State }) => ({
      name: Names[0].substring(1),
      image: Image,
      state: State as InstanceState,
    }));
  }

  async getInstance(name: string): Promise<InstanceInfo | undefined> {
    const containerInfo = await this.getContainer(name);

    if (!containerInfo) return undefined;

    return {
      name: containerInfo.Names[0].substring(1),
      image: containerInfo.Image,
      state: containerInfo.State as InstanceState,
    };
  }

  async startInstance(name: string): Promise<void> {
    const containerInfo = await this.getContainer(name);

    if (!containerInfo) {
      throw new Error('Instance not found by name');
    }

    const container = this.docker.getContainer(containerInfo.Id);
    await container.start();
  }

  async stopInstance(name: string): Promise<void> {
    const containerInfo = await this.getContainer(name);

    if (!containerInfo) {
      throw new Error('Instance not found by name');
    }

    const container = this.docker.getContainer(containerInfo.Id);
    await container.stop();
  }

  async createInstance(image: string, name?: string): Promise<string> {
    const defaultName = `${image.replace('citadel-', '').replace('-', '_').split('/')[1].split(':')[0]}`;
    const containerName = `citadel_${name?.replace(/^citadel_?/, '') || defaultName}`;

    await this.docker.createContainer({ Image: image, name: containerName });

    return containerName;
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

  async getLogs(name: string, tail = 50, since?: number): Promise<string[]> {
    if (tail > 100) tail = 100;

    const containerInfos = await this.getContainer(name);
    const container = this.docker.getContainer(containerInfos.Id);
    const buffer = (await container.logs({
      since,
      stdout: true,
      stderr: true,
      tail,
    })) as unknown as Buffer;
    return buffer
      .toString()
      .split('\n')
      .reduce((acc, currentLine: string) => {
        const logType = currentLine.charAt(0);

        if (currentLine.length <= 8) return acc;

        if (logType === '\u0002') {
          return [...acc, `\u0065${currentLine.substring(8)}`];
        } else if (logType === '\u0001') {
          return [...acc, `\u006F${currentLine.substring(8)}`];
        }

        return acc;
      }, []);
  }
}

export default DockerProvider;
