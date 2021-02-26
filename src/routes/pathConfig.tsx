interface RoutePathFormat {
  home: string;
  chat: string;
  chat2: string;
  udp_client: string;
}
function generatePath(path: string) {
  return `/app/${path}`;
}

const pathConfig: RoutePathFormat = {
  home: generatePath('home'),
  chat: generatePath('chat'),
  chat2: generatePath('chat2'),
  udp_client: generatePath('udp_client'),
};

export default pathConfig;
