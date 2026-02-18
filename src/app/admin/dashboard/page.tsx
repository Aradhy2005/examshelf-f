"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Purchase = {
  subjectId?: string;
  unitId?: string;
  amount?: number;
  createdAt?: any;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    subjects: 0,
    units: 0,
    blogs: 0,
    users: 0,
    purchases: 0,
    revenue: 0,
    topSubjects: [] as [string, number][],
    topUnits: [] as [string, number][],
    recentPurchases: [] as Purchase[],
    revenueTrend: [] as { date: string; amount: number }[],
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const subjectsSnap = await getDocs(collection(db, "subjects"));
        const unitsSnap = await getDocs(collection(db, "units"));
        const blogsSnap = await getDocs(collection(db, "blogs"));
        const usersSnap = await getDocs(collection(db, "users"));
        const purchasesSnap = await getDocs(collection(db, "purchases"));

        let revenue = 0;

        const subjectSales: Record<string, number> = {};
        const unitSales: Record<string, number> = {};
        const revenueByDay: Record<string, number> = {};
        const recentPurchases: Purchase[] = [];

        purchasesSnap.forEach((doc) => {
          const data = doc.data() as Purchase;

          revenue += data.amount || 0;

          // subject sales
          if (data.subjectId) {
            subjectSales[data.subjectId] =
              (subjectSales[data.subjectId] || 0) + 1;
          }

          // unit sales
          if (data.unitId) {
            unitSales[data.unitId] =
              (unitSales[data.unitId] || 0) + 1;
          }

          // revenue by day
          if (data.createdAt?.seconds) {
            const date = new Date(
              data.createdAt.seconds * 1000
            ).toLocaleDateString();

            revenueByDay[date] =
              (revenueByDay[date] || 0) + (data.amount || 0);
          }

          recentPurchases.push(data);
        });

        const topSubjects = Object.entries(subjectSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const topUnits = Object.entries(unitSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const revenueTrend = Object.entries(revenueByDay).map(
          ([date, amount]) => ({ date, amount })
        );

        // sort latest purchases first
        recentPurchases.sort(
          (a: any, b: any) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

        setStats({
          subjects: subjectsSnap.size,
          units: unitsSnap.size,
          blogs: blogsSnap.size,
          users: usersSnap.size,
          purchases: purchasesSnap.size,
          revenue,
          topSubjects,
          topUnits,
          revenueTrend,
          recentPurchases: recentPurchases.slice(0, 5),
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="min-h-screen px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/admin/subjects">
            <button className="px-6 py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-500">
              ➕ Add Subject
            </button>
          </Link>

          <Link href="/admin/blogs">
            <button className="px-6 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500">
              ✍️ Add Blog
            </button>
          </Link>

          <Link href="/admin/subjects">
            <button className="px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600">
              ⚙ Manage Subjects
            </button>
          </Link>
        </div>

        {/* CORE STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Subjects" value={stats.subjects} />
          <StatCard title="Units" value={stats.units} />
          <StatCard title="Blogs" value={stats.blogs} />
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Purchases" value={stats.purchases} />
          <StatCard title="Revenue" value={`₹${stats.revenue}`} />
        </div>

        {/* REVENUE TREND */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>

          <div className="h-64 bg-white/5 rounded-2xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueTrend}>
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP SUBJECTS */}
        <Section title="Top Selling Subjects">
          {stats.topSubjects.length === 0
            ? "No sales yet"
            : stats.topSubjects.map(([id, count]) => (
                <Row key={id} label={id} value={`${count} sales`} />
              ))}
        </Section>

        {/* TOP UNITS */}
        <Section title="Top Units Sold">
          {stats.topUnits.length === 0
            ? "No unit sales yet"
            : stats.topUnits.map(([id, count]) => (
                <Row key={id} label={id} value={`${count} sales`} />
              ))}
        </Section>

        {/* RECENT PURCHASES */}
        <Section title="Recent Purchases">
          {stats.recentPurchases.length === 0
            ? "No purchases yet"
            : stats.recentPurchases.map((p, i) => (
                <Row
                  key={i}
                  label={p.subjectId || "Unknown"}
                  value={`₹${p.amount}`}
                />
              ))}
        </Section>

      </div>
    </main>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-2 text-gray-300 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between py-2 border-b border-white/10">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
