import React, { memo, useState } from "react";
import { InitalProps } from "../../typings/datatable";
import { API, ITEM_NAME, ExtensionState } from "./constant";
import { message, Button, Form, Input, Modal, Space, Tooltip, Checkbox } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { v4 } from "uuid";

const Edit: React.FC<InitalProps> = (props) => {
  const { onReload, item } = props;
  const initialValues = {
    ...item
  }
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const onSubmit = async (values: ExtensionState) => {
    try {
      if (API.editItem) {
        setLoading(true);
        const payload = {...values, timeout: Number(values.timeout), timeout2: Number(values.timeout2)};
        const response = await API.editItem(item._id, payload);
        if (response.data.success) {
          message.open({
            type: "success",
            content: `Đã sửa ${ITEM_NAME} thành công`,
          });
          setVisible(false);
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
      <Tooltip title="Sửa">
        <Button
          onClick={() => setVisible(true)}
          icon={<EditOutlined />}
        >
        </Button>
      </Tooltip>
      <Modal
        title={`Sửa ${ITEM_NAME}`}
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
            <Button form="frm-edit" htmlType="submit" type="primary" loading={loading}>
              Lưu
            </Button>
          </Space>
        </div>}
      >
        <Form
          form={form}
          id="frm-edit"
          layout="vertical"
          initialValues={initialValues}
          onFinish={onSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Url"
            name="url"
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Timeout"
            name="timeout"
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
              label="Timeout 2"
              name="timeout2"
              rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Skip OTP"
            name="skipOTP"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
              label="Log message"
              name="logMessage"
          >
            <Input type="string" />
          </Form.Item>
          <Form.Item
              label="Token"
              name="token"
              rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Button onClick={() => {
            form.setFieldsValue({
              token: v4(),  
            })
          }}>Lấy token</Button>
        </Form>
      </Modal>
    </>
  )
}

export default memo(Edit);