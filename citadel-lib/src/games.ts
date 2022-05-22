enum Providers {
  Docker = 'docker'
}

const GAMES = [
  {name: "Garry's Mod", appId: 4000, shortcut: 'gmod', slug: 'gmod-4000', providers: [Providers.Docker]},
  {name: "Minecraft", appId: 0, shortcut: 'minecraft', slug: 'minecraft-0', providers: [Providers.Docker]},
];

export default GAMES;
export { Providers };
