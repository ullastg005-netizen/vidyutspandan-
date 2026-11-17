import React, { useState } from 'react';
import {
  Download, Calendar, TrendingUp,
  CheckCircle2, AlertTriangle, Zap
} from 'lucide-react';
import { Card, StatCard, Button, Select, DemoBanner } from '../../components/ui';
import {
  MONTHLY_FAULT_TRENDS, WARD_STATS, WORK_ORDER_STATUS_DATA
} from '../../utils/demoData';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export function ReportsPage() {
  const [selectedWard, setSelectedWard] = useState('all');
  const [dateRange, setDateRange] = useState('last_6_months');

  const COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#22d3ee', '#10b981', '#f43f5e'];

  const handleExportCSV = () => {
    const headers = 'Month,Reported Faults,Resolved Faults\n';
    const rows = MONTHLY_FAULT_TRENDS.map(m => `${m.month},${m.faults},${m.resolved}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bescom_operations_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Operational Report exported to CSV!');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Operational Analytics & Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database-backed operational intelligence, maintenance turnaround, fault trends, and ward performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'last_30_days', label: 'Last 30 Days' },
              { value: 'last_6_months', label: 'Last 6 Months' },
              { value: 'year_to_date', label: 'Year to Date (2024)' },
            ]}
          />
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export All Data (CSV)
          </Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Logged Incidents"
          value="207"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          subtitle="+4.2% from last cycle"
        />
        <StatCard
          label="Resolved Work Orders"
          value="189"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="91.3% resolution rate"
        />
        <StatCard
          label="Mean Time to Repair"
          value="3.4 hrs"
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle="Target < 4.0 hrs"
        />
        <StatCard
          label="Total Active Assets"
          value="487"
          icon={<Zap className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="Monitored in system"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Faults vs Resolved Trend */}
        <Card title="Monthly Incident Trends" subtitle="Reported Faults vs Timely Resolutions">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_FAULT_TRENDS}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="faults" name="Reported Faults" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved Tasks" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Work Order Lifecycle Distribution */}
        <Card title="Work Order Status Breakdown" subtitle="Current status across entire task pipeline">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={WORK_ORDER_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {WORK_ORDER_STATUS_DATA.map((_item, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Ward Comparison Bar Chart */}
      <Card title="Ward-Wise Asset Health Performance" subtitle="Total vs Healthy streetlights by Bengaluru wards">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WARD_STATS} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <XAxis dataKey="ward" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" name="Total Mapped" fill="#38bdf8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="working" name="Operational (Working)" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="faulty" name="Reported Faulty" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
