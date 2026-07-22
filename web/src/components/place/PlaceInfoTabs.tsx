'use client';

import React from 'react';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';

export interface PlaceInfoTabsProps {
  attributes?: Record<string, any>;
  areaSqKm?: number;
  statistics?: any;
}

export const PlaceInfoTabs: React.FC<PlaceInfoTabsProps> = ({ attributes = {}, areaSqKm, statistics }) => {
  const tabs: TabItem[] = [];

  // Geography Tab
  if (areaSqKm || attributes.elevation || attributes.coordinates || attributes.boundary) {
    tabs.push({
      id: 'geography',
      label: 'Geography',
      content: (
        <Card glass className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areaSqKm && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Area</span>
              <p className="text-lg font-bold text-slate-100">{areaSqKm.toLocaleString()} sq km</p>
            </div>
          )}
          {attributes.elevation && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Elevation</span>
              <p className="text-lg font-bold text-slate-100">{attributes.elevation} m</p>
            </div>
          )}
          {attributes.climate && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Climate Zone</span>
              <p className="text-lg font-bold text-slate-100">{attributes.climate}</p>
            </div>
          )}
        </Card>
      ),
    });
  }

  // Demographics Tab
  if (attributes.population || attributes.density || attributes.literacy_rate) {
    tabs.push({
      id: 'demographics',
      label: 'Demographics',
      content: (
        <Card glass className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.population && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Population</span>
              <p className="text-lg font-bold text-slate-100">
                {Number(attributes.population).toLocaleString()}
              </p>
            </div>
          )}
          {attributes.density && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Population Density</span>
              <p className="text-lg font-bold text-slate-100">{attributes.density} / sq km</p>
            </div>
          )}
          {attributes.literacy_rate && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Literacy Rate</span>
              <p className="text-lg font-bold text-slate-100">{attributes.literacy_rate}%</p>
            </div>
          )}
        </Card>
      ),
    });
  }

  // Economy Tab
  if (attributes.gdp || attributes.gdp_usd || attributes.currency || attributes.industries) {
    tabs.push({
      id: 'economy',
      label: 'Economy',
      content: (
        <Card glass className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(attributes.gdp || attributes.gdp_usd) && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Gross Domestic Product (GDP)</span>
              <p className="text-lg font-bold text-slate-100">
                ${Number(attributes.gdp || attributes.gdp_usd).toLocaleString()} USD
              </p>
            </div>
          )}
          {attributes.currency && (
            <div>
              <span className="text-xs text-slate-400 font-medium">Currency</span>
              <p className="text-lg font-bold text-slate-100">{attributes.currency}</p>
            </div>
          )}
        </Card>
      ),
    });
  }

  // Infrastructure / Overview (Default Fallback if attributes exist)
  if (Object.keys(attributes).length > 0 && tabs.length === 0) {
    tabs.push({
      id: 'attributes',
      label: 'Attributes & Metadata',
      content: (
        <Card glass className="space-y-2">
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950 p-4 rounded-xl">
            {JSON.stringify(attributes, null, 2)}
          </pre>
        </Card>
      ),
    });
  }

  if (tabs.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm border border-slate-800/80 rounded-2xl">
        No detailed tabular attributes recorded for this location yet.
      </div>
    );
  }

  return <Tabs tabs={tabs} />;
};
