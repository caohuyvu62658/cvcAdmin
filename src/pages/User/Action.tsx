import React, { useEffect, useState, memo } from "react";
import { Button, Modal, message, Space } from "antd";
import { InitalProps } from "../../typings/datatable";
import { DeleteOutlined } from "@ant-design/icons";
import { API, ITEM_NAME } from "./constant";

const Action: React.FC<InitalProps> = (props) => {
  let { ids, setState } = props;
  const initialValues = {

  }
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      message.open({
        key: "loading",
        type: "loading",
        content: "Loading...",
        duration: 0
      });
    } else {
      message.destroy("loading");
    }
  }, [loading]);
  const handleDelete = async () => {
    try {
      setLoading(true);
      if (ids && ids.length > 0) {
        let deletePromises = [];
        for (let id of ids) {
          if (API.deleteItem) deletePromises.push(API.deleteItem(id));
        }
        const deleteResults = await Promise.allSettled(deletePromises);
        const successfulDeletes = deleteResults.filter(result => result.status === "fulfilled" && result.value.data.success);
        message.open({
          key: "action",
          type: "success",
          content: `Đã xóa thành công ${successfulDeletes.length} ${ITEM_NAME.toLowerCase()}`
        });
        if (setState) {
          setState(prevState => ({
            ...prevState,
            selectedRowKeys: [],
            updated: prevState.updated + 1
          }));
        }
      } else {
        message.open({
          key: "action",
          type: "error",
          content: `Không có ${ITEM_NAME.toLowerCase()} nào được chọn để xóa`
        });
      }
    } catch (error) {
      console.error(error);
      message.open({
        key: "action",
        type: "error",
        content: `Đã có lỗi xảy ra khi xóa ${ITEM_NAME.toLowerCase()}`
      });
    } finally {
      setLoading(false);
    }
  }
  const confirm = () => {
    Modal.confirm({
      title: "Bạn có chắc không?",
      content: "Sau khi xóa các mục này, bạn sẽ không thể khôi phục lại. Bạn có muốn tiếp tục?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: handleDelete,
      maskClosable: true,
      okButtonProps: {
        loading
      },
      cancelButtonProps: {
        loading
      }
    });
  }
  return (
    <>
      <Space>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={confirm}
          disabled={(ids?.length) ? false : true}
        >
          Xoá
        </Button>
      </Space>
    </>
  )
};

export default memo(Action);