import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Clock,
  Calendar,
  CheckCircle2,
  Activity,
  Server,
  Code2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  HardDrive,
  Radio,
} from 'lucide-react';
import { ApiSyncRecord } from '../types/weather';
import { formatRelativeTime } from '../services/apiSyncService';

interface ApiSyncHistoryCardProps {
  syncHistory: ApiSyncRecord[];
  onTriggerSync: () => void;
  isSyncing?: boolean;
}

export const ApiSyncHistoryCard: React.FC<ApiSyncHistoryCardProps> = ({
  syncHistory,
  onTriggerSync,
  isSyncing = false,
}) => {
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Periodically refresh relative time display every 15s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const latestSync = syncHistory[0];

  const getTriggerBadge = (trigger: ApiSyncRecord['trigger']) => {
    switch (trigger) {
      case 'Manual Sync':
      case 'Manual Refresh':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'GPS Location':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Location Change':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Scenario Switch':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Initial Load':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div
      id="api-sync-history-card"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shadow-2xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                API Data Sync History
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Last 10 Syncs
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry synchronization logs with Singapore Meteorological &amp; NEA Open Data APIs
            </p>
          </div>
        </div>

        {/* Sync Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="trigger-api-sync-btn"
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              isSyncing
                ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      {latestSync && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Latest Sync</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
              {latestSync.formattedTime}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Sync Date</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {latestSync.formattedDate}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Avg Latency</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5 font-mono">
              {latestSync.durationMs} ms (HTTP 200)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Server className="w-3 h-3 text-blue-500" />
              <span>Protocol / Source</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
              NEA v1 REST API
            </div>
          </div>
        </div>
      )}

      {/* Sync Records List (The last 10 records) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center justify-between px-1">
          <span>Chronological Sync Logs ({syncHistory.length} of 10 records)</span>
          <span className="text-[11px] font-normal text-slate-400">Most recent first</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
          {syncHistory.map((record, index) => {
            const isExpanded = expandedRecordId === record.id;
            const recDate = new Date(record.timestamp);
            const currentRelative = formatRelativeTime(recDate, currentTime);

            return (
              <div
                key={record.id}
                id={`sync-record-${record.id}`}
                className="bg-white transition-colors hover:bg-slate-50/80"
              >
                {/* Main Row */}
                <div
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer"
                  onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                >
                  {/* Left: Index, Status & DateTime */}
                  <div className="flex items-start sm:items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 font-mono flex-shrink-0 mt-0.5 sm:mt-0">
                      {index + 1}
                    </span>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-800 px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200">
                        {record.statusCode} OK
                      </span>
                    </div>

                    <div>
                      {/* Date & Time prominent display */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{record.formattedDate}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-extrabold text-blue-700 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{record.formattedTime}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({currentRelative})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Station: <strong className="text-slate-700">{record.regionName}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-slate-600">{record.durationMs}ms</span>
                        <span>•</span>
                        <span>{record.payloadSizeKb} KB</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Trigger badge & toggle details */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pl-7 sm:pl-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getTriggerBadge(
                        record.trigger
                      )}`}
                    >
                      {record.trigger}
                    </span>

                    <button
                      id={`toggle-sync-detail-${record.id}`}
                      aria-label="Toggle sync details"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Technical Details Panel */}
                {isExpanded && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/90 text-xs space-y-2 animate-fadeIn">
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 overflow-x-auto">
                      <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Code2 className="w-3 h-3" />
                          <span>API Telemetry Inspector</span>
                        </span>
                        <span>Sync ID: {record.id}</span>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-blue-400">ENDPOINT:</span> GET https://{record.endpoint}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-amber-400">SOURCE:</span> {record.source}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-emerald-400">STATUS:</span> HTTP {record.statusCode} OK • {record.durationMs}ms latency • {record.payloadSizeKb} KB payload
                      </div>
                      <div className="text-slate-300">
                        <span className="text-purple-400">PAYLOAD:</span> {record.itemsSynced} sensor parameters parsed &amp; verified against MSS standard
                      </div>
                    </div>
                    {record.details && (
                      <p className="text-[11px] text-slate-600 pl-1">
                        {record.details}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
