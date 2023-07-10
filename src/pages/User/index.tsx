import { useEffect, useState } from "react";
import { PAGE_LIMIT, PAGE_SIZE } from "../../configs";
import { IAjax, InitalState } from "../../typings/datatable";
import { API, ITEM_NAME, SEARCH_COLUMNS, UserState } from "./constant";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import { Table, Row, Col, Space, Breadcrumb, Card, Button, Tooltip, Popover, message, Menu, Dropdown, Checkbox } from "antd";
import { Helmet } from "react-helmet";
import { ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import Add from "./Add";
import Action from "./Action";
import Delete from "./Delete";
import Edit from "./Edit";
import Search from "./Search";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleColumnHidden } from "../../redux/reducers/tableSlice";
import { convertFilter, numberFormat } from "../../utils";

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
  updated: 0
}
const User = () => {
  const [state, setState] = useState(initialState);
  const fetchData = async () => {
    try {
      setState(prevState => ({
        ...prevState,
        loading: true
      }))
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
          setState((prevState) => ({
            ...prevState,
            data: response.data.data,
            selectedRowKeys: [],
            pagination: {
              ...prevState.pagination,
              total: response.data.recordsFiltered,
            },
          }))
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
  }
  useEffect(() => {
    fetchData();
  }, [state.filters, state.pagination.current, state.sort, state.updated]);
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
  const TABLE_COLUMNS: ColumnsType<UserState> = [{
    title: "Username",
    dataIndex: "username",
    key: "username",
    sorter: true,
    showSorterTooltip: false,
    render: (value: string, record) => {
      return (
        <span>{value}</span>
      )
    }
  }, {
    title: "Action",
    dataIndex: "id",
    key: "action",
    render: (value: string, record) => {
      return (
        <>
          <Space>
            <Edit item={record} onReload={handleReload} />
            <Delete item={record} onReload={handleReload} />
          </Space>
        </>
      )
    }
  }];

  // visible columns
  const tableKey = "user";
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
        <meta charSet="utf-8" />
        <title>{ITEM_NAME}</title>
      </Helmet>
      <Breadcrumb>
        <Breadcrumb.Item>Trang Chủ</Breadcrumb.Item>
        <Breadcrumb.Item>{ITEM_NAME}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row gutter={[16, 16]} className="row-actions">
          <Col md={16} sm={24} className="ant-col-filters">
            <Tooltip title="Reload">
              <Button icon={<ReloadOutlined />} onClick={handleReload} loading={state.loading} />
            </Tooltip>
            <Dropdown overlay={menu}>
              <Button icon={<SettingOutlined />}/>
            </Dropdown>
            <Search
              setState={setState}
              filters={state.filters}
            />
          </Col>
          <Col md={8} sm={24} className="right-aligned ant-col-actions">
            <Space>
              <Action ids={state.selectedRowKeys} setState={setState} />
              <Add onReload={handleReload} />
            </Space>
          </Col>
        </Row>
        <Table
          scroll={{ x: 1000 }}
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

export default User;