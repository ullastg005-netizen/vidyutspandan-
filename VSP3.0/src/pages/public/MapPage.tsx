import React from 'react';
import { GISMap } from '../../components/maps/GISMap';
import { DEMO_STREETLIGHTS, DEMO_TRANSFORMERS, DEMO_FEEDERS, DEMO_WORK_ORDERS } from '../../utils/demoData';
import { DemoBanner } from '../../components/ui';

export function MapPage() {
  return (
    <div className="space-y-4">
      <DemoBanner />
      <div>
        <h1 className="text-xl font-bold text-white">Bengaluru GIS Infrastructure Map</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Unified geographic spatial mapping of streetlights, distribution transformers, 11kV feeders, and work orders.
        </p>
      </div>

      <GISMap
        streetlights={DEMO_STREETLIGHTS}
        transformers={DEMO_TRANSFORMERS}
        feeders={DEMO_FEEDERS}
        workOrders={DEMO_WORK_ORDERS}
        height="78vh"
        showFilters={true}
      />
    </div>
  );
}
