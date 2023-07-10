import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
const items  = (onClick: (key: string) => void) => [
    {
        label: (
            <div onClick={() => onClick('pending')}>Pending</div>
        ),
        key: '0',
    },
    {
        label: (
            <div onClick={() => onClick('success')}>Success</div>
        ),
        key: '1',
    },
    {
        label: (
            <div onClick={() => onClick('failed')}>Failed</div>
        ),
        key: '2',
    },
];

type TProps = {
    onClickItem: (key: string) => void;
    children: React.ReactNode;
}
const StatusDropdown: React.FC<TProps> = ({ onClickItem, children }) => {
    return (
        <Dropdown
            menu={{
                items: items(onClickItem),
            }}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    {children}
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};
export default StatusDropdown;