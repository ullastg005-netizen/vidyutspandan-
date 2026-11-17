import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Shield, Lightbulb, Zap, Activity, FileText,
  AlertTriangle, CheckCircle, TrendingUp, Download, Eye, Plus
} from 'lucide-react';
import { StatCard, Card, Badge, Button, DemoBanner, Table, TableRow, TableCell } from '../../components/ui';
import {
  DEMO_DASHBOARD_STATS, DEMO_WORK_ORDERS, DEMO_STREETLIGHTS,
  DEMO_TRANSFORMERS, WARD_STATS
} from '../../utils/demoData';
import { getStatusColor, getStatusLabel, getPriorityColor, formatDate } from '../../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export function AdminDashboard() {
  const stats = DEMO_DASHBOARD_STATS;

  // Pie chart data for streetlights
  const streetlightPieData = [
    { name: 'Working', value: stats.working_streetlights, color: '#10b981' },
    { name: 'Faulty', value: stats.faulty_streetlights, color: '#ef4444' },
    { name: 'Maintenance', value: stats.maintenance_streetlights, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Central Operations Administration</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System-wide distribution assets, user governance, audit telemetry, and operational health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/map">
            <Button variant="outline" size="sm" icon={<Zap className="w-3.5 h-3.5" />}>
              Open GIS Command Map
            </Button>
          </Link>
          <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export Audit Report
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total Assets"
          value={stats.total_assets}
          icon={<Zap className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="All distribution units"
        />
        <StatCard
          label="Streetlights"
          value={stats.total_streetlights}
          icon={<Lightbulb className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle={`${stats.working_streetlights} active`}
        />
        <StatCard
          label="Transformers"
          value={stats.total_transformers}
          icon={<Activity className="w-5 h-5" />}
          color="text-indigo-400"
          subtitle="98 DTR units mapped"
        />
        <StatCard
          label="Feeders"
          value={stats.total_feeders}
          icon={<Zap className="w-5 h-5" />}
          color="text-purple-400"
          subtitle="11kV circuits"
        />
        <StatCard
          label="Work Orders"
          value={stats.open_work_orders + stats.assigned_work_orders}
          icon={<FileText className="w-5 h-5" />}
          color="text-orange-400"
          subtitle={`${stats.pending_verification} awaiting QA`}
        />
        <StatCard
          label="System Users"
          value={stats.total_users}
          icon={<Users className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="Active roles"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward-Wise Streetlight Distribution */}
        <Card title="Ward-Wise Asset Operations" subtitle="Working vs Faulty units across Bengaluru wards" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="ward" stroke="#64748b" fontSize={11} angle={-30} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
                />
                <Bar dataKey="working" name="Working" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="faulty" name="Faulty" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="maintenance" name="Under Maintenance" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Streetlight Health Ratio */}
        <Card title="Asset Health Status" subtitle="Overall fleet health breakdown">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={streetlightPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {streetlightPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#1e2d55]">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Working</p>
              <p className="text-sm font-bold text-emerald-400">89.2%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Faulty</p>
              <p className="text-sm font-bold text-red-400">7.1%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Repair</p>
              <p className="text-sm font-bold text-amber-400">3.7%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Critical Active Work Orders Table */}
      <Card
        title="Active Operations & Work Orders"
        subtitle="Real-time maintenance workflow across sub-divisions"
        actions={
          <Link to="/work-orders">
            <Button variant="ghost" size="sm">View All Work Orders →</Button>
          </Link>
        }
      >
        <Table headers={['Code', 'Title', 'Priority', 'Status', 'Due Date', 'Assigned Lineman', 'Action']}>
          {DEMO_WORK_ORDERS.slice(0, 5).map((wo) => (
            <TableRow key={wo.id}>
              <TableCell className="font-mono text-cyan-400 text-xs font-semibold">{wo.work_order_code}</TableCell>
              <TableCell>
                <p className="font-medium text-white text-xs">{wo.title}</p>
                <p className="text-[10px] text-slate-500">{wo.location_address}</p>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(wo.priority)}>
                  {wo.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(wo.status)}>
                  {getStatusLabel(wo.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">{formatDate(wo.due_date || '')}</TableCell>
              <TableCell className="text-xs text-slate-300">Suresh Babu</TableCell>
              <TableCell>
                <Link to={`/work-orders?id=${wo.id}`}>
                  <button className="text-amber-400 hover:text-amber-300 text-xs font-medium">
                    Review
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
