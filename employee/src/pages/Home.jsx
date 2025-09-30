import { useQuery } from '@tanstack/react-query'
import { Card, Col, Rate, Row, Spin, Typography } from 'antd'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const productMock = [
  {
    id: 'prd-1',
    name: 'Goi dich vu quang cao Facebook',
    price: 2500000,
    seller: 'Hoang Media',
    contact: '0938 123 456',
    rating: 4.8,
    orders: 132,
    comments: 87,
    thumbnail:
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-2',
    name: 'Thiet ke landing page chuyen nghiep',
    price: 3200000,
    seller: 'CreativeX Studio',
    contact: '0987 654 321',
    rating: 4.6,
    orders: 98,
    comments: 65,
    thumbnail:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-3',
    name: 'Quan ly fanpage toan dien',
    price: 2100000,
    seller: 'Social Boost',
    contact: '0902 888 777',
    rating: 4.9,
    orders: 184,
    comments: 102,
    thumbnail:
      'https://images.unsplash.com/photo-1545239351-14f86846e013?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-4',
    name: 'Chay quang cao Google Ads',
    price: 4500000,
    seller: 'AdMaster Agency',
    contact: '0941 222 555',
    rating: 4.7,
    orders: 76,
    comments: 58,
    thumbnail:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-5',
    name: 'Trien khai CRM cho doanh nghiep',
    price: 7800000,
    seller: 'NextGen Solutions',
    contact: '0977 999 555',
    rating: 4.5,
    orders: 54,
    comments: 44,
    thumbnail:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prd-6',
    name: 'Thiet ke bo nhan dien thuong hieu',
    price: 5200000,
    seller: 'Brandico',
    contact: '0911 555 666',
    rating: 4.4,
    orders: 69,
    comments: 51,
    thumbnail:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
]

const numberFormatter = new Intl.NumberFormat('vi-VN')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchProducts = async () => {
  await sleep(200)
  return productMock
}

export default function HomePage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: productMock,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading && !products.length) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Row gutter={[24, 24]}>
      {products.map((item) => (
        <Col key={item.id} xs={24} md={12} xl={8}>
          <Card
            className="h-full overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            cover={
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
            }
            actions={[
              <span key="contact" className="text-sm font-medium text-primary">
                Lien he: {item.contact}
              </span>,
            ]}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <Title level={5} className="!mb-0 !text-slate-800">
                  {item.name}
                </Title>
                <Text strong className="text-primary">
                  {numberFormatter.format(item.price)} VND
                </Text>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <UserOutlined /> {item.seller}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCartOutlined /> {item.orders} don
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Binh luan: {item.comments}</span>
                <span className="flex items-center gap-2">
                  <Rate allowHalf disabled value={Math.round(item.rating * 2) / 2} />
                  <Text type="secondary">{item.rating.toFixed(1)}</Text>
                </span>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
