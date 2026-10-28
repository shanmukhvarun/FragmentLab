import { reassembleFragments } from '../engine/fragmentation';
import { useMemo } from 'react';

const FRAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#eab308',
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
];

export default function ReassemblyView({ fragments, reassembly: initialReassembly, lostFragments, setLostFragments, packet }) {
  const toggleLost = (idx) => {
    if (lostFragments.includes(idx)) {
      setLostFragments(lostFragments.filter((i) => i !== idx));
    } else {
      setLostFragments([...lostFragments, idx]);
    }
  };

  const reassembly = useMemo(() => {
    if (fragments.length === 0) return null;
    return reassembleFragments(fragments, lostFragments);
  }, [fragments, lostFragments]);

  if (fragments.length === 0) {
    return (
      <div className="viz-canvas animate-fade-in">
        <div className="viz-canvas__header">
          <div className="viz-canvas__title">🔄 Reassembly Simulation</div>
        </div>
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <div className="empty-state__title">No Fragments to Reassemble</div>
          <div className="empty-state__desc">
            Configure a packet larger than the MTU to generate fragments, then test reassembly here.
          </div>
        </div>
      </div>
    );
  }

  const totalPayload = packet.payloadSize;

  return (
    <div className="viz-canvas animate-fade-in">
      <div className="viz-canvas__header">
        <div className="viz-canvas__title">🔄 Reassembly Simulation</div>
        {reassembly && (
          <span className={`status-badge ${reassembly.success ? 'status-badge--success' : 'status-badge--error'}`}>
            {reassembly.success ? '✓ Reassembled' : '✕ Failed'}
          </span>
        )}
      </div>
      <div className="viz-canvas__body">
        {/* Lost fragment toggles */}
        <div style={{ marginBottom: 20 }}>
          <div className="form-label" style={{ marginBottom: 8 }}>
            Click fragments to simulate loss
            <span className="form-label__hint">{lostFragments.length} lost</span>
          </div>
          <div className="lost-toggle">
            {fragments.map((frag, idx) => (
              <button
                key={idx}
                className={`lost-toggle__chip ${lostFragments.includes(idx) ? 'lost-toggle__chip--lost' : ''}`}
                onClick={() => toggleLost(idx)}
              >
                Frag #{idx} ({frag.payloadSize}B)
              </button>
            ))}
          </div>
        </div>

        {/* Reassembly bar visualization */}
        <div className="reassembly">
          <div className="form-label">Reassembly Buffer</div>
          <div className="reassembly__bar">
            {fragments.map((frag, idx) => {
              const isLost = lostFragments.includes(idx);
              const widthPct = (frag.payloadSize / totalPayload) * 100;

              return (
                <div
                  key={idx}
                  className={`reassembly__segment ${isLost ? 'reassembly__gap' : ''}`}
                  style={{
                    width: `${widthPct}%`,
                    background: isLost
                      ? undefined
                      : `linear-gradient(135deg, ${FRAG_COLORS[idx % FRAG_COLORS.length]}, ${FRAG_COLORS[idx % FRAG_COLORS.length]}cc)`,
                    animationDelay: `${idx * 100}ms`,
                  }}
                  title={isLost ? `Fragment #${idx}: LOST (${frag.payloadSize}B)` : `Fragment #${idx}: ${frag.payloadSize}B at offset ${frag.fragmentOffset}`}
                >
                  {isLost ? '✕' : `#${idx}`}
                </div>
              );
            })}
          </div>

          {/* Offset scale */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 4 }}>
            <span>0</span>
            {fragments
              .filter((_, idx) => idx > 0 && idx < fragments.length)
              .map((frag, idx) => (
                <span key={idx}>{frag.fragmentOffset}</span>
              ))}
            <span>{totalPayload}</span>
          </div>
        </div>

        {/* Reassembly result details */}
        {reassembly && (
          <div style={{ marginTop: 20 }}>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-item__value" style={{ color: reassembly.success ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {reassembly.success ? '✓' : '✕'}
                </div>
                <div className="stat-item__label">Status</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value">{reassembly.receivedFragments.length}/{fragments.length}</div>
                <div className="stat-item__label">Received</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value">{reassembly.totalReceivedPayload}</div>
                <div className="stat-item__label">Bytes Received</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value">{reassembly.gaps.length}</div>
                <div className="stat-item__label">Gaps</div>
              </div>
            </div>

            {reassembly.error && (
              <div className="icmp-message" style={{ marginTop: 16 }}>
                <div className="icmp-message__header">❌ Reassembly Failed</div>
                <div className="icmp-message__body">{reassembly.error}</div>
              </div>
            )}

            {reassembly.success && (
              <div className="info-section" style={{ marginTop: 16, borderColor: 'rgba(52, 211, 153, 0.2)', background: 'rgba(52, 211, 153, 0.04)' }}>
                <div className="info-section__title" style={{ color: 'var(--accent-emerald)' }}>
                  ✅ Reassembly Successful
                </div>
                <div className="info-section__text">
                  All {fragments.length} fragments received. Original {totalPayload}-byte payload
                  has been successfully reconstructed from {fragments.length} fragments.
                  The identification field (0x{fragments[0]?.identification.toString(16).padStart(4, '0').toUpperCase()}) was used to group related fragments.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
