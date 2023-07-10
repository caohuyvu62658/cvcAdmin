import React, { memo, useState } from "react";
import { InitalProps } from "../../typings/datatable";
import { API, ITEM_NAME, UserState } from "./constant";
import { message, Button, Form, Input, Modal, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Add: React.FC<InitalProps> = (props) => {
  const { onReload } = props;
  const initialValues = {
    
  }
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const onSubmit = async (values: UserState) => {
    try {
      if (API.addItem) {
        setLoading(true);
        const response = await API.addItem(values);
        if (response.data.success) {
          message.open({
            type: "success",
            content: `Đã thêm ${ITEM_NAME} thành công`
          });
          setVisible(false);
          form.resetFields();
          if (onReload) onReload();
        } else {
          message.open({
            type: "error",
            content: response.data.message
          });
        }
      }
    } catch (err) {
      console.error(err);
      message.open({
        type: "error",
        content: "Đã xảy ra lỗi"
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Thêm mới
      </Button>
      <Modal
        title={`Thêm ${ITEM_NAME}`}
        open={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        footer={<div className="right-aligned">
          <Space>
            <Button
              loading={loading}
              htmlType="button"
              onClick={() => setVisible(false)}
            >
              Huỷ
            </Button>
            <Button form="frm-add" htmlType="submit" type="primary" loading={loading}>
              Lưu
            </Button>
          </Space>
        </div>}
      >
        <Form
          form={form}
          id="frm-add"
          layout="vertical"
          initialValues={initialValues}
          onFinish={onSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật Khẩu"
            name="password"
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(Add);