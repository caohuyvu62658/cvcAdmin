import React, { useEffect, memo, useCallback } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import menus from "../../configs/menu";
import { useNavigate, useLocation } from "react-router-dom";
import { getUrl } from "../../utils";
import { APP_PREFIX_PATH } from "../../configs";
import { useAppSelector } from "../../redux/hooks";
import { Scrollbars } from "react-custom-scrollbars-2";
const checkUrl = (pathUrl: string) => {
	let splitUrl = pathUrl.split("/").slice(2);
	let filter = menus.filter((item) => item.key == splitUrl[0]);
	if (filter.length > 0) {
		if (filter[0].children) {
			if (splitUrl.length > 1) {
				return {
					openKeys: splitUrl[0],
					selectKey: `${splitUrl[0]}_${splitUrl[1]}`
				}
			} else {
				return {
					openKeys: splitUrl[0],
					selectKey: `${splitUrl[0]}_item`
				}
			}
		} else {
			return {
				selectKey: splitUrl[0]
			}
		}
	}
}
const Aside = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const onClick: MenuProps["onClick"] = (e) => {
		navigate(getUrl(e.key));
	};
	const themeSetting = useAppSelector((state) => state.theme);
	let infoUrl = checkUrl(location.pathname);
	return (
		<Scrollbars style={{ height: "100vh" }}>
			<Menu
				theme={themeSetting.isDarkMenu && !themeSetting.isDark ? "dark" : "light"}
				onClick={onClick}
				defaultSelectedKeys={[infoUrl?.selectKey || ""]}
				defaultOpenKeys={infoUrl?.openKeys ? [infoUrl?.openKeys] : undefined}
				mode="inline"
				items={menus}
				style={{ borderRight: 0 }}
			/>
		</Scrollbars>
	);
};

export default memo(Aside);