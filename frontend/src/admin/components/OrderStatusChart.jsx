import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

const OrderStatusChart = ({ orderStatusCounts }) => {
  const data = [
    {
      name: "Processing",
      value: orderStatusCounts?.Processing || 0,
    },
    {
      name: "Shipped",
      value: orderStatusCounts?.Shipped || 0,
    },
    {
      name: "Delivered",
      value: orderStatusCounts?.Delivered || 0,
    },
    {
      name: "Cancelled",
      value: orderStatusCounts?.Cancelled || 0,
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-6">
        Order Status
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;