import React, { useEffect, useRef, useState } from 'react';
import type { InfrastructureAsset, Streetlight, Transformer, Feeder, WorkOrder } from '../../types';
import { getStatusColor, getStatusLabel, getMarkerColor } from '../../utils/helpers';
import { Badge, Button } from '../ui';
import { MapPin, Zap, Lightbulb, AlertTriangle, Layers, Filter, Eye } from 'lucide-react';

interface GISMapProps {
  streetlights?: Streetlight[];
  transformers?: Transformer[];
  feeders?: Feeder[];
  workOrders?: WorkOrder[];
  selectedAsset?: InfrastructureAsset | null;
  onSelectAsset?: (asset: InfrastructureAsset) => void;
  height?: string;
  showFilters?: boolean;
}

// Bengaluru center coordinates
const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

export function GISMap({
  streetlights = [],
  transformers = [],
  feeders = [],
  workOrders = [],
  selectedAsset,
  onSelectAsset,
  height = '500px',
  showFilters = true,
}: GISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [activeLayer, setActiveLayer] = useState<'all' | 'streetlights' | 'transformers' | 'faults'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [currentAsset, setCurrentAsset] = useState<InfrastructureAsset | null>(selectedAsset || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Dynamically import Leaflet
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon paths in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: BENGALURU_CENTER,
          zoom: 12,
          zoomControl: true,
        });

        // Dark theme map tiles (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      renderMarkers(L);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    import('leaflet').then((L) => {
      renderMarkers(L);
    });
  }, [activeLayer, selectedStatus, selectedZone, streetlights, transformers]);

  const renderMarkers = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const createCustomIcon = (type: string, status: string) => {
      const color = getMarkerColor(status);
      const iconSymbol = type === 'streetlight' ? '💡' : type === 'transformer' ? '⚡' : '📍';

      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: #0d1526;
            border: 2px solid ${color};
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            box-shadow: 0 0 10px ${color}66;
            cursor: pointer;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });
    };

    // Filter streetlights
    if (activeLayer === 'all' || activeLayer === 'streetlights') {
      streetlights.forEach((sl) => {
        if (selectedStatus !== 'all' && sl.status !== selectedStatus) return;
        if (selectedZone !== 'all' && sl.zone_id !== selectedZone) return;

        const icon = createCustomIcon('streetlight', sl.status);
        const marker = L.marker([sl.latitude, sl.longitude], { icon })
          .addTo(map)
          .on('click', () => {
            setCurrentAsset(sl);
            onSelectAsset?.(sl);
          });

        marker.bindPopup(`
          <div style="min-width: 180px; padding: 4px;">
            <p style="font-weight: 600; font-size: 13px; margin: 0 0 4px; color: #f1f5f9;">${sl.name}</p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 2px;">Code: <strong style="color: #38bdf8;">${sl.asset_code}</strong></p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 2px;">Locality: ${sl.locality}</p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px;">Status: <span style="color: ${getMarkerColor(sl.status)}; font-weight: 600;">${getStatusLabel(sl.status)}</span></p>
            <p style="font-size: 10px; color: #64748b; margin: 0;">Type: ${sl.lamp_type || 'LED'} (${sl.wattage || 45}W)</p>
          </div>
        `);
        markersRef.current.push(marker);
      });
    }

    // Filter transformers
    if (activeLayer === 'all' || activeLayer === 'transformers') {
      transformers.forEach((tr) => {
        if (selectedStatus !== 'all' && tr.status !== selectedStatus) return;
        if (selectedZone !== 'all' && tr.zone_id !== selectedZone) return;

        const icon = createCustomIcon('transformer', tr.status);
        const marker = L.marker([tr.latitude, tr.longitude], { icon })
          .addTo(map)
          .on('click', () => {
            setCurrentAsset(tr);
            onSelectAsset?.(tr);
          });

        marker.bindPopup(`
          <div style="min-width: 180px; padding: 4px;">
            <p style="font-weight: 600; font-size: 13px; margin: 0 0 4px; color: #f1f5f9;">${tr.name}</p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 2px;">Code: <strong style="color: #fbbf24;">${tr.asset_code}</strong></p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 2px;">Locality: ${tr.locality}</p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px;">Capacity: <strong style="color: #38bdf8;">${tr.capacity_kva} kVA</strong></p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">Status: <span style="color: ${getMarkerColor(tr.status)}; font-weight: 600;">${getStatusLabel(tr.status)}</span></p>
          </div>
        `);
        markersRef.current.push(marker);
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Map Controls */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111d35] p-3 rounded-lg border border-[#1e2d55]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Layer:
            </span>
            <div className="flex gap-1 bg-[#0a0f1e] p-1 rounded border border-[#1e2d55]">
              {(['all', 'streetlights', 'transformers'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors capitalize ${
                    activeLayer === layer
                      ? 'bg-amber-500 text-navy-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0a0f1e] border border-[#1e2d55] text-xs text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="working">Working</option>
              <option value="faulty">Faulty</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="awaiting_inspection">Awaiting Inspection</option>
            </select>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#0a0f1e] border border-[#1e2d55] text-xs text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Zones</option>
              <option value="zone-001">South Zone</option>
              <option value="zone-002">North Zone</option>
              <option value="zone-003">East Zone</option>
              <option value="zone-004">West Zone</option>
            </select>
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Working
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Faulty
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Maintenance
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Inspection
            </span>
          </div>
        </div>
      )}

      {/* Map Container + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className={`${currentAsset ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <div
            ref={mapContainerRef}
            style={{ height }}
            className="w-full rounded-lg border border-[#1e2d55] overflow-hidden shadow-xl"
          />
        </div>

        {/* Selected Asset Information Panel */}
        {currentAsset && (
          <div className="bg-[#111d35] border border-[#1e2d55] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400">{currentAsset.asset_code}</span>
                <button
                  onClick={() => setCurrentAsset(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              </div>

              <h4 className="text-sm font-semibold text-white mb-2">{currentAsset.name}</h4>

              <div className="mb-3">
                <Badge className={getStatusColor(currentAsset.status)}>
                  {getStatusLabel(currentAsset.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-400 border-t border-[#1e2d55] pt-3">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-slate-200 capitalize">{currentAsset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Locality:</span>
                  <span className="text-slate-200">{currentAsset.locality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="font-mono text-slate-300">
                    {currentAsset.latitude.toFixed(4)}, {currentAsset.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Installed:</span>
                  <span className="text-slate-300">{currentAsset.installation_date || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Inspected:</span>
                  <span className="text-slate-300">{currentAsset.last_inspection_date || '—'}</span>
                </div>
                {'capacity_kva' in currentAsset && (
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="text-amber-400 font-semibold">
                      {(currentAsset as Transformer).capacity_kva} kVA
                    </span>
                  </div>
                )}
                {'wattage' in currentAsset && (
                  <div className="flex justify-between">
                    <span>Wattage:</span>
                    <span className="text-cyan-400 font-semibold">
                      {(currentAsset as Streetlight).wattage} W
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#1e2d55] pt-3 mt-4 flex flex-col gap-2">
              <p className="text-[10px] text-slate-500 text-center">Demonstration Coordinates</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
