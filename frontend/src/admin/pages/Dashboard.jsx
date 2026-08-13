import { useEffect } from "react";
import RevenueChart from "../components/RevenueChart";
import OrderStatusChart from "../components/OrderStatusChart";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  CalendarDays,
} from "lucide-react";

import { getDashboardStats } from "../../store/slices/adminSlice";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, loading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading || !dashboard) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h1 className="text-xl text-white">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Heading */}

      <div>

        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back! Here's what's happening today.
        </p>

      </div>
      

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <StatsCard
          title="Total Revenue"
          value={dashboard.totalRevenueAllTime}
          icon={<DollarSign />}
          color="bg-green-500"
        />

        <StatsCard
          title="Today's Revenue"
          value={dashboard.todayRevenue}
          icon={<CalendarDays />}
          color="bg-blue-500"
        />

        <StatsCard
          title="Customers"
          value={dashboard.totalUsersCount}
          icon={<Users />}
          color="bg-purple-500"
        />

        <StatsCard
          title="Revenue Growth"
          value={parseFloat(
            dashboard.revenueGrowth.replace("%", "")
          )}
          icon={<TrendingUp />}
          color="bg-orange-500"
        />

        <StatsCard
          title="Current Month Sales"
          value={dashboard.currentMonthSales}
          icon={<ShoppingBag />}
          color="bg-pink-500"
        />

        <StatsCard
          title="New Users"
          value={dashboard.newUsersThisMonth}
          icon={<Package />}
          color="bg-cyan-500"
        />

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  <RevenueChart
    data={dashboard.monthlySales}
  />

  <OrderStatusChart
    orderStatusCounts={dashboard.orderStatusCounts}
  />

</div>

      {/* Bottom */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

          <h2 className="text-xl font-semibold mb-4">
            Top Selling Products
          </h2>

          {dashboard.topSellingProducts?.map((item) => (
            <div
              key={item.name}
              className="flex justify-between py-3 border-b border-slate-800"
            >
              <span>{item.name}</span>

              <span>{item.total_sold}</span>
            </div>
          ))}

        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

          <h2 className="text-xl font-semibold mb-4">
            Low Stock Products
          </h2>

          {dashboard.lowStockProducts?.map((item) => (
            <div
              key={item.name}
              className="flex justify-between py-3 border-b border-slate-800"
            >
              <span>{item.name}</span>

              <span className="text-red-400">
                {item.stock}
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;