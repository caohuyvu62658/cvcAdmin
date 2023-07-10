import React, { useState, memo } from "react";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { InitalProps } from "../../typings/datatable";

const Search: React.FC<InitalProps> = (props) => {
  const { setState } = props;
  const [searchTerms, setSearchTerms] = useState<string>("");
  const onKeySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchTerms(value);
  }
  const onSubmitSearch = (e: React.FormEvent<HTMLInputElement>) => {
    if (setState) setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        keyword: e.currentTarget.value
      },
      updated: prevState.updated + 1
    }))
  }
  return (
    <>
      <Space>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          onChange={onKeySearch}
          value={searchTerms}
          onPressEnter={onSubmitSearch}
        />
      </Space>
    </>
  )
};

export default memo(Search);