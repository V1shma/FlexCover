import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Clock, Search, Filter } from 'lucide-react';

export default function ClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/claims')
            .then(r => r.json())
            .then(d => { setClaims(d.claims); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filteredClaims = filter === 'all' ? claims : claims.filter(c => c.status === filter);

    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Claims Management</h1>
                    <p className="text-sm text-slate-400 mt-1">Review triggers and payouts</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'approved', 'flagged', 'pending_proof'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                ? 'bg-primary/20 text-primary-light border border-primary/30'
                                : 'bg-white/[0.04] text-slate-400 border border-transparent hover:bg-white/[0.08]'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/[0.06] bg-black/20 text-sm font-semibold text-slate-400">
                    <div className="col-span-3">Worker / Policy</div>
                    <div className="col-span-3">Trigger Event</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2 text-right">Income Loss</div>
                    <div className="col-span-2 text-right">Payout</div>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading claims...</div>
                    ) : filteredClaims.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No claims found.</div>
                    ) : (
                        filteredClaims.map(claim => {
                            const statusColor = claim.status === 'approved' ? 'text-success'
                                : claim.status === 'flagged' ? 'text-error'
                                    : 'text-warning';
                            const statusBg = claim.status === 'approved' ? 'text-success/70'
                                : claim.status === 'flagged' ? 'text-error/70'
                                    : 'text-warning/70';

                            return (
                                <div key={claim.id} className="group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <div className="grid grid-cols-12 gap-4 p-4 items-center">
                                        <div className="col-span-3">
                                            <div className="font-medium text-white">{claim.workerName}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5" title={claim.policyId}>
                                                {claim.policyId.split('-')[0]}...
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="flex items-center gap-2">
                                                {claim.status === 'approved' ? (
                                                    <CheckCircle2 size={14} className="text-success" />
                                                ) : claim.status === 'flagged' ? (
                                                    <AlertTriangle size={14} className="text-error" />
                                                ) : (
                                                    <Clock size={14} className="text-warning" />
                                                )}
                                                <span className="text-sm text-slate-200">{claim.triggerLabel}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                {new Date(claim.createdAt).toLocaleString('en-IN', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="text-sm text-slate-300">{claim.city}</div>
                                            <div className="text-xs text-slate-500">{claim.zone}</div>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <div className="text-sm text-slate-300">₹{claim.incomeLoss}</div>
                                            <div className="text-xs text-slate-500">{claim.lostHours}hrs @ ₹{Math.round(claim.incomeLoss / claim.lostHours)}/hr</div>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <div className={`text-sm font-bold ${statusColor}`}>
                                                ₹{claim.payoutAmount}
                                            </div>
                                            <div className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${statusBg}`}>
                                                {claim.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adversarial Evidence Section */}
                                    {(claim.status === 'flagged' || claim.status === 'pending_proof') && (
                                        <div className="px-4 pb-4 mx-4 mb-4 mt-[-4px] rounded-lg bg-red-500/5 border border-red-500/10 animate-in slide-in-from-top-2">
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network IP</span>
                                                    <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">{claim.ipAddress || 'Not Captured'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Device ID</span>
                                                    <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">{claim.deviceId || 'Not Captured'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Platform Sync</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${claim.platformActive ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
                                                        {claim.platformActive ? 'ACTIVE' : 'INACTIVE'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">Anomaly Index</span>
                                                    <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-error transition-all"
                                                            style={{ width: `${claim.anomalyScore || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {claim.fraudFlags && claim.fraudFlags.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 tracking-widest">Adversarial Defense Logs</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {claim.fraudFlags.map((flag, idx) => (
                                                            <span key={idx} className="text-[11px] text-error/90 bg-error/10 border border-error/20 px-2 py-1 rounded">
                                                                {flag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
