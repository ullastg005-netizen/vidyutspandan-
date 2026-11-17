import React, { useState } from 'react';
import {
  Shield, Search, Download, Clock, UserCheck, AlertCircle
} from 'lucide-react';
import { Card, Table, TableRow, TableCell, Input, Select, Button, DemoBanner } from '../../components/ui';
import { formatDateTime } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

interface DemoAuditLog {
  id: string;
  user_email: string;
  role: string;
  action: string;
  entity: string;
  entity_id: string;
  timestamp: string;
  ip_address: string;
  details: string;
}

const DEMO_AUDIT_LOGS: DemoAuditLog[] = [
  {
    id: 'aud-1',
    user_email: 'supervisor@vidyutspandan.gov.in',
    role: 'SUPERVISOR',
    action: 'WORK_ORDER_APPROVED',
    entity: 'WorkOrder',
    entity_id: 'WO-2024-0004',
    timestamp: '2024-11-09T15:30:00Z',
    ip_address: '10.14.82.11',
    details: 'Approved work order completion following photographic verification',
  },
  {
    id: 'aud-2',
    user_email: 'worker@vidyutspandan.gov.in',
    role: 'WORKER',
    action: 'INSPECTION_SUBMITTED',
    entity: 'WorkOrder',
    entity_id: 'WO-2024-0003',
    timestamp: '2024-11-12T16:00:00Z',
    ip_address: '10.14.82.44',
    details: 'Submitted repair findings and attached 1 photograph for verification',
  },
  {
    id: 'aud-3',
    user_email: 'officer@vidyutspandan.gov.in',
    role: 'OFFICER',
    action: 'WORK_ORDER_CREATED',
    entity: 'WorkOrder',
    entity_id: 'WO-2024-0005',
    timestamp: '2024-11-13T10:00:00Z',
    ip_address: '10.14.82.25',
    details: 'Dispatched preventive maintenance order for Whitefield DTR-1',
  },
  {
    id: 'aud-4',
    user_email: 'admin@vidyutspandan.gov.in',
    role: 'ADMIN',
    action: 'USER_ROLE_UPDATED',
    entity: 'User',
    entity_id: 'usr-3',
    timestamp: '2024-11-01T09:15:00Z',
    ip_address: '10.14.80.05',
    details: 'Assigned worker role to Suresh Babu with South Zone jurisdiction',
  },
  {
    id: 'aud-5',
    user_email: 'citizen_api@bescom.gov.in',
    role: 'SYSTEM',
    action: 'PUBLIC_REQUEST_REGISTERED',
    entity: 'PublicRequest',
    entity_id: 'VS2024110001',
    timestamp: '2024-11-05T18:30:00Z',
    ip_address: '103.24.112.9',
    details: 'Citizen grievance registered from Jayanagar 3rd Block',
  },
];

export function AuditLogs() {
  const [logs] = useState<DemoAuditLog[]>(DEMO_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = 'ID,User,Role,Action,Entity,Entity ID,Timestamp,IP Address,Details\n';
    const rows = filtered
      .map(
        (l) =>
          `${l.id},${l.user_email},${l.role},${l.action},${l.entity},${l.entity_id},${l.timestamp},${l.ip_address},"${l.details}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Security audit logs exported to CSV!');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">System Security & Operational Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log recording user authorizations, work order transitions, asset modifications & timestamps.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportCSV}
        >
          Export Audit Trail (CSV)
        </Button>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55]">
          <div className="max-w-sm">
            <Input
              placeholder="Search by action, user email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <Table headers={['Timestamp', 'User & Role', 'Action Executed', 'Target Entity', 'IP Address', 'Operation Summary']}>
          {filtered.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-xs text-slate-400 font-mono">
                {formatDateTime(log.timestamp)}
              </TableCell>
              <TableCell>
                <p className="text-xs font-semibold text-white">{log.user_email}</p>
                <span className="text-[10px] text-cyan-400 font-mono font-medium">{log.role}</span>
              </TableCell>
              <TableCell className="font-mono text-xs font-bold text-amber-400">
                {log.action}
              </TableCell>
              <TableCell className="text-xs text-slate-300 font-mono">
                {log.entity}: {log.entity_id}
              </TableCell>
              <TableCell className="text-xs text-slate-400 font-mono">{log.ip_address}</TableCell>
              <TableCell className="text-xs text-slate-300 max-w-sm">{log.details}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
