import React, { useState } from 'react';
import {
  FileText, Plus, Search, Filter, Download,
  Clock, CheckCircle2, AlertTriangle, ArrowRight, UserCheck
} from 'lucide-react';
import {
  Card, StatCard, Badge, Button, Table, TableRow, TableCell,
  Input, Select, Modal, DemoBanner, TextArea
} from '../../components/ui';
import { DEMO_WORK_ORDERS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel, getPriorityColor, formatDate } from '../../utils/helpers';
import type { WorkOrder } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(DEMO_WORK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

  const [newOrder, setNewOrder] = useState({
    title: '',
    fault_description: '',
    location_address: '',
    priority: 'high',
    assigned_worker_id: 'worker-001',
    due_date: '2024-11-20',
  });

  const filtered = workOrders.filter((wo) => {
    const matchesSearch =
      wo.work_order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.location_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WorkOrder = {
      id: `wo-${Date.now()}`,
      work_order_code: `WO-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newOrder.title,
      fault_description: newOrder.fault_description,
      location_address: newOrder.location_address,
      priority: newOrder.priority as any,
      status: 'assigned',
      created_by: 'officer-001',
      assigned_worker_id: newOrder.assigned_worker_id,
      due_date: newOrder.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setWorkOrders([created, ...workOrders]);
    setCreateModalOpen(false);
    toast.success(`Work Order ${created.work_order_code} dispatched successfully!`);
  };

  const handleExportCSV = () => {
    const headers = 'Code,Title,Address,Priority,Status,Due Date\n';
    const rows = filtered
      .map(w => `${w.work_order_code},"${w.title}","${w.location_address}",${w.priority},${w.status},${w.due_date || ''}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Work Orders exported to CSV!');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Work Order Coordination System</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full end-to-end maintenance workflow: fault registration → lineman dispatch → inspection report → supervisor QA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Work Order
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
          label="Total Orders"
          value={workOrders.length}
          icon={<FileText className="w-5 h-5" />}
          color="text-indigo-400"
          subtitle="System lifecycle"
        />
        <StatCard
          label="In Progress"
          value={workOrders.filter(w => w.status === 'in_progress').length}
          icon={<Clock className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="Field crew active"
        />
        <StatCard
          label="Awaiting QA"
          value={workOrders.filter(w => w.status === 'awaiting_verification').length}
          icon={<UserCheck className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle="Supervisor review"
        />
        <StatCard
          label="Completed"
          value={workOrders.filter(w => w.status === 'completed').length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="Verified & closed"
        />
      </div>

      {/* Filters and Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55] flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px] max-w-sm">
            <Input
              placeholder="Search by code, title, address..."
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
                { value: 'open', label: 'Open' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'awaiting_verification', label: 'Awaiting Verification' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>
        </div>

        <Table headers={['Order ID', 'Title / Asset', 'Priority', 'Status', 'Assigned Lineman', 'Due Date', 'Action']}>
          {filtered.map((wo) => (
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
              <TableCell className="text-xs text-slate-300">Suresh Babu</TableCell>
              <TableCell className="text-xs text-slate-400">{formatDate(wo.due_date || '')}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedOrder(wo)}
                >
                  View Order
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* View Work Order Modal */}
      {selectedOrder && (
        <Modal
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Work Order: ${selectedOrder.work_order_code}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2d55]">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Priority</span>
                <div className="mt-1">
                  <Badge className={getPriorityColor(selectedOrder.priority)}>
                    {selectedOrder.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Status</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Title</span>
              <p className="text-sm font-semibold text-white">{selectedOrder.title}</p>
            </div>

            <div className="bg-[#0a0f1e] p-3 rounded border border-[#1e2d55]">
              <span className="text-xs text-slate-500 block mb-1">Fault Description</span>
              <p className="text-xs text-slate-300">{selectedOrder.fault_description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Site Location</span>
                <p className="text-slate-200 mt-0.5">{selectedOrder.location_address}</p>
              </div>
              <div>
                <span className="text-slate-500 block">Due Date</span>
                <p className="text-slate-200 mt-0.5">{formatDate(selectedOrder.due_date || '')}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#1e2d55]">
              <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create & Assign Work Order"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Work Order Title *"
            required
            placeholder="e.g. Streetlight luminaire replacement"
            value={newOrder.title}
            onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
          />

          <Input
            label="Location Address *"
            required
            placeholder="e.g. 100 Feet Road, Indiranagar"
            value={newOrder.location_address}
            onChange={(e) => setNewOrder({ ...newOrder, location_address: e.target.value })}
          />

          <TextArea
            label="Fault Description *"
            required
            rows={3}
            placeholder="Technical details of the problem..."
            value={newOrder.fault_description}
            onChange={(e) => setNewOrder({ ...newOrder, fault_description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority *"
              value={newOrder.priority}
              onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
            <Input
              label="Due Date *"
              type="date"
              required
              value={newOrder.due_date}
              onChange={(e) => setNewOrder({ ...newOrder, due_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Work Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
