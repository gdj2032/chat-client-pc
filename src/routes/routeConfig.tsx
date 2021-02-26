import { RouteProps } from 'react-router-dom';
import {
  HomePage, ChatPage, Chat2Page, UDPPage
} from 'pages';
import pathConfig from './pathConfig';

const routeConfig: CustomRouteProps[] = [
  {
    path: pathConfig.home,
    component: HomePage,
    exact: true,
  },
  {
    path: [`${pathConfig.chat}/:name`, pathConfig.chat],
    component: ChatPage,
    exact: true,
  },
  {
    path: [`${pathConfig.chat2}/:name/:room`, pathConfig.chat2],
    component: Chat2Page,
    exact: true,
  },
  {
    path: [`${pathConfig.udp_client}/:name`, pathConfig.udp_client],
    component: UDPPage,
    exact: true,
  },
  // {
  //     path: [`${pathConfig.productEdit}/:productId/:categoryType`, pathConfig.productEdit],
  //     component: ProductEditPage,
  //     exact: true,
  // },
];

interface CustomRouteProps extends RouteProps {
  path: string | string[];
}

export default routeConfig;
