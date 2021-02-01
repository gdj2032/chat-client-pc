import { RouteProps } from 'react-router-dom';
import {
  HomePage, ChatPage
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
