interface RoutePathFormat {
  home: string;
  chat: string;
}
function generatePath(path: string) {
  return `/app/${path}`;
}

const pathConfig: RoutePathFormat = {
  home: generatePath('home'),
  chat: generatePath('chat'),
};

export default pathConfig;
