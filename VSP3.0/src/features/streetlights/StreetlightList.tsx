import React, { useState } from 'react';
import {
  Lightbulb, Plus, Search, Filter, Download,
  CheckCircle, AlertTriangle, Clock, MapPin
} from 'lucide-react';
import {
  Card, StatCard, Badge, Button, Table, TableRow, TableCell,
  Input, Select, Modal, DemoBanner
} from '../../components/ui';
import { DEMO_STREETLIGHTS, DEMO_WARDS, WARD_STATS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel, formatDate } from '../../utils/helpers';
import type { Streetlight } from '../../types';
import toast, { Toaster } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export function StreetlightList() {
  const [streetlights, setStreetlights] = useState<Streetlight[]>(DEMO_STREETLIGHTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Streetlight Form State
  const [newSL, setNewSL] = useState({
    name: '',
    locality: '',
    ward_id: 'ward-001',
    lamp_type: 'LED',
    wattage: 45,
    pole_type: 'GI Pipe',
    latitude: 12.9280,
    longitude: 77.5830,
    status: 'working',
  });

  const filtered = streetlights.filter((sl) => {
    const matchesSearch =
      sl.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sl.locality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sl.status === statusFilter;
    const matchesWard = wardFilter === 'all' || sl.ward_id === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Streetlight = {
      id: `sl-${Date.now()}`,
      asset_code: `SL-NEW-${Math.floor(100 + Math.random() * 900)}`,
      type: 'streetlight',
      name: newSL.name,
      locality: newSL.locality,
      ward_id: newSL.ward_id,
      zone_id: 'zone-001',
      lamp_type: newSL.lamp_type,
      wattage: Number(newSL.wattage),
      pole_type: newSL.pole_type,
      latitude: Number(newSL.latitude),
      longitude: Number(newSL.longitude),
      status: newSL.status as any,
      installation_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStreetlights([created, ...streetlights]);
    setAddModalOpen(false);
    toast.success(`Streetlight ${created.asset_code} registered in system!`);
  };

  const handleExportCSV = () => {
    const headers = 'Asset Code,Name,Locality,Ward ID,Status,Lamp Type,Wattage,Latitude,Longitude\n';
    const rows = filtered
      .map(s => `${s.asset_code},"${s.name}","${s.locality}",${s.ward_id},${s.status},${s.lamp_type || ''},${s.wattage || ''},${s.latitude},${s.longitude}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streetlights_bescom_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Streetlight registry exported to CSV!');
  };

  const total = streetlights.length;
  const working = streetlights.filter(s => s.status === 'working').length;
  const faulty = streetlights.filter(s => s.status === 'faulty' || s.status === 'damaged').length;
  const maintenance = streetlights.filter(s => s.status === 'under_maintenance').length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Smart Streetlight Infrastructure</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Digital asset registry, pole-level operational monitoring, and ward statistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Register Streetlight
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          value={total}
          icon={<Lightbulb className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle="All mapped luminaires"
        />
        <StatCard
          label="Operational"
          value={working}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle={`${((working / total) * 100).toFixed(1)}% healthy`}
        />
        <StatCard
          label="Reported Faults"
          value={faulty}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          subtitle="Action required"
        />
        <StatCard
          label="Under Maintenance"
          value={maintenance}
          icon={<Clock className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="Crews dispatched"
        />
      </div>

      {/* Ward-wise health chart */}
      <Card title="Ward-Wise Streetlight Working Percentage" subtitle="Operational uptime benchmarking">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WARD_STATS}>
              <XAxis dataKey="ward" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 60]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111d35', borderColor: '#1e2d55', borderRadius: 6, fontSize: 12 }}
              />
              <Bar dataKey="working" name="Working" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="faulty" name="Faulty" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filters and Search Bar */}
      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55] flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] max-w-sm">
            <Input
              placeholder="Search by Pole ID, locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'working', label: 'Working' },
                { value: 'faulty', label: 'Faulty' },
                { value: 'damaged', label: 'Damaged' },
                { value: 'under_maintenance', label: 'Under Maintenance' },
                { value: 'awaiting_inspection', label: 'Awaiting Inspection' },
              ]}
            />
            <Select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Wards' },
                { value: 'ward-001', label: 'Ward 174 - Jayanagar' },
                { value: 'ward-002', label: 'Ward 177 - BTM Layout' },
                { value: 'ward-003', label: 'Ward 151 - Koramangala' },
                { value: 'ward-004', label: 'Ward 81 - Indiranagar' },
                { value: 'ward-005', label: 'Ward 56 - Whitefield' },
              ]}
            />
          </div>
        </div>

        {/* Streetlight Table */}
        <Table headers={['Pole Code', 'Asset Name', 'Locality', 'Status', 'Fixture', 'Wattage', 'Inspection Date']}>
          {filtered.map((sl) => (
            <TableRow key={sl.id}>
              <TableCell className="font-mono text-cyan-400 text-xs font-semibold">{sl.asset_code}</TableCell>
              <TableCell className="text-xs font-medium text-white">{sl.name}</TableCell>
              <TableCell className="text-xs text-slate-400">{sl.locality}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(sl.status)}>
                  {getStatusLabel(sl.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-300">{sl.lamp_type || 'LED'}</TableCell>
              <TableCell className="text-xs text-slate-300">{sl.wattage || 45}W</TableCell>
              <TableCell className="text-xs text-slate-400">{formatDate(sl.last_inspection_date || '')}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Register Streetlight Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Streetlight Pole"
        size="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Streetlight Asset Name *"
            required
            placeholder="e.g. Jayanagar 5th Block - Pole 12"
            value={newSL.name}
            onChange={(e) => setNewSL({ ...newSL, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Locality / Landmark *"
              required
              placeholder="e.g. 5th Block Main Road"
              value={newSL.locality}
              onChange={(e) => setNewSL({ ...newSL, locality: e.target.value })}
            />
            <Select
              label="Ward *"
              value={newSL.ward_id}
              onChange={(e) => setNewSL({ ...newSL, ward_id: e.target.value })}
              options={[
                { value: 'ward-001', label: 'Ward 174 - Jayanagar' },
                { value: 'ward-002', label: 'Ward 177 - BTM Layout' },
                { value: 'ward-003', label: 'Ward 151 - Koramangala' },
                { value: 'ward-004', label: 'Ward 81 - Indiranagar' },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Lamp Technology *"
              value={newSL.lamp_type}
              onChange={(e) => setNewSL({ ...newSL, lamp_type: e.target.value })}
              options={[
                { value: 'LED', label: 'LED (Energy Saver)' },
                { value: 'CFL', label: 'CFL' },
                { value: 'Sodium Vapour', label: 'High Pressure Sodium' },
              ]}
            />
            <Input
              label="Wattage (W) *"
              type="number"
              required
              value={newSL.wattage}
              onChange={(e) => setNewSL({ ...newSL, wattage: Number(e.target.value) })}
            />
            <Select
              label="Pole Type *"
              value={newSL.pole_type}
              onChange={(e) => setNewSL({ ...newSL, pole_type: e.target.value })}
              options={[
                { value: 'GI Pipe', label: 'Galvanized Iron (GI)' },
                { value: 'Steel Tubular', label: 'Steel Tubular' },
                { value: 'RCC', label: 'Reinforced Concrete (RCC)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude *"
              type="number"
              step="0.0001"
              required
              value={newSL.latitude}
              onChange={(e) => setNewSL({ ...newSL, latitude: Number(e.target.value) })}
            />
            <Input
              label="Longitude *"
              type="number"
              step="0.0001"
              required
              value={newSL.longitude}
              onChange={(e) => setNewSL({ ...newSL, longitude: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
