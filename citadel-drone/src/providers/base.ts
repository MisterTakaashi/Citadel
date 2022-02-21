interface BaseProvider {
  createInstance(image: string): Promise<void>;
  fetchBinaries: (repoTag: string) => Promise<void>;
}

export default BaseProvider;
