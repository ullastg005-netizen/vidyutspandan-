import React, { useState } from 'react';
import {
  Activity, Plus, Search, AlertTriangle, CheckCircle,
  Zap, Clock
} from 'lucide-react';
import {
  Card, StatCard, Badge, Button, Table, TableRow, TableCell,
  Input, Select, Modal, DemoBanner
} from '../../components/ui';
import { DEMO_FEEDERS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import type { Feeder } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export function FeederList() {
  const [feeders, setFeeders] = useState<Feeder[]>(DEMO_FEEDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newFDR, setNewFDR] = useState({
    feeder_name: '',
    substation_name: '',
    voltage_class: '11kV',
    service_area: '',
    zone_id: 'zone-001',
    circuit_length_km: 10.5,
    peak_load_mw: 4.5,
  });

  const filtered = feeders.filter((f) => {
    return (
      f.feeder_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.feeder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.service_area && f.service_area.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Feeder = {
      id: `fdr-${Date.now()}`,
      feeder_code: `FDR-SZ-${Math.floor(100 + Math.random() * 900)}`,
      feeder_name: newFDR.feeder_name,
      substation_name: newFDR.substation_name,
      voltage_class: newFDR.voltage_class,
      service_area: newFDR.service_area,
      zone_id: newFDR.zone_id,
      status: 'operational',
      circuit_length_km: Number(newFDR.circuit_length_km),
      peak_load_mw: Number(newFDR.peak_load_mw),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFeeders([created, ...feeders]);
    setAddModalOpen(false);
    toast.success(`Feeder Line ${created.feeder_code} added to network!`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">11kV Feeder Network Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Substation 11kV distribution circuits, line length, peak load telemetry & service area coverage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Feeder Line
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Feeders"
          value={feeders.length}
          icon={<Activity className="w-5 h-5" />}
          color="text-indigo-400"
          subtitle="Primary distribution lines"
        />
        <StatCard
          label="Operational"
          value={feeders.filter(f => f.status === 'operational').length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="Supplying load"
        />
        <StatCard
          label="Tripped / Faulty"
          value={feeders.filter(f => f.status === 'faulty').length}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          subtitle="Outage crew assigned"
        />
        <StatCard
          label="Total Circuit km"
          value={`${feeders.reduce((acc, f) => acc + (f.circuit_length_km || 0), 0).toFixed(1)} km`}
          icon={<Zap className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="11kV line coverage"
        />
      </div>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55]">
          <div className="max-w-sm">
            <Input
              placeholder="Search Feeder, Substation, Service Area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <Table headers={['Feeder Code', 'Feeder Name', 'Substation', 'Voltage', 'Service Area', 'Length (km)', 'Peak Load', 'Status']}>
          {filtered.map((fdr) => (
            <TableRow key={fdr.id}>
              <TableCell className="font-mono text-cyan-400 text-xs font-semibold">{fdr.feeder_code}</TableCell>
              <TableCell className="text-xs font-medium text-white">{fdr.feeder_name}</TableCell>
              <TableCell className="text-xs text-slate-300">{fdr.substation_name}</TableCell>
              <TableCell className="text-xs font-bold text-amber-400">{fdr.voltage_class}</TableCell>
              <TableCell className="text-xs text-slate-400 max-w-xs truncate">{fdr.service_area}</TableCell>
              <TableCell className="text-xs text-slate-300">{fdr.circuit_length_km} km</TableCell>
              <TableCell className="text-xs text-cyan-400 font-semibold">{fdr.peak_load_mw} MW</TableCell>
              <TableCell>
                <Badge className={getStatusColor(fdr.status)}>
                  {getStatusLabel(fdr.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add 11kV Distribution Feeder"
        size="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Feeder Name *"
            required
            placeholder="e.g. South Zone Feeder 3"
            value={newFDR.feeder_name}
            onChange={(e) => setNewFDR({ ...newFDR, feeder_name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Associated Substation *"
              required
              placeholder="e.g. Jayanagar 220kV Substation"
              value={newFDR.substation_name}
              onChange={(e) => setNewFDR({ ...newFDR, substation_name: e.target.value })}
            />
            <Select
              label="Voltage Class *"
              value={newFDR.voltage_class}
              onChange={(e) => setNewFDR({ ...newFDR, voltage_class: e.target.value })}
              options={[
                { value: '11kV', label: '11 kV (Standard)' },
                { value: '33kV', label: '33 kV' },
                { value: '66kV', label: '66 kV Sub-Transmission' },
              ]}
            />
          </div>

          <Input
            label="Service Localities / Area *"
            required
            placeholder="e.g. Jayanagar 4th to 9th Blocks, Madhavan Park"
            value={newFDR.service_area}
            onChange={(e) => setNewFDR({ ...newFDR, service_area: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Circuit Length (km) *"
              type="number"
              step="0.1"
              required
              value={newFDR.circuit_length_km}
              onChange={(e) => setNewFDR({ ...newFDR, circuit_length_km: Number(e.target.value) })}
            />
            <Input
              label="Peak Load (MW) *"
              type="number"
              step="0.1"
              required
              value={newFDR.peak_load_mw}
              onChange={(e) => setNewFDR({ ...newFDR, peak_load_mw: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Feeder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
