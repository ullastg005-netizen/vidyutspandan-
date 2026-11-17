import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Plus, AlertCircle, CheckCircle, Clock,
  MapPin, UserCheck, Shield, ChevronRight
} from 'lucide-react';
import { StatCard, Card, Badge, Button, DemoBanner, Table, TableRow, TableCell, Modal, Input, TextArea, Select } from '../../components/ui';
import {
  DEMO_WORK_ORDERS, DEMO_FAULT_REPORTS, DEMO_STREETLIGHTS,
  DEMO_TRANSFORMERS
} from '../../utils/demoData';
import { getStatusColor, getStatusLabel, getPriorityColor, formatDate } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export function OfficerDashboard() {
  const [workOrders, setWorkOrders] = useState(DEMO_WORK_ORDERS);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: '',
    fault_description: '',
    location_address: '',
    asset_type: 'streetlight',
    priority: 'high',
    assigned_worker_id: 'worker-001',
    due_date: '2024-11-20',
  });

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `wo-${Date.now()}`,
      work_order_code: `WO-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newOrder.title,
      fault_description: newOrder.fault_description,
      location_address: newOrder.location_address,
      priority: newOrder.priority,
      status: 'assigned',
      created_by: 'officer-001',
      assigned_worker_id: newOrder.assigned_worker_id,
      due_date: newOrder.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setWorkOrders([created, ...workOrders]);
    setCreateModalOpen(false);
    toast.success(`Work Order ${created.work_order_code} dispatched to Lineman!`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Department Sub-Division Operations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Area: South Sub-Division (Jayanagar, BTM, Koramangala) • Manage faults, dispatch orders & supervise crews.
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
          <Link to="/map">
            <Button variant="outline" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
              Area GIS Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Open Faults"
          value={DEMO_FAULT_REPORTS.length}
          icon={<AlertCircle className="w-5 h-5" />}
          color="text-red-400"
          subtitle="Citizen & patrol reports"
        />
        <StatCard
          label="Active Work Orders"
          value={workOrders.filter(w => w.status === 'in_progress' || w.status === 'assigned').length}
          icon={<Clock className="w-5 h-5" />}
          color="text-amber-400"
          subtitle="Currently with field crews"
        />
        <StatCard
          label="Awaiting Verification"
          value={workOrders.filter(w => w.status === 'awaiting_verification').length}
          icon={<UserCheck className="w-5 h-5" />}
          color="text-cyan-400"
          subtitle="Ready for supervisor sign-off"
        />
        <StatCard
          label="Completed This Month"
          value={28}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-400"
          subtitle="Average turnaround 3.4 hrs"
        />
      </div>

      {/* Active Work Orders Table */}
      <Card
        title="Field Maintenance Dispatches"
        subtitle="Manage and track work order allocation to linemen"
      >
        <Table headers={['Order ID', 'Asset / Task', 'Priority', 'Assigned Lineman', 'Status', 'Due Date', 'Action']}>
          {workOrders.map((wo) => (
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
              <TableCell className="text-xs text-slate-300">
                Suresh Babu (Lineman #1)
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(wo.status)}>
                  {getStatusLabel(wo.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">{formatDate(wo.due_date || '')}</TableCell>
              <TableCell>
                <Link to={`/work-orders?id=${wo.id}`}>
                  <button className="text-amber-400 hover:text-amber-300 text-xs font-medium">
                    Details →
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Incoming Citizen & Patrol Fault Reports */}
      <Card
        title="Incoming Unassigned Fault Reports"
        subtitle="Grievances reported via Citizen Portal and Line Patrol"
      >
        <Table headers={['Report Code', 'Reporter', 'Location', 'Severity', 'Description', 'Action']}>
          {DEMO_FAULT_REPORTS.map((fr) => (
            <TableRow key={fr.id}>
              <TableCell className="font-mono text-amber-400 text-xs">{fr.report_code}</TableCell>
              <TableCell className="text-xs text-slate-300">{fr.reporter_name}</TableCell>
              <TableCell className="text-xs text-slate-400">{fr.location_address}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(fr.severity)}>
                  {fr.severity.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-300 max-w-xs truncate">{fr.description}</TableCell>
              <TableCell>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setNewOrder({
                      ...newOrder,
                      title: `Repair for ${fr.report_code}: ${fr.description.slice(0, 30)}...`,
                      location_address: fr.location_address,
                      fault_description: fr.description,
                      priority: fr.severity as any,
                    });
                    setCreateModalOpen(true);
                  }}
                >
                  Dispatch
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Create Work Order Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create & Dispatch Work Order"
        size="lg"
      >
        <form onSubmit={handleCreateWorkOrder} className="space-y-4">
          <Input
            label="Work Order Title *"
            required
            placeholder="e.g. Streetlight repair at Jayanagar 4th Block"
            value={newOrder.title}
            onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Asset Classification *"
              value={newOrder.asset_type}
              onChange={(e) => setNewOrder({ ...newOrder, asset_type: e.target.value })}
              options={[
                { value: 'streetlight', label: 'Streetlight System' },
                { value: 'transformer', label: 'Distribution Transformer (DTR)' },
                { value: 'feeder', label: '11kV Feeder Line' },
              ]}
            />
            <Select
              label="Priority Level *"
              value={newOrder.priority}
              onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
              options={[
                { value: 'critical', label: 'Critical (Safety / Outage Hazard)' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low (Scheduled Maintenance)' },
              ]}
            />
          </div>

          <Input
            label="Location Address *"
            required
            placeholder="e.g. Near 4th Cross, Opp Post Office, Jayanagar"
            value={newOrder.location_address}
            onChange={(e) => setNewOrder({ ...newOrder, location_address: e.target.value })}
          />

          <TextArea
            label="Fault Description & Technical Notes *"
            required
            rows={3}
            placeholder="Describe technical faults observed, components needed, safety instructions..."
            value={newOrder.fault_description}
            onChange={(e) => setNewOrder({ ...newOrder, fault_description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assign Field Lineman *"
              value={newOrder.assigned_worker_id}
              onChange={(e) => setNewOrder({ ...newOrder, assigned_worker_id: e.target.value })}
              options={[
                { value: 'worker-001', label: 'Suresh Babu (South Crew #1)' },
                { value: 'worker-002', label: 'Manjunath Gowda (South Crew #2)' },
                { value: 'worker-003', label: 'Kiran Kumar (Emergency Response)' },
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
              Dispatch to Lineman
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
