import React, { useState } from 'react';
import {
  CheckSquare, XCircle, AlertTriangle, Eye, ShieldCheck,
  CheckCircle2, Clock, MapPin, Camera, User
} from 'lucide-react';
import { Card, Badge, Button, DemoBanner, Table, TableRow, TableCell, Modal, TextArea } from '../../components/ui';
import { DEMO_WORK_ORDERS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel, getPriorityColor, formatDate } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export function SupervisorDashboard() {
  const [orders, setOrders] = useState(DEMO_WORK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');

  const pendingVerification = orders.filter(
    (o) => o.status === 'awaiting_verification'
  );

  const handleApprove = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'completed' as any, completed_at: new Date().toISOString() }
          : o
      )
    );
    setVerifyModalOpen(false);
    toast.success('Work verified and marked as Completed! Asset record updated.');
  };

  const handleRequestCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              status: 'correction_required' as any,
              verification_notes: correctionNote,
            }
          : o
      )
    );
    setRejectModalOpen(false);
    toast.error('Correction instructions dispatched back to Lineman.');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Quality Assurance & Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review completed lineman reports, inspect photographic evidence, and approve or order rework.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-cyan-400 bg-cyan-400/10 border-cyan-400/30 px-3 py-1">
            {pendingVerification.length} Pending Sign-Offs
          </Badge>
        </div>
      </div>

      {/* Verification Queue Card */}
      <Card
        title="Submissions Awaiting Supervisor Sign-Off"
        subtitle="Verify inspection findings and attached photo evidence before closing maintenance records"
      >
        {pendingVerification.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="font-medium text-slate-300">All submissions have been verified</p>
            <p className="text-xs text-slate-500 mt-1">No pending work orders awaiting QA approval</p>
          </div>
        ) : (
          <Table headers={['Order Code', 'Asset / Location', 'Lineman', 'Priority', 'Actions Taken', 'Review & Sign-Off']}>
            {pendingVerification.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-cyan-400 text-xs font-semibold">{order.work_order_code}</TableCell>
                <TableCell>
                  <p className="text-xs font-medium text-white">{order.title}</p>
                  <p className="text-[10px] text-slate-500">{order.location_address}</p>
                </TableCell>
                <TableCell className="text-xs text-slate-300">Suresh Babu</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  Replaced bent pole & 100W luminaire. Terminal tested.
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedOrder(order);
                      setVerifyModalOpen(true);
                    }}
                  >
                    Inspect & Sign-Off
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      {/* Inspection & Sign-off Modal */}
      <Modal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title={`Supervisor Inspection: ${selectedOrder?.work_order_code}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-[#0a0f1e] p-3 rounded border border-[#1e2d55]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Work Order Title</span>
                <Badge className={getPriorityColor(selectedOrder.priority)}>
                  {selectedOrder.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-white">{selectedOrder.title}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedOrder.location_address}</p>
            </div>

            {/* Lineman Submission Details */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#0d1526] rounded border border-[#1e2d55]">
                <span className="text-slate-400 block font-semibold mb-1">Lineman Findings:</span>
                <p className="text-slate-200">
                  Pole was bent 30 degrees post vehicular hit. Internal wiring severed. Replaced complete tubular pole section.
                </p>
              </div>

              <div className="p-3 bg-[#0d1526] rounded border border-[#1e2d55]">
                <span className="text-slate-400 block font-semibold mb-1">Parts Replaced:</span>
                <p className="text-slate-200 font-mono">
                  1x 8m Steel Tubular Pole, 1x Junction Box, 1x 100W Sodium Luminaire
                </p>
              </div>
            </div>

            {/* Evidence Image Preview */}
            <div className="border border-[#1e2d55] bg-[#0a0f1e] rounded p-4 text-center">
              <Camera className="w-6 h-6 text-cyan-400 mx-auto mb-1 opacity-80" />
              <p className="text-xs font-semibold text-slate-300">Photographic Evidence Preview</p>
              <p className="text-[10px] text-slate-500 mb-2">Submitted by Suresh Babu (Lineman) on 12/11/2024</p>
              <div className="bg-[#111d35] p-3 rounded border border-[#1e2d55] max-w-xs mx-auto text-xs text-emerald-400 font-medium">
                ✓ Photo verified: Pole aligned, luminaire active, site clear
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => {
                  setVerifyModalOpen(false);
                  setRejectModalOpen(true);
                }}
              >
                Request Correction
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => handleApprove(selectedOrder.id)}
              >
                Approve & Mark Completed
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject / Request Correction Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Provide Correction Instructions"
        size="md"
      >
        <form onSubmit={handleRequestCorrection} className="space-y-4">
          <p className="text-xs text-slate-400">
            Specify what additional work or verification evidence is required from the lineman.
          </p>

          <TextArea
            label="Correction Notes & Instructions *"
            required
            rows={4}
            placeholder="e.g. Ground earthing resistance test reading not submitted. Verify insulation resistance and attach photo..."
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Send Correction Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
