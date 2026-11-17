import React, { useState } from 'react';
import { AlertCircle, Plus, Search } from 'lucide-react';
import { Card, Table, TableRow, TableCell, Badge, Button, Input, DemoBanner, Modal, Select, TextArea } from '../../components/ui';
import { DEMO_FAULT_REPORTS } from '../../utils/demoData';
import { getPriorityColor, formatDate } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export function OfficerFaults() {
  const [faults, setFaults] = useState(DEMO_FAULT_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedFault, setSelectedFault] = useState<any>(null);

  const filtered = faults.filter(
    (f) =>
      f.report_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFault) return;

    setFaults((prev) =>
      prev.map((f) =>
        f.id === selectedFault.id
          ? { ...f, converted_to_work_order: true, status: 'in_progress' as any }
          : f
      )
    );
    setDispatchModalOpen(false);
    toast.success(`Work Order dispatched for ${selectedFault.report_code}!`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Reported Faults & Grievances</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review reported infrastructure faults and convert them into actionable maintenance work orders.
          </p>
        </div>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55]">
          <div className="max-w-sm">
            <Input
              placeholder="Search by report code, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <Table headers={['Report Code', 'Reporter', 'Location', 'Severity', 'Description', 'Registered Date', 'Work Order Status']}>
          {filtered.map((fault) => (
            <TableRow key={fault.id}>
              <TableCell className="font-mono text-cyan-400 text-xs font-semibold">{fault.report_code}</TableCell>
              <TableCell className="text-xs text-slate-300">{fault.reporter_name}</TableCell>
              <TableCell className="text-xs text-slate-400">{fault.location_address}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(fault.severity)}>
                  {fault.severity.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-300 max-w-xs">{fault.description}</TableCell>
              <TableCell className="text-xs text-slate-400">{formatDate(fault.created_at)}</TableCell>
              <TableCell>
                {fault.converted_to_work_order ? (
                  <span className="text-xs text-emerald-400 font-medium">✓ Order Dispatched</span>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedFault(fault);
                      setDispatchModalOpen(true);
                    }}
                  >
                    Dispatch Order
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Dispatch Modal */}
      <Modal
        open={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title={`Dispatch Work Order for ${selectedFault?.report_code}`}
        size="md"
      >
        <form onSubmit={handleDispatch} className="space-y-4">
          <p className="text-xs text-slate-400">
            Create and allocate a maintenance work order to a field crew for this fault report.
          </p>
          <div className="p-3 bg-[#0a0f1e] rounded border border-[#1e2d55] text-xs">
            <span className="text-slate-500 block mb-1">Issue Description</span>
            <p className="text-slate-200">{selectedFault?.description}</p>
          </div>

          <Select
            label="Assign Field Crew *"
            options={[
              { value: 'worker-001', label: 'Suresh Babu (South Crew #1)' },
              { value: 'worker-002', label: 'Manjunath Gowda (South Crew #2)' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setDispatchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Dispatch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
