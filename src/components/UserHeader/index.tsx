import React from "react";
import { Avatar, Dropdown, Space } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutUser } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_PATH } from "../../configs";
import { FaSignOutAlt } from "react-icons/fa";
import ImgAvatar from "../../assets/avatar.png";
const UserHeader: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items: ItemType[] = [{
    key: "logout",
    icon: <FaSignOutAlt viewBox="0 -100 640 512" />,
    label: "Đăng Xuất",
    onClick: () => {
      dispatch(logoutUser());
      navigate(AUTH_PATH);
    }
  }];
  return (
    <>
      <Dropdown className="ant-dropdown-user" menu={{ items }}>
        <Space>
          <Avatar size="small" src={ImgAvatar} alt="avatar" />
          <span>{user?.username}</span>
        </Space>
      </Dropdown>
    </>
  );
};

export default UserHeader;