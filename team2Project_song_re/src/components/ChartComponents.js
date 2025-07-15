import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';

// ✅ 월별 관광객 수 선형 차트 컴포넌트
export function LineChartCom({ data }) {
  if (!data || data.length === 0) return <p>AI 기반 상세 분석은 여행지 페이지에서 확인하실 수 있어요! 😊</p>;

  const maxVisitors = Math.max(...data.map(d => d.visitors));
  const minVisitors = Math.min(...data.map(d => d.visitors));

  // 🔹 최대/최소 값에만 라벨 표시
  const renderCustomLabel = ({ x, y, value }) => {
    const label = value === maxVisitors ? '최대' : value === minVisitors ? '최소' : null;
    return label ? (
      <text x={x} y={y - 10} fill={label === '최대' ? 'red' : 'blue'} fontSize={12} textAnchor="middle">
        {label}
      </text>
    ) : null;
  };

  // 🔹 최대/최소 점에만 강조 색상 적용
  const CustomDot = ({ cx, cy, payload }) => {
    const value = payload.visitors;
    const color = value === maxVisitors ? 'red' : value === minVisitors ? 'blue' : '#8884d8';
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={1} />;
  };

  // 🔹 툴팁 커스터마이징
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: '5px' }}>
          <p><strong>{label}</strong></p>
          <p>관광객 수: {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer height={280}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${Math.round(v / 10000)}만`} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#8884d8"
            strokeWidth={2}
            dot={<CustomDot />}
          >
            <LabelList dataKey="visitors" content={renderCustomLabel} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'right', marginRight: 20, fontSize: 10, color: '#666' }}>출처: SKT,KT</p>
    </div>
  );
}


// ✅ 장소 비율 파이차트 컴포넌트
export function PieChartCom({ data }) {
  if (!data || data.length === 0) return <p>AI 기반 상세 분석은 여행지 페이지에서 확인하실 수 있어요! 😊</p>;

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
    '#a4de6c', '#d0ed57', '#ffbb28', '#FF6B6B', '#00C49F',
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%" cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => `${value.toLocaleString()}회`} />
        </PieChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'right', marginRight: 20, fontSize: 10, color: '#666' }}>출처: 카카오맵</p>
    </div>
  );
}


