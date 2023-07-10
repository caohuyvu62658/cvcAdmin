import { Navigate, useRoutes } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { getRoutes } from "../configs/menu";
import { APP_PREFIX_PATH, AUTH_PATH } from "../configs";
import Login from "./Login";
import { Result } from "antd";
import { Helmet } from "react-helmet";
const View = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const authRouting = useRoutes([{
    path: `${APP_PREFIX_PATH}/*`,
    element: <Navigate to={AUTH_PATH} />
  }, {
    path: AUTH_PATH,
    element: <Login />
  }, {
    path: "*",
    element: <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    </>
  }]);
  const appRouting = useRoutes(getRoutes());
  return (
    <>
      {isAuthenticated ? appRouting : authRouting}
    </>
  )
};

export default View;