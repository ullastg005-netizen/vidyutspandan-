import React, { useState } from 'react';
import {
  FileText, CheckCircle2, AlertTriangle, Camera, Upload,
  MapPin, Clock, ArrowRight, ShieldCheck, Check
} from 'lucide-react';
import { Card, Badge, Button, DemoBanner, Modal, TextArea, Input } from '../../components/ui';
import { DEMO_WORK_ORDERS } from '../../utils/demoData';
import { getStatusColor, getStatusLabel, getPriorityColor, formatDate } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export function WorkerDashboard() {
  const [tasks, setTasks] = useState(
    DEMO_WORK_ORDERS.filter(w => w.assigned_worker_id === 'worker-001')
  );
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [submitReportModalOpen, setSubmitReportModalOpen] = useState(false);

  // Form state for task completion
  const [report, setReport] = useState({
    findings: '',
    actions_taken: '',
    parts_replaced: '',
    time_spent: '2.5',
    evidence_notes: '',
  });

  const handleUpdateStatus = (taskId: string, newStatus: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus as any } : t))
    );
    toast.success(`Task status updated to: ${getStatusLabel(newStatus)}`);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === selectedTask.id
          ? { ...t, status: 'awaiting_verification' as any }
          : t
      )
    );
    setSubmitReportModalOpen(false);
    toast.success('Inspection report and evidence submitted for supervisor approval!');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="font-bold text-emerald-400">SB</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Suresh Babu</h1>
                <Badge className="text-emerald-400 bg-emerald-400/10 border-emerald-400/30">
                  Senior Lineman • Crew #1
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Emp ID: BESCOM-WRK-001 • Jurisdiction: South Zone (Jayanagar / BTM)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-[#0a0f1e] px-3 py-2 rounded border border-[#1e2d55]">
              <span className="text-slate-400 block text-[10px]">Today's Assigned</span>
              <span className="text-base font-bold text-amber-400">{tasks.length} tasks</span>
            </div>
            <div className="bg-[#0a0f1e] px-3 py-2 rounded border border-[#1e2d55]">
              <span className="text-slate-400 block text-[10px]">Completed Today</span>
              <span className="text-base font-bold text-emerald-400">1 task</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Tasks Grid */}
      <div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
          Assigned Work Orders Queue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-[#1e2d55] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{task.work_order_code}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{task.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{task.fault_description}</p>

                <div className="bg-[#0a0f1e] p-2.5 rounded text-xs space-y-1.5 mb-4 border border-[#1e2d55]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{task.location_address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Due Date: {formatDate(task.due_date || '')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on state */}
              <div className="border-t border-[#1e2d55] pt-3 flex flex-wrap items-center justify-between gap-2">
                {task.status === 'assigned' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                  >
                    Accept & Start Work
                  </Button>
                )}

                {task.status === 'in_progress' && (
                  <div className="flex items-center gap-2 w-full">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      icon={<Camera className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedTask(task);
                        setSubmitReportModalOpen(true);
                      }}
                    >
                      Submit Report & Evidence
                    </Button>
                  </div>
                )}

                {task.status === 'awaiting_verification' && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Supervisor Review</span>
                  </div>
                )}

                {task.status === 'completed' && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified & Completed</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Submit Report & Photographic Evidence Modal */}
      <Modal
        open={submitReportModalOpen}
        onClose={() => setSubmitReportModalOpen(false)}
        title={`Work Completion & Evidence: ${selectedTask?.work_order_code}`}
        size="lg"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <p className="text-xs text-slate-400">
            Submit your technical findings, repair actions taken, and attach photographic proof of completed repair work.
          </p>

          <TextArea
            label="Field Inspection Findings *"
            required
            rows={2}
            placeholder="e.g. Burned LED choke ballast identified; pole terminal loose."
            value={report.findings}
            onChange={(e) => setReport({ ...report, findings: e.target.value })}
          />

          <TextArea
            label="Repair Actions Taken *"
            required
            rows={2}
            placeholder="e.g. Replaced 45W LED fixture, re-insulated junction terminal, verified illumination."
            value={report.actions_taken}
            onChange={(e) => setReport({ ...report, actions_taken: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Parts Replaced (if any)"
              placeholder="e.g. 1x LED Luminaire 45W"
              value={report.parts_replaced}
              onChange={(e) => setReport({ ...report, parts_replaced: e.target.value })}
            />
            <Input
              label="Time Spent (Hours) *"
              type="number"
              step="0.5"
              required
              value={report.time_spent}
              onChange={(e) => setReport({ ...report, time_spent: e.target.value })}
            />
          </div>

          {/* Photographic Evidence Attachment */}
          <div className="border border-dashed border-[#1e2d55] bg-[#0a0f1e] rounded-lg p-4 text-center">
            <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-slate-300">Photographic Evidence</p>
            <p className="text-[11px] text-slate-500 mb-3">Upload photo of repaired asset showing clear illuminated pole / intact terminal</p>
            <div className="inline-flex items-center gap-2 bg-[#111d35] px-3 py-1.5 rounded border border-[#1e2d55] text-xs text-slate-300">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>photo_repair_jayanagar_pole2.jpg</span>
              <span className="text-[10px] text-emerald-400 font-bold">✓ Attached</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setSubmitReportModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<ShieldCheck className="w-4 h-4" />}>
              Submit to Supervisor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
