import { useEffect, Suspense, useState, useLayoutEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from "axios";
import { API_BASE_URL, API_PREFIX, SITE_NAME, VERSION } from "../configs";
import { loginFailed, loginSuccess } from "../redux/reducers/authSlice";
import Loading from "../components/Loading";
import { Layout, Drawer, theme, FloatButton, ConfigProvider, Radio, Form, Typography, InputNumber, Switch } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Aside from "../components/Aside";
import UserHeader from "../components/UserHeader";
import { SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { setBorderRadius, setColorPrimary, setIsMobile, toggleDark, toggleDarkMenu } from "../redux/reducers/themeSlice";
import logoSvg from "../assets/logo.svg";
const { Header, Footer, Sider, Content } = Layout;
const ColorRadio = styled(Radio.Group)`
  .ant-radio-inner {
      width: 20px;
      height: 20px;
  }
`;
const AppLayout = () => {
  const auth = useAppSelector((state) => state.auth);
  const themeSetting = useAppSelector((state) => state.theme);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lightColor = theme.useToken().token;
  const darkColor = theme.darkAlgorithm(theme.defaultSeed);
  const [width, setWidth] = useState(window.innerWidth);
  const ThemeRadio = styled(Radio.Group)`
    .ant-radio {
      position: absolute;
      left: -9999px;
      overflow: hidden;
    }
    .ant-radio-wrapper {
      width: 45%;
      position: relative;
    }
    .ant-radio-wrapper span {
      display: flex;
      flex-direction: column;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .ant-radio-wrapper span img {
      width: 100%;
    }
    .ant-typography {
      margin: 0 auto;
    }
    .ant-radio-wrapper img {
      border-radius: ${themeSetting.borderRadius}px;
    }
    .ant-radio-wrapper img:hover {
      transform: scale(1.03);
    }
    .ant-typography {
      display: block
    }
    .ant-radio-wrapper-checked img {
      border: 3px solid ${themeSetting.colorPrimary};
    }
  `;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }
  const handleOpen = () => {
    setOpen(!open);
  }
  const checkLoginStatus = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${API_BASE_URL}/${API_PREFIX}/ajax/isLogin`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (res.data.success) {
        dispatch(loginSuccess({
          token: auth.token,
          user: res.data.data
        }));
      } else {
        dispatch(loginFailed({
          error: res.data.message
        }));
        navigate("/login");
      }
    } catch (ex: any) {
      dispatch(loginFailed({
        error: ex.message
      }));
    }
  }
  useLayoutEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    }
  }, []);
  useEffect(() => {
    dispatch(setIsMobile(width <= 768));
  }, [width])
  useEffect(() => {
    if (!themeSetting.isMobile) setOpen(false);
  }, [themeSetting.isMobile])
  useEffect(() => {
    checkLoginStatus();
  }, [auth.token]);
  return (
    <ConfigProvider
      theme={
        {
          algorithm: [
            themeSetting.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
          ],
          token: {
            colorPrimary: themeSetting.colorPrimary,
            borderRadius: themeSetting.borderRadius
          }
        }
      }>
      <Layout>
        <div className="ant-fake-layout" />
        <Sider
          style={{
            padding: 0,
            background: themeSetting.isDark ? darkColor.colorBgContainer : themeSetting.isDarkMenu ? "#001529" : lightColor.colorBgContainer,
            position: "fixed",
          }}
          className="ant-sidebar"
          width={220}
        >
          <div className="ant-logo">
            <img alt="logo" src={logoSvg} />
          </div>
          <Aside />
        </Sider>

        <Layout className="site-layout">
          <Header className="ant-fixed-header">
            <div className="ant-header-logo">
              <img src={logoSvg} alt="logo" />
              <h1>{SITE_NAME}</h1>
            </div>
            {!open ? <MenuUnfoldOutlined className="trigger" onClick={handleOpen} /> : <MenuFoldOutlined className="trigger" onClick={handleOpen} />}
            <div className="ant-right-header">
              <UserHeader />
            </div>
          </Header>
          <Drawer
            className="ant-sidebar-mobile"
            style={{
              backgroundColor: themeSetting.isDark ? darkColor.colorBgContainer : themeSetting.isDarkMenu ? "#001529" : lightColor.colorBgContainer,
            }}
            onClose={handleOpen}
            destroyOnClose
            placement="left"
            closable={false}
            open={open}
            width={230}
          >
            <Aside />
          </Drawer>
          <Content>
            <div className="ant-fake-header" />
            <Suspense fallback={<Loading />}>
              <Outlet />
              <FloatButton icon={<SettingOutlined />} onClick={() => setOpenDrawer(true)} />
            </Suspense>
            <Drawer
              open={openDrawer}
              closable={false}
              onClose={() => {
                setOpenDrawer(false);
              }}
              destroyOnClose>
              <Form
                layout="horizontal"
                labelCol={{ span: 7 }}
              >
                <Form.Item label="Theme">
                  <ThemeRadio onChange={() => {
                    dispatch(toggleDark());
                    dispatch(setBorderRadius(0));
                  }} defaultValue={themeSetting.isDark ? "dark" : "light"}>
                    <Radio value="light">
                      <img
                        alt="Light"
                        src="/preview/light.svg"
                      />
                      <Typography.Text>Light</Typography.Text>
                    </Radio>
                    <Radio value="dark">
                      <img
                        alt="Dark"
                        src="/preview/dark.svg"
                      />
                      <Typography.Text>Dark</Typography.Text>
                    </Radio>
                  </ThemeRadio>
                </Form.Item>
                <Form.Item label="Color">
                  <ColorRadio
                    defaultValue={themeSetting.colorPrimary}
                    onChange={(e) => {
                      dispatch(setColorPrimary(e.target.value));
                    }}
                  >
                    <Radio className="radio-blue" value="#1677FF" />
                    <Radio className="radio-purple" value="#5A54F9" />
                    <Radio className="radio-magenta" value="#9E339F" />
                    <Radio className="radio-pink" value="#ED4192" />
                    <Radio className="radio-red" value="#E0282E" />
                    <Radio className="radio-orange" value="#F4801A" />
                    <Radio className="radio-yellow" value="#F2BD27" />
                    <Radio className="radio-green" value="#00B96B" />
                  </ColorRadio>
                </Form.Item>
                <Form.Item label="Border Radius">
                  <InputNumber
                    min={0}
                    max={10}
                    onChange={(value) => {
                      dispatch(setBorderRadius(value || 0));
                    }}
                    defaultValue={themeSetting.borderRadius}
                  />
                </Form.Item>
                <Form.Item label="Dark Menu">
                  <Switch
                    checked={themeSetting.isDarkMenu}
                    onChange={() => {
                      dispatch(toggleDarkMenu());
                    }}
                  />
                </Form.Item>
              </Form>
            </Drawer>
          </Content>
          <Footer className="center-aligned">{SITE_NAME} v{VERSION} ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default AppLayout;