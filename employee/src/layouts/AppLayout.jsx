import { useMemo, useState } from 'react'
import { Layout, Menu, Avatar, Badge, Input, Space, Typography } from 'antd'
import {
  HomeOutlined,
  ProfileOutlined,
  BarChartOutlined,
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

export const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Trang chu',
  },
  {
    key: '/orders',
    icon: <ProfileOutlined />,
    label: 'Trang thai don hang',
  },
  {
    key: '/analytics',
    icon: <BarChartOutlined />,
    label: 'Thong ke',
  },
]

const userProfile = {
  name: 'Nguyen Van A',
  role: 'Doi tac cap cao',
  avatar: 'https://i.pravatar.cc/100?img=67',
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {
    location: { pathname },
  } = useRouterState({ select: (state) => state })

  const selectedKey = useMemo(() => {
    const match = menuItems.find((item) => pathname === item.key)
    return match?.key ?? '/'
  }, [pathname])

  const activeMenu = useMemo(
    () => menuItems.find((item) => item.key === selectedKey),
    [selectedKey],
  )

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        className="!bg-sidebar"
        theme="dark"
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <ShoppingCartOutlined className="text-xl" />
          </div>
          {!collapsed && (
            <div>
              <Text className="text-white" strong>
                Partner Hub
              </Text>
              <p className="m-0 text-xs text-slate-300">Quan tri doi tac</p>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate({ to: key })}
          className="border-0"
        />
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between gap-6 !bg-header px-6">
          {activeMenu ? (
            <div className="text-white">
              <Text className="text-slate-300">Hom nay</Text>
              <Title level={4} className="!mb-0 !text-white">
                {activeMenu.label}
              </Title>
            </div>
          ) : (
            <div />
          )}
          <Space size="large" align="center" className="text-white">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              className="w-72"
              placeholder="Tim kiem san pham, don hang..."
            />
            <Badge count={5} size="small">
              <BellOutlined className="cursor-pointer text-xl text-white" />
            </Badge>
            <Space align="center" size="middle">
              <Avatar src={userProfile.avatar} size={40} />
              <div className="text-right">
                <Text className="text-white" strong>
                  {userProfile.name}
                </Text>
                <p className="m-0 text-xs text-slate-300">{userProfile.role}</p>
              </div>
            </Space>
          </Space>
        </Header>
        <Content className="bg-body p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
