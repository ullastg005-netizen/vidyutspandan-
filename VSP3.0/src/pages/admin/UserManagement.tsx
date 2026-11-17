import React, { useState } from 'react';
import {
  Users, UserPlus, Search, Shield, CheckCircle2,
  XCircle, Edit2, Lock
} from 'lucide-react';
import {
  Card, StatCard, Badge, Button, Table, TableRow, TableCell,
  Input, Select, Modal, DemoBanner
} from '../../components/ui';
import { getRoleLabel, getRoleBadgeColor, formatDate } from '../../utils/helpers';
import type { User, UserRole } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    email: 'admin@vidyutspandan.gov.in',
    full_name: 'Rajesh Kumar Sharma',
    role: 'admin',
    employee_id: 'BESCOM-ADM-001',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'usr-2',
    email: 'officer@vidyutspandan.gov.in',
    full_name: 'Priya Venkatesh',
    role: 'officer',
    employee_id: 'BESCOM-OFF-001',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'usr-3',
    email: 'worker@vidyutspandan.gov.in',
    full_name: 'Suresh Babu',
    role: 'worker',
    employee_id: 'BESCOM-WRK-001',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'usr-4',
    email: 'supervisor@vidyutspandan.gov.in',
    full_name: 'Anitha Krishnamurthy',
    role: 'supervisor',
    employee_id: 'BESCOM-SUP-001',
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'officer' as UserRole,
    employee_id: '',
    phone: '',
  });

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.employee_id && u.employee_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr-${Date.now()}`,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      employee_id: newUser.employee_id || `BESCOM-${newUser.role.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      phone: newUser.phone,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setUsers([created, ...users]);
    setCreateModalOpen(false);
    toast.success(`User ${created.full_name} account created and role assigned!`);
  };

  const toggleStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
    );
    toast.success('User access status updated.');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">System User Governance & Access Control</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer officer profiles, lineman authorizations, supervisors, and role assignments.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create User Account
        </Button>
      </div>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#1e2d55] flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-sm">
            <Input
              placeholder="Search by name, email, employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Operational Roles' },
              { value: 'admin', label: 'System Administrator' },
              { value: 'officer', label: 'Department Officer' },
              { value: 'worker', label: 'Field Lineman' },
              { value: 'supervisor', label: 'Supervisor' },
            ]}
          />
        </div>

        <Table headers={['Employee ID', 'Full Name & Email', 'Role Assigned', 'Status', 'Registered Date', 'Access Action']}>
          {filtered.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs font-semibold text-cyan-400">
                {user.employee_id || '—'}
              </TableCell>
              <TableCell>
                <p className="text-xs font-semibold text-white">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-400">
                    <XCircle className="w-3.5 h-3.5" /> Deactivated
                  </span>
                )}
              </TableCell>
              <TableCell className="text-xs text-slate-400">{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={user.is_active ? 'outline' : 'secondary'}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Create User Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision New Government User Account"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name *"
            required
            placeholder="e.g. Ramesh Kumar"
            value={newUser.full_name}
            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Official Gov Email *"
              type="email"
              required
              placeholder="name@vidyutspandan.gov.in"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Select
              label="Authorized Role *"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
              options={[
                { value: 'officer', label: 'Department Officer' },
                { value: 'worker', label: 'Field Lineman / Crew' },
                { value: 'supervisor', label: 'Supervisor / QA' },
                { value: 'admin', label: 'System Administrator' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              placeholder="e.g. BESCOM-WRK-042"
              value={newUser.employee_id}
              onChange={(e) => setNewUser({ ...newUser, employee_id: e.target.value })}
            />
            <Input
              label="Official Phone"
              placeholder="+91-80-22222005"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1e2d55]">
            <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
