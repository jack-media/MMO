import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Table, Tag, Typography } from 'antd'

const { Text } = Typography

const ordersMock = [
  {
    key: 'ord-1',
    code: 'DH-20240',
    service: 'Quan ly fanpage toan dien',
    value: 2100000,
    status: 'Dang trien khai',
    progress: 65,
    updatedAt: '28/09/2025',
  },
  {
    key: 'ord-2',
    code: 'DH-20239',
    service: 'Chay quang cao Google Ads',
    value: 4500000,
    status: 'Da duyet',
    progress: 100,
    updatedAt: '27/09/2025',
  },
  {
    key: 'ord-3',
    code: 'DH-20238',
    service: 'Thiet ke landing page',
    value: 3200000,
    status: 'Dang cho duyet',
    progress: 30,
    updatedAt: '27/09/2025',
  },
  {
    key: 'ord-4',
    code: 'DH-20237',
    service: 'Thiet ke bo nhan dien thuong hieu',
    value: 5200000,
    status: 'Hoan thanh',
    progress: 100,
    updatedAt: '25/09/2025',
  },
]

const statusColors = {
  'Dang trien khai': 'processing',
  'Da duyet': 'blue',
  'Dang cho duyet': 'orange',
  'Hoan thanh': 'green',
  'Da huy': 'red',
}

const numberFormatter = new Intl.NumberFormat('vi-VN')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchOrders = async () => {
  await sleep(200)
  return ordersMock
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    initialData: ordersMock,
    staleTime: 1000 * 60 * 5,
  })

  const columns = useMemo(
    () => [
      {
        title: 'Ma don',
        dataIndex: 'code',
        key: 'code',
        render: (value) => <Text strong>{value}</Text>,
      },
      {
        title: 'Dich vu',
        dataIndex: 'service',
        key: 'service',
      },
      {
        title: 'Gia tri',
        dataIndex: 'value',
        key: 'value',
        render: (value) => `${numberFormatter.format(value)} VND`,
        align: 'right',
      },
      {
        title: 'Trang thai',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={statusColors[status] ?? 'default'}>{status}</Tag>
        ),
      },
      {
        title: 'Tien do',
        dataIndex: 'progress',
        key: 'progress',
        render: (value) => `${value}%`,
        align: 'center',
      },
      {
        title: 'Cap nhat',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
      },
    ],
    [],
  )

  return (
    <Card className="shadow-sm">
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  )
}
