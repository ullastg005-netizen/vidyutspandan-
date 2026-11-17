import React, { useState } from 'react';
import {
  Zap, Plus, Search, AlertTriangle, CheckCircle,
  Activity, ShieldAlert
} from 'lucide-react';
import {
  Card, StatCard, Badge, Button, Table, TableRow, TableCell,
  Input, Select, Modal, DemoBanner
} from '../../components/ui';
import { DEMO_TRANSFORMERS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel, formatDate } from '../../utils/helpers';
import type { Transformer } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export function TransformerList() {
  const [transformers, setTransformers] = useState<Transformer[]>(DEMO_TRANSFORMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newTR, setNewTR] = useState({
    name: '',
    locality: '',
    ward_id: 'ward-001',
    capacity_kva: 100,
    voltage_ratio: '11kV/415V',
    make: 'BHEL',
    serial_number: '',
    latitude: 12.9270,
    longitude: 77.5820,
    status: 'working',
  });

  const filtered = transformers.filter((tr) => {
    const matchesSearch =
      tr.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.locality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Transformer = {
      id: `tr-${Date.now()}`,
      asset_code: `DTR-NEW-${Math.floor(100 + Math.random() * 900)}`,
      type: 'transformer',
      name: newTR.name,
      locality: newTR.locality,
      ward_id: newTR.ward_id,
      zone_id: 'zone-001',
      capacity_kva: Number(newTR.capacity_kva),
      voltage_ratio: newTR.voltage_ratio,
      make: newTR.make,
      serial_number: newTR.serial_number || `SER-${Math.floor(1000 + Math.random() * 9000)}`,
      latitude: Number(newTR.latitude),
      longitude: Number(newTR.longitude),
      status: newTR.status as any,
      installation_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTransformers([created, ...transformers]);
    setAddModalOpen(false);
    toast.success(`Transformer ${created.asset_code} registered in system!`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Distribution Transformers (DTR)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            11kV/415V step-down transformer fleet monitoring, capacity in kVA, and oil level records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Register Transformer
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total DTRs"
          value={transformers.length}
          icon={<Zap className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="Distribution sub-stations"
        />
        <StatCard
          label="Healthy / Active"
          value={transformers.filter(t => t.status === 'working').length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="Nominal temperature & load"
        />
        <StatCard
          label="Faults / Overload"
          value={transformers.filter(t => t.status === 'faulty').length}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          subtitle="Inspection ordered"
        />
        <StatCard
          label="Scheduled Overhaul"
          value={transformers.filter(t => t.status === 'under_maintenance').length}
          icon={<Activity className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle="Preventive oil testing"
        />
      </div>

      {/* Search and Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55] flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] max-w-sm">
            <Input
              placeholder="Search DTR Code, location, make..."
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
                { value: 'all', label: 'All Equipment Statuses' },
                { value: 'working', label: 'Healthy / Working' },
                { value: 'faulty', label: 'Fault Reported' },
                { value: 'under_maintenance', label: 'Under Maintenance' },
              ]}
            />
          </div>
        </div>

        <Table headers={['DTR Code', 'Sub-Station / Name', 'Locality', 'Capacity', 'Make / Ratio', 'Status', 'Last Inspection']}>
          {filtered.map((tr) => (
            <TableRow key={tr.id}>
              <TableCell className="font-mono text-amber-400 text-xs font-semibold">{tr.asset_code}</TableCell>
              <TableCell className="text-xs font-medium text-white">{tr.name}</TableCell>
              <TableCell className="text-xs text-slate-400">{tr.locality}</TableCell>
              <TableCell className="text-xs font-bold text-cyan-400">{tr.capacity_kva} kVA</TableCell>
              <TableCell className="text-xs text-slate-300">
                {tr.make || 'BHEL'} • {tr.voltage_ratio || '11kV/415V'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(tr.status)}>
                  {getStatusLabel(tr.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-400">{formatDate(tr.last_inspection_date || '')}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Register Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Distribution Transformer (DTR)"
        size="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Transformer Name / ID *"
            required
            placeholder="e.g. Jayanagar DTR-4"
            value={newTR.name}
            onChange={(e) => setNewTR({ ...newTR, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Locality / Landmark *"
              required
              placeholder="e.g. Near 9th Block Bus Terminal"
              value={newTR.locality}
              onChange={(e) => setNewTR({ ...newTR, locality: e.target.value })}
            />
            <Select
              label="Capacity (kVA) *"
              value={String(newTR.capacity_kva)}
              onChange={(e) => setNewTR({ ...newTR, capacity_kva: Number(e.target.value) })}
              options={[
                { value: '63', label: '63 kVA' },
                { value: '100', label: '100 kVA (Standard Distribution)' },
                { value: '200', label: '200 kVA' },
                { value: '315', label: '315 kVA (Commercial)' },
                { value: '500', label: '500 kVA (High Density)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Manufacturer / Make *"
              required
              placeholder="e.g. BHEL, Kirloskar, ABB"
              value={newTR.make}
              onChange={(e) => setNewTR({ ...newTR, make: e.target.value })}
            />
            <Input
              label="Serial Number"
              placeholder="e.g. BHEL-2023-8902"
              value={newTR.serial_number}
              onChange={(e) => setNewTR({ ...newTR, serial_number: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude *"
              type="number"
              step="0.0001"
              required
              value={newTR.latitude}
              onChange={(e) => setNewTR({ ...newTR, latitude: Number(e.target.value) })}
            />
            <Input
              label="Longitude *"
              type="number"
              step="0.0001"
              required
              value={newTR.longitude}
              onChange={(e) => setNewTR({ ...newTR, longitude: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Transformer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
