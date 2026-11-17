import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Lightbulb, MapPin, ShieldCheck, CheckCircle2,
  AlertTriangle, Phone, FileText, ArrowRight, Activity,
  Clock, CheckSquare, Search, Send
} from 'lucide-react';
import { GISMap } from '../../components/maps/GISMap';
import { DEMO_STREETLIGHTS, DEMO_TRANSFORMERS, DEMO_PUBLIC_REQUESTS } from '../../utils/demoData';
import { Button, Input, TextArea, Select, Badge, Card } from '../../components/ui';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

export function HomePage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<any>(null);
  const [trackingError, setTrackingError] = useState('');

  // Complaint Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    issue_type: 'streetlight_fault',
    ward_id: 'ward-001',
    address: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedRequest(null);

    const found = DEMO_PUBLIC_REQUESTS.find(
      r => r.tracking_id.toUpperCase() === trackingId.trim().toUpperCase()
    );

    if (found) {
      setTrackedRequest(found);
    } else {
      setTrackingError('No complaint found with this Reference ID. Please check the ID and try again.');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const generatedId = `VS2024${Math.floor(100000 + Math.random() * 900000)}`;
      setNewTrackingId(generatedId);
      setSubmitting(false);
      toast.success('Your grievance has been submitted successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200">
      <Toaster position="top-right" />

      {/* Top Government Strip */}
      <div className="bg-[#060b14] border-b border-[#1e2d55] px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Government of Karnataka</span>
            <span>•</span>
            <span>Bangalore Electricity Supply Company Limited (BESCOM)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Helpline: <strong>1912</strong> (Toll Free)</span>
            <span className="hidden sm:inline">Emergency: <strong>112</strong></span>
          </div>
        </div>
      </div>

      {/* Main Public Navigation */}
      <nav className="bg-[#0d1526]/90 backdrop-blur-md border-b border-[#1e2d55] sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Vidyut Spandan Logo" 
              className="w-10 h-10 rounded-lg object-contain bg-amber-500/10 border border-amber-500/30 p-0.5" 
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-wide">VIDYUT SPANDAN</span>
                <span className="text-xs text-amber-400 font-medium">ವಿದ್ಯುತ್ ಸ್ಪಂದನ</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Unified Distribution Infrastructure Operations & Maintenance Coordination Platform
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#infrastructure" className="hover:text-amber-400 transition-colors">Infrastructure</a>
            <a href="#gis-map" className="hover:text-amber-400 transition-colors">GIS Map</a>
            <a href="#report" className="hover:text-amber-400 transition-colors">Report Issue</a>
            <a href="#track" className="hover:text-amber-400 transition-colors">Track Status</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="primary" size="sm">
                Department Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden border-b border-[#1e2d55]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs mb-6">
            <Activity className="w-3.5 h-3.5" />
            <span>BESCOM Distribution Operations & Maintenance Coordination</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight">
            Digital Transformation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400">
              BESCOM Electricity Distribution
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Integrated operations and maintenance coordination platform combining GIS-enabled asset tracking,
            smart streetlight management, automated work orders, and responsive citizen grievance redressal across Bengaluru.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#report">
              <Button variant="primary" size="lg" icon={<AlertTriangle className="w-4 h-4" />}>
                Report Electricity Fault
              </Button>
            </a>
            <a href="#track">
              <Button variant="outline" size="lg" icon={<Search className="w-4 h-4" />}>
                Track Complaint
              </Button>
            </a>
            <Link to="/login">
              <Button variant="secondary" size="lg" icon={<ShieldCheck className="w-4 h-4" />}>
                Department Operations Portal
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="bg-[#111d35]/60 border border-[#1e2d55] rounded-lg p-4">
              <p className="text-2xl font-bold text-cyan-400">198</p>
              <p className="text-xs text-slate-400 mt-1">BBMP Wards Covered</p>
            </div>
            <div className="bg-[#111d35]/60 border border-[#1e2d55] rounded-lg p-4">
              <p className="text-2xl font-bold text-amber-400">3.2L+</p>
              <p className="text-xs text-slate-400 mt-1">Streetlights Managed</p>
            </div>
            <div className="bg-[#111d35]/60 border border-[#1e2d55] rounded-lg p-4">
              <p className="text-2xl font-bold text-emerald-400">94.8%</p>
              <p className="text-xs text-slate-400 mt-1">Average Uptime</p>
            </div>
            <div className="bg-[#111d35]/60 border border-[#1e2d55] rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">&lt; 4 hrs</p>
              <p className="text-xs text-slate-400 mt-1">Fault Redressal Target</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bengaluru Electricity Infrastructure Overview */}
      <section id="infrastructure" className="py-16 px-4 border-b border-[#1e2d55] bg-[#0d1526]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Distribution Infrastructure Coverage
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Unified digital registry connecting distribution transformers, feeders, and streetlights with field maintenance crews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Streetlight Management</h3>
              <p className="text-sm text-slate-400 mb-4">
                Individual pole-level asset tagging, operational status tracking, scheduled preventive maintenance, and citizen fault alerts.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unique Digital Streetlight ID
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ward-Wise Health Statistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Repair Work Orders
                </li>
              </ul>
            </div>

            <div className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Distribution Transformers (DTR)</h3>
              <p className="text-sm text-slate-400 mb-4">
                Substation-to-feeder-to-DTR hierarchy mapping, capacity monitoring in kVA, maintenance history, and equipment condition logs.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 11kV/415V DTR Mapping
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Oil Level & Condition Records
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Feeder Association Tracking
                </li>
              </ul>
            </div>

            <div className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">11kV Feeder Network</h3>
              <p className="text-sm text-slate-400 mb-4">
                Substation feeder tracking, service area zoning, circuit length analysis, peak load recording, and coordinated outages.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Substation Interconnection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Area-Wise Outage Coordination
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Preventive Line Maintenance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GIS Infrastructure Map Preview */}
      <section id="gis-map" className="py-16 px-4 border-b border-[#1e2d55]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono mb-2">
                <MapPin className="w-3.5 h-3.5" /> BENGALURU GIS VISUALISATION
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Interactive Infrastructure Map
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Explore demonstration assets across Bengaluru localities. Click any marker to view technical details.
              </p>
            </div>
            <Link to="/map">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Full Screen Control Room Map
              </Button>
            </Link>
          </div>

          <GISMap
            streetlights={DEMO_STREETLIGHTS}
            transformers={DEMO_TRANSFORMERS}
            height="550px"
          />
        </div>
      </section>

      {/* Citizen Grievance Reporting Form */}
      <section id="report" className="py-16 px-4 border-b border-[#1e2d55] bg-[#0d1526]/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono mb-2">
              <FileText className="w-3.5 h-3.5" /> CITIZEN SERVICES
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Report an Electricity Infrastructure Issue
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Submit complaints regarding faulty streetlights, leaning poles, or electrical hazards.
              You will receive an instant Reference Tracking ID.
            </p>
          </div>

          {newTrackingId ? (
            <div className="bg-[#111d35] border border-emerald-500/40 rounded-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Complaint Registered Successfully</h3>
              <p className="text-sm text-slate-400 mb-6">
                Your report has been forwarded to the respective Sub-Division Officer for verification and work-order allocation.
              </p>
              <div className="bg-[#0a0f1e] border border-[#1e2d55] rounded-lg p-4 max-w-sm mx-auto mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Your Reference Tracking ID</p>
                <p className="text-2xl font-mono font-bold text-amber-400">{newTrackingId}</p>
                <p className="text-[11px] text-slate-500 mt-1">Keep this ID handy to track progress</p>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setNewTrackingId('');
                  setFormData({
                    name: '', phone: '', email: '',
                    issue_type: 'streetlight_fault', ward_id: 'ward-001',
                    address: '', description: '',
                  });
                }}
              >
                Submit Another Complaint
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name *"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Mobile Number (for SMS updates) *"
                  required
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address (optional)"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Select
                  label="Type of Issue *"
                  value={formData.issue_type}
                  onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                  options={[
                    { value: 'streetlight_fault', label: 'Streetlight Not Working / Flickering' },
                    { value: 'infrastructure_damage', label: 'Damaged / Leaning Electric Pole' },
                    { value: 'power_outage', label: 'Localized Power Outage' },
                    { value: 'other', label: 'Other Infrastructure Hazard' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Select Ward / Locality *"
                  value={formData.ward_id}
                  onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
                  options={[
                    { value: 'ward-001', label: 'Ward 174 - Jayanagar' },
                    { value: 'ward-002', label: 'Ward 177 - BTM Layout' },
                    { value: 'ward-003', label: 'Ward 151 - Koramangala' },
                    { value: 'ward-004', label: 'Ward 81 - Indiranagar' },
                    { value: 'ward-005', label: 'Ward 56 - Whitefield' },
                    { value: 'ward-006', label: 'Ward 125 - Rajajinagar' },
                    { value: 'ward-007', label: 'Ward 94 - Malleswaram' },
                    { value: 'ward-008', label: 'Ward 6 - Hebbal' },
                  ]}
                />
                <Input
                  label="Street / Landmark Address *"
                  required
                  placeholder="e.g. Near 4th Cross Bus Stop, Opp Post Office"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <TextArea
                label="Detailed Description of the Problem *"
                required
                rows={3}
                placeholder="Describe the issue, pole number if visible, or any safety hazards..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="border-t border-[#1e2d55] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  By submitting, you confirm the grievance details provided are accurate to the best of your knowledge.
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit Grievance
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Citizen Complaint Tracking Section */}
      <section id="track" className="py-16 px-4 border-b border-[#1e2d55]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Track Your Complaint Status
            </h2>
            <p className="text-sm text-slate-400">
              Enter your Vidyut Spandan Reference ID to check real-time resolution progress.
            </p>
            <p className="text-xs text-amber-400/80 mt-1 font-mono">
              Try demo IDs: <strong>VS2024110001</strong> or <strong>VS2024110002</strong> or <strong>VS2024110003</strong>
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto mb-8">
            <Input
              placeholder="e.g. VS2024110001"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="font-mono text-center uppercase tracking-wider"
              required
            />
            <Button type="submit" variant="primary" icon={<Search className="w-4 h-4" />}>
              Track
            </Button>
          </form>

          {trackingError && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-4 text-center text-sm text-red-300">
              {trackingError}
            </div>
          )}

          {trackedRequest && (
            <Card title="Grievance Status Details" className="border-cyan-500/30">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1e2d55]">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Tracking Reference</span>
                    <p className="text-base font-mono font-bold text-amber-400">{trackedRequest.tracking_id}</p>
                  </div>
                  <Badge className={getStatusColor(trackedRequest.status)}>
                    {getStatusLabel(trackedRequest.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-500">Citizen Name</span>
                    <p className="text-slate-200">{trackedRequest.requester_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Contact Number</span>
                    <p className="text-slate-200 font-mono">{trackedRequest.requester_phone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Location</span>
                    <p className="text-slate-200">{trackedRequest.location_address}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Registered On</span>
                    <p className="text-slate-200">{new Date(trackedRequest.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-[#0a0f1e] p-3 rounded border border-[#1e2d55]">
                  <span className="text-xs text-slate-500 block mb-1">Issue Description</span>
                  <p className="text-sm text-slate-300">{trackedRequest.description}</p>
                </div>

                {trackedRequest.resolution_notes && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded">
                    <span className="text-xs text-emerald-400 block font-semibold mb-1">Resolution Update</span>
                    <p className="text-sm text-emerald-200">{trackedRequest.resolution_notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-[#060b14] border-t border-[#1e2d55] py-12 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-sm">VIDYUT SPANDAN</span>
            </div>
            <p className="text-slate-400 mb-3 leading-relaxed">
              Unified Distribution Infrastructure Operations & Maintenance Coordination Platform for Bengaluru.
            </p>
            <p className="text-[11px] text-amber-400/80 font-mono">
              ವಿದ್ಯುತ್ ಸ್ಪಂದನ • Government of Karnataka Utility Operations
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Public Services</h4>
            <ul className="space-y-2">
              <li><a href="#report" className="hover:text-amber-400">Report Streetlight Fault</a></li>
              <li><a href="#report" className="hover:text-amber-400">Report Transformer Issue</a></li>
              <li><a href="#track" className="hover:text-amber-400">Track Complaint Status</a></li>
              <li><a href="#gis-map" className="hover:text-amber-400">Public GIS Infrastructure Map</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Department Access</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-amber-400">System Administrator Portal</Link></li>
              <li><Link to="/login" className="hover:text-amber-400">Department Officer Login</Link></li>
              <li><Link to="/login" className="hover:text-amber-400">Lineman / Field Worker Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-amber-400">Supervisor Verification Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Emergency & Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> BESCOM Helpline: <strong>1912</strong>
              </li>
              <li>Emergency Services: <strong>112</strong></li>
              <li>BESCOM Corporate Office: K.R. Circle, Bengaluru - 560001</li>
              <li className="text-[11px] text-slate-500 pt-2">
                Demonstration prototype developed for Digital Transformation of BESCOM Distribution Operations.
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#1e2d55]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2024 BESCOM • Government of Karnataka. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Prototype Demo Data • Not for Official Government Operations
          </p>
        </div>
      </footer>
    </div>
  );
}
