import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCard = ({ title, value, icon, iconBg }) => (
  <div
    style={{
      flex: 1,
      minWidth: 220,
      padding: 20,
      borderRadius: 16,
      background: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "all 0.2s ease",
      cursor: "pointer",
    }}
  >
    <div>
      <div style={{ fontSize: 28, fontWeight: "700" }}>{value}</div>
      <div style={{ fontSize: 14, color: "#777", marginTop: 5 }}>{title}</div>
    </div>
    <div
      style={{
        background: iconBg,
        padding: 15,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        color: "#fff",
      }}
    >
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpense: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const [charts, setCharts] = useState({
    sales: { labels: [], data: [] },
    orders: { labels: [], data: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dashboard");
        const data = res.data;
        console.log("Dashboard API Response:", data);

        setStats({
          totalSales: data.stats.totalSales,
          totalExpense: data.stats.totalExpense,
          totalOrders: data.stats.totalOrders,
          totalProducts: data.stats.totalProducts,
        });

        setCharts({
          sales: {
            labels: data.weeklySales.labels,
            data: data.weeklySales.data,
          },
          orders: {
            labels: data.ordersByCategory.labels,
            data: data.ordersByCategory.data,
          },
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const salesData = {
    labels: charts.sales.labels,
    datasets: [
      {
        label: "Sales ($)",
        data: charts.sales.data,
        borderColor: "#1abc9c",
        backgroundColor: "rgba(26, 188, 156, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const ordersData = {
    labels: charts.orders.labels,
    datasets: [
      {
        label: "Orders",
        data: charts.orders.data,
        backgroundColor: ["#3498db", "#f39c12", "#e74c3c", "#9b59b6"],
      },
    ],
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <DashboardCard
          title="Total Sales"
          value={`$${stats.totalSales}`}
          icon="💰"
          iconBg="linear-gradient(135deg, #1abc9c, #16a085)"
        />
        <DashboardCard
          title="Total Expense"
          value={`$${stats.totalExpense}`}
          icon="📉"
          iconBg="linear-gradient(135deg, #e74c3c, #c0392b)"
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="🛒"
          iconBg="linear-gradient(135deg, #3498db, #2980b9)"
        />
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          iconBg="linear-gradient(135deg, #f39c12, #d35400)"
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 2,
            minWidth: 400,
            background: "#fff",
            padding: 20,
            borderRadius: 16,
            margin: 10,
            boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>
            Weekly Sales
          </h3>
          <Line data={salesData} />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 16,
            margin: 10,
            boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>
            Orders by Category
          </h3>
          <Bar data={ordersData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
