interface BaseProvider {
  startInstance(name: string): Promise<void>;
  createInstance(image: string): Promise<string>;
  fetchBinaries: (repoTag: string) => Promise<void>;
}

export default BaseProvider;
