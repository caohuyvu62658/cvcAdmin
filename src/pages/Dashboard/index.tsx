import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Row, Col, message, Statistic, Popover, Typography } from "antd";
import { Helmet } from "react-helmet";
import { FaAd, FaUserTie, FaCookieBite, FaChrome } from "react-icons/fa";
import { API_BASE_URL, API_PREFIX } from "../../configs";
import { AnalyticsState } from "./constant";
import { ApiResponse } from "../../typings/api";
import axios from "../../services/axios";
import { AxiosResponse } from "axios";
import styled from "styled-components";

const CustomStatistic = styled(Statistic)`
  .ant-statistic-content-prefix svg {
    margin-bottom: -0.2rem;
  }
`

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsState>({
    cookie: 0,
    business: 0,
    adaccount: 0,
    extension: 0
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<ApiResponse<AnalyticsState>> = await axios({
        method: "GET",
        url: `${API_BASE_URL}/${API_PREFIX}/dashboard/analytics`
      });
      const json = response.data;
      if (json.success) {
        setData(json.data as any);
      } else {
        message.open({
          type: "error",
          content: json.message
        });
      }
    } catch (ex) {
      console.error(ex);
      message.open({
        type: "error",
        content: "Đã xảy ra lỗi"
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Trang Chủ</title>
      </Helmet>
      <Breadcrumb>
        <Breadcrumb.Item>Trang Chủ</Breadcrumb.Item>
      </Breadcrumb>
      <Row style={{
        marginBottom: 20
      }} gutter={16}>
        <Col xs={12} md={12} lg={8} xl={4} >
          <Card bordered={false} loading={loading}>
            <CustomStatistic
              title="Cookie"
              value={data.cookie}
              prefix={<FaCookieBite />}
            />
          </Card>
        </Col>
        <Col xs={12} md={12} lg={8} xl={4} >
          <Card bordered={false} loading={loading}>
            <CustomStatistic
              title="Business"
              value={data.business}
              prefix={<FaUserTie />}
            />
          </Card>
        </Col>
        <Col xs={12} md={12} lg={8} xl={4} >
          <Card bordered={false} loading={loading}>
            <CustomStatistic
              title="AdAccount"
              value={data.adaccount}
              prefix={<FaAd />}
            />
          </Card>
        </Col>
        <Col xs={12} md={12} lg={8} xl={4} >
          <Card bordered={false} loading={loading}>
            <CustomStatistic
              title="Extension"
              value={data.extension}
              prefix={<FaChrome />}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default App;