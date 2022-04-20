import { InstanceInfo, InstanceState } from 'citadel-lib';
import * as Docker from 'dockerode';
import * as Bluebird from 'bluebird';
import { omit } from 'lodash';
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
    const containers = (await this.docker.listContainers({ all: true }))
      .filter((currentContainer) => currentContainer.Names.find((currentName) => currentName.startsWith('/citadel_')))
      .map((currentContainer) => currentContainer.Names[0].substring(1));

    return Bluebird.map(containers, (instanceName) => this.getInstance(instanceName));
  }

  async getInstance(name: string): Promise<InstanceInfo | undefined> {
    const containerInfo = await this.getContainer(name);

    if (!containerInfo) return undefined;

    return {
      name: containerInfo.Names[0].substring(1),
      image: containerInfo.Image,
      state: containerInfo.State as InstanceState,
      portsMapping: containerInfo.Ports.reduce((acc, port) => {
        if (acc[`${port.PrivatePort}/${port.Type}`] || acc[`${port.PrivatePort}`]) {
          return acc;
        }

        // If we already registered a mapping for tcp or udp and then we find the other one, the mapping is now valid for both protocols
        if (acc[`${port.PrivatePort}/tcp`] && port.Type === 'udp') {
          const newAcc = omit(acc, `${port.PrivatePort}/tcp`);
          newAcc[`${port.PrivatePort}`] = `${port.PublicPort}`;

          return newAcc;
        }

        if (acc[`${port.PrivatePort}/udp`] && port.Type === 'tcp') {
          const newAcc = omit(acc, `${port.PrivatePort}/udp`);
          newAcc[`${port.PrivatePort}`] = `${port.PublicPort}`;

          return newAcc;
        }

        return { ...acc, [`${port.PrivatePort}/${port.Type}`]: `${port.PublicPort}` };
      }, {}),
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

  async createInstance(
    image: string,
    name?: string,
    config?: { portsMapping: { [name: string]: string }; volumes: string[] }
  ): Promise<string> {
    const defaultName = `${image.replace('citadel-', '').replace('-', '_').split('/')[1].split(':')[0]}`;
    const containerName = `citadel_${name?.replace(/^citadel_?/, '') || defaultName}`;

    try {
      await this.docker.createContainer({
        Image: image,
        name: containerName,
        Tty: true,
        HostConfig: {
          PortBindings: config
            ? Object.entries(config.portsMapping).reduce((acc, portMapping) => {
                acc[portMapping[0]] = [{ HostPort: portMapping[1] }];

                return acc;
              }, {})
            : {},
          Binds: config?.volumes || [],
        },
      });
    } catch (err) {
      console.log(':/');
    }

    return containerName;
  }

  async removeInstance(name: string): Promise<void> {
    const containerInfo = await this.getContainer(name);

    const container = this.docker.getContainer(containerInfo.Id);
    await container.remove();
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

        if ((logType === '\u0002' || logType === '\u006F') && currentLine.length <= 8) return acc;

        if (logType === '\u0002') {
          return [...acc, `\u0065${currentLine.substring(8)}`];
        } else if (logType === '\u0001') {
          return [...acc, `\u006F${currentLine.substring(8)}`];
        }

        return [...acc, `\u006F${currentLine}`];
      }, []);
  }
}

export default DockerProvider;
