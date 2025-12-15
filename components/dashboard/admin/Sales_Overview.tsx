"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Product {
  name: string;
}
interface Customer {
  name: string;
}
interface Order {
  order_id: string;
  order_date: string;
  qty: number;
  rate: number;
  total_amount: number;
  grand_total: number;
  sales_rep_id: number | null;
  product: Product | null;
  customer: Customer | null;
}

type ViewMode = "rep" | "product" | "customer";

function Sales_Overview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [viewMode, setViewMode] = useState<ViewMode>("rep");
  const [hasFiltered, setHasFiltered] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // -------- Fetch Orders --------
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-all-orders`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    loadOrders();
  }, []);

  // -------- Date Filter --------
  const filterByDate = () => {
    if (!startDate || !endDate) return;

    setHasFiltered(true);

    const s = new Date(startDate + "T00:00:00");
    const e = new Date(endDate + "T23:59:59");

    const result = orders.filter((o) => {
      const od = new Date(o.order_date);
      return od >= s && od <= e;
    });

    setFiltered(result);
    setPage(1);
  };

  // -------- Report Generators --------
  const salesByRep = () => {
    const map: Record<string, Record<string, number>> = {};
    filtered.forEach((o) => {
      const rep = o.sales_rep_id ? `REP-${o.sales_rep_id}` : "No Sales Rep";
      const product = o.product?.name || "Unknown Product";
      if (!map[rep]) map[rep] = {};
      if (!map[rep][product]) map[rep][product] = 0;
      map[rep][product] += o.grand_total;
    });
    return map;
  };

  const salesByProduct = () => {
    const map: Record<string, number> = {};
    filtered.forEach((o) => {
      const product = o.product?.name || "Unknown Product";
      if (!map[product]) map[product] = 0;
      map[product] += o.grand_total;
    });
    return map;
  };

  const salesByCustomer = () => {
    const map: Record<string, number> = {};
    filtered.forEach((o) => {
      const customer = o.customer?.name || "Unknown Customer";
      if (!map[customer]) map[customer] = 0;
      map[customer] += o.grand_total;
    });
    return map;
  };

  // -------- Select active dataset --------
  const activeData = useMemo(() => {
    if (viewMode === "product") return salesByProduct();
    if (viewMode === "customer") return salesByCustomer();

    // Rep mode → flatten per rep totals
    const repData = salesByRep();
    const totalPerRep: Record<string, number> = {};
    Object.entries(repData).forEach(([rep, products]) => {
      totalPerRep[rep] = Object.values(products).reduce((a, b) => a + b, 0);
    });
    return totalPerRep;
  }, [viewMode, filtered]);

  // -------- Search + Pagination --------
  const searched = Object.entries(activeData).filter(([key]) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = searched.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(searched.length / perPage);

  // -------- Chart Data --------
  const labels = searched.map(([key]) => key);
  const values = searched.map(([_, val]) => val);

  const chartColors = values.map(
    (_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors,
      },
    ],
  };

  const pieOptions = {
  plugins: {
    legend: {
      display: false, // HIDE LABELS
    },
    tooltip: {
      enabled: true, // HIDE TOOLTIP POPUPS
    },
  },
};

  // -------- UI --------
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sales Overview</h1>

      {/* ---- Date Filter ---- */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-sm">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">End Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={filterByDate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* ---------- VIEW MODE BUTTONS ---------- */}
      {filtered.length > 0 && (
        <div className="flex gap-4 mt-4">
          {[
            { key: "rep", label: "Sales by Sales Rep" },
            { key: "product", label: "Sales by Product" },
            { key: "customer", label: "Sales by Customer" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setViewMode(btn.key as ViewMode);
                setPage(1);
              }}
              className={`px-4 py-2 rounded border 
                ${viewMode === btn.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* ---------- NO DATA ---------- */}
      {hasFiltered && filtered.length === 0 && (
        <p className="text-red-600 font-semibold mt-4">
          ❌ No data available for the selected date range.
        </p>
      )}

      {/* ----------------------- CHARTS + TABLE ----------------------- */}
      {filtered.length > 0 && (
        <div className="space-y-8">

          {/* SEARCH */}
          <input
            placeholder="Search..."
            className="border p-2 rounded w-full mt-4"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold mb-2">Bar Chart</h3>
              <Bar data={barData} />
            </div>

            <div className="p-4 bg-white rounded shadow w-[50%] h-[100%]">
              <h3 className="font-semibold mb-2">Pie Chart</h3>
              <Pie data={pieData} options={pieOptions}/>
            </div>
          </div>

          {/* Table */}
          <div className="p-4 bg-white rounded shadow overflow-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(([name, value]) => (
                  <tr key={name}>
                    <td className="p-2 border">{name}</td>
                    <td className="p-2 border">₹{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* ---------------- REP SPECIAL TABLE (PRODUCT WISE) ---------------- */}
          {viewMode === "rep" && (
            <section>
              <h2 className="text-xl font-semibold mb-2 mt-6">
                Sales by Sales Rep (Product-wise)
              </h2>

              {Object.entries(salesByRep()).map(([rep, products]) => (
                <div key={rep} className="mb-6 border rounded-lg p-4 bg-white">
                  <h3 className="font-bold text-lg mb-2">{rep}</h3>

                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Product</th>
                        <th className="p-2 border">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(products).map(([product, total]) => (
                        <tr key={product}>
                          <td className="p-2 border">{product}</td>
                          <td className="p-2 border">₹{total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Sales_Overview;
