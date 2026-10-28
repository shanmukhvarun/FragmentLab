export default function StatsBar({ packet, fragments, hops }) {
  const totalHeaderOverhead = fragments.reduce((sum, f) => sum + f.headerSize, 0);
  const originalHeaderOverhead = packet.headerSize;
  const additionalOverhead = totalHeaderOverhead - originalHeaderOverhead;
  const lastHop = hops[hops.length - 1];
  const hasError = lastHop && !lastHop.success;

  return (
    <div className="stats-grid animate-fade-in">
      <div className="stat-item">
        <div className="stat-item__value">{packet.totalSize}</div>
        <div className="stat-item__label">Original Size (B)</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__value" style={{ color: fragments.length > 1 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
          {fragments.length}
        </div>
        <div className="stat-item__label">Fragments</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__value">{packet.payloadSize}</div>
        <div className="stat-item__label">Payload (B)</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__value" style={{ color: additionalOverhead > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
          +{additionalOverhead}
        </div>
        <div className="stat-item__label">Header Overhead (B)</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__value">{Math.min(...hops.map(h => h.mtu))}</div>
        <div className="stat-item__label">Min MTU (B)</div>
      </div>
      <div className="stat-item">
        <div className="stat-item__value" style={{ color: hasError ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
          {hasError ? '✕' : '✓'}
        </div>
        <div className="stat-item__label">Status</div>
      </div>
    </div>
  );
}
