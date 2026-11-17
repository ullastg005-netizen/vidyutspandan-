import type { InfrastructureStatus, WorkOrderStatus, WorkOrderPriority, UserRole } from '../types';

export function getStatusColor(status: InfrastructureStatus | WorkOrderStatus | string): string {
  const colorMap: Record<string, string> = {
    // Infrastructure
    working: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    faulty: 'text-red-400 bg-red-400/10 border-red-400/20',
    damaged: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    under_maintenance: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    awaiting_inspection: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    out_of_service: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    // Work orders
    open: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    assigned: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    accepted: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    in_progress: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    awaiting_verification: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    correction_required: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    cancelled: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    // Public requests
    submitted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    acknowledged: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    closed: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    // Feeders
    operational: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };
  return colorMap[status] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    working: 'Working',
    faulty: 'Faulty',
    damaged: 'Damaged',
    under_maintenance: 'Under Maintenance',
    awaiting_inspection: 'Awaiting Inspection',
    out_of_service: 'Out of Service',
    open: 'Open',
    assigned: 'Assigned',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    awaiting_verification: 'Awaiting Verification',
    correction_required: 'Correction Required',
    completed: 'Completed',
    cancelled: 'Cancelled',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    closed: 'Closed',
    operational: 'Operational',
  };
  return labels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function getPriorityColor(priority: WorkOrderPriority | string): string {
  const colorMap: Record<string, string> = {
    low: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    high: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return colorMap[priority] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'System Administrator',
    officer: 'Department Officer',
    worker: 'Field Worker',
    supervisor: 'Supervisor',
  };
  return labels[role] || role;
}

export function getRoleBadgeColor(role: UserRole): string {
  const colorMap: Record<UserRole, string> = {
    admin: 'text-red-400 bg-red-400/10 border-red-400/20',
    officer: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    worker: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    supervisor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };
  return colorMap[role] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) return formatDate(dateStr);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
}

export function getMarkerColor(status: string): string {
  const colorMap: Record<string, string> = {
    working: '#10b981',
    operational: '#10b981',
    faulty: '#ef4444',
    damaged: '#f97316',
    under_maintenance: '#f59e0b',
    awaiting_inspection: '#06b6d4',
    out_of_service: '#64748b',
  };
  return colorMap[status] || '#64748b';
}
