import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Statistic, Typography } from 'antd'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const { Title, Text } = Typography

const statsMock = {
  totalSpent: 17800000,
  totalOrders: 48,
  approvedOrders: 36,
  successOrders: 32,
  pendingOrders: 6,
  cancelledOrders: 4,
}

const statusChartPalette = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444']
const barGradient = ['#38bdf8', '#2563eb']
const numberFormatter = new Intl.NumberFormat('vi-VN')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchStats = async () => {
  await sleep(150)
  return statsMock
}

export default function AnalyticsPage() {
  const { data: stats = statsMock, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: fetchStats,
    initialData: statsMock,
    staleTime: 1000 * 60 * 10,
  })

  const {
    totalSpent = 0,
    totalOrders = 0,
    approvedOrders = 0,
    successOrders = 0,
    pendingOrders = 0,
    cancelledOrders = 0,
  } = stats ?? {}

  const metricCards = [
    { key: 'totalSpent', title: 'Tong chi tieu', value: totalSpent, suffix: ' VND' },
    { key: 'totalOrders', title: 'Tong don hang', value: totalOrders },
    { key: 'approvedOrders', title: 'Don da duyet', value: approvedOrders },
    { key: 'successOrders', title: 'Don thanh cong', value: successOrders },
    { key: 'pendingOrders', title: 'Don dang cho', value: pendingOrders },
    { key: 'cancelledOrders', title: 'Don da huy', value: cancelledOrders },
  ]

  const monthlyTrendData = useMemo(() => {
    const months = ['T4', 'T5', 'T6', 'T7', 'T8', 'T9']
    const averageSpent = Math.max(totalSpent, 6_000_000) / months.length
    const averageOrders = Math.max(totalOrders, months.length * 12) / months.length

    return months.map((month) => {
      const spending = Math.round(averageSpent * (0.75 + Math.random() * 0.5))
      const orders = Math.round(averageOrders * (0.7 + Math.random() * 0.6))

      return {
        month,
        orders,
        spending,
      }
    })
  }, [totalOrders, totalSpent])

  const statusDistribution = useMemo(() => {
    const statuses = [
      { key: 'approved', name: 'Da duyet' },
      { key: 'success', name: 'Thanh cong' },
      { key: 'pending', name: 'Dang cho' },
      { key: 'cancelled', name: 'Da huy' },
    ]

    const seeds = statuses.map(() => 0.6 + Math.random())
    const seedTotal = seeds.reduce((acc, seed) => acc + seed, 0)
    const ordersBase = Math.max(totalOrders, statuses.length * 12)
    let allocated = 0

    return statuses.map((status, index) => {
      if (index === statuses.length - 1) {
        const remaining = Math.max(1, ordersBase - allocated)
        const percentage =
          ordersBase === 0 ? 0 : Math.round((remaining / ordersBase) * 100)

        return {
          ...status,
          value: remaining,
          percentage,
          color: statusChartPalette[index % statusChartPalette.length],
        }
      }

      const value = Math.max(
        1,
        Math.round((seeds[index] / seedTotal) * ordersBase),
      )
      allocated += value

      const percentage =
        ordersBase === 0 ? 0 : Math.round((value / ordersBase) * 100)

      return {
        ...status,
        value,
        percentage,
        color: statusChartPalette[index % statusChartPalette.length],
      }
    })
  }, [totalOrders])

  const spendingAxisFormatter = (value) => `${Math.round(value / 1_000_000)}tr`

  const handleTrendTooltip = (value, name) => {
    if (name === 'Don hang') {
      return [`${value} don`, name]
    }

    return [`${numberFormatter.format(Number(value))} VND`, name]
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2" loading={isLoading}>
          <div className="flex flex-col gap-4">
            <div>
              <Title level={5} className="!mb-1 !text-slate-800">
                Chi tieu & don hang 6 thang gan nhat
              </Title>
              <Text type="secondary">
                Mot bieu do cot + duong giup ban so sanh don hang va chi tieu
              </Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyTrendData}
                  margin={{ top: 12, right: 24, left: 0, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="ordersGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={barGradient[0]} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={barGradient[1]} stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="spendingLine" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    yAxisId="left"
                    allowDecimals={false}
                    stroke="#64748b"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    tickFormatter={spendingAxisFormatter}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip formatter={handleTrendTooltip} cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    name="Don hang"
                    fill="url(#ordersGradient)"
                    radius={[8, 8, 4, 4]}
                    barSize={42}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="spending"
                    name="Chi tieu (VND)"
                    stroke="url(#spendingLine)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#16a34a', strokeWidth: 0 }}
                    activeDot={{ r: 7, stroke: '#16a34a', fill: '#fff', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
        <Card className="shadow-sm" loading={isLoading}>
          <div className="flex flex-col gap-4">
            <div>
              <Title level={5} className="!mb-1 !text-slate-800">
                Phan bo trang thai don hang (ngau nhien)
              </Title>
              <Text type="secondary">
                Bieu do tron to mau nhan dien nhom cong viec
              </Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={6}
                    stroke="#f8fafc"
                    strokeWidth={2}
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name) => [`${value} don`, name]}
                    cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {statusDistribution.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="inline-flex h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-sm text-slate-500">
                    {item.value} don ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => (
          <Card
            key={metric.key}
            className="border-0 shadow-sm"
            loading={isLoading}
            style={{
              background: `linear-gradient(135deg, rgba(37, 99, 235, ${0.1 + index * 0.05}), rgba(14, 165, 233, ${0.08 + index * 0.04}))`,
            }}
          >
            <Statistic
              title={metric.title}
              value={metric.value}
              suffix={metric.suffix}
              formatter={(value) => numberFormatter.format(Number(value ?? 0))}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#0f172a' }}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
