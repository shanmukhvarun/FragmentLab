import { useMemo } from 'react';

const FRAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#eab308',
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
];

export default function PacketVisualizer({ packet, hops, fragments, config }) {
  const hasError = hops.some((h) => !h.success);
  const errorHop = hops.find((h) => !h.success);

  // Calculate proportional widths
  const maxSize = Math.max(packet.totalSize, ...fragments.map((f) => f.totalSize));

  return (
    <div className="viz-canvas animate-fade-in">
      <div className="viz-canvas__header">
        <div className="viz-canvas__title">
          📊 Packet Fragmentation Visualization
        </div>
        {hasError ? (
          <span className="status-badge status-badge--error">⚠ Error</span>
        ) : fragments.length > 1 ? (
          <span className="status-badge status-badge--warning">Fragmented</span>
        ) : (
          <span className="status-badge status-badge--success">No Fragmentation</span>
        )}
      </div>

      <div className="viz-canvas__body">
        <div className="packet-blocks">
          {/* Original Packet */}
          <div className="packet-row">
            <div className="packet-row__label">
              🔷 Original Packet
              <span className="total-size">{packet.totalSize} bytes</span>
            </div>
            <div className="packet-bar" style={{ position: 'relative' }}>
              <div
                className="packet-bar__header"
                style={{ width: `${(packet.headerSize / packet.totalSize) * 100}%` }}
                title={`IP Header: ${packet.headerSize} bytes`}
              >
                HDR {packet.headerSize}B
              </div>
              <div
                className="packet-bar__payload"
                style={{ width: `${(packet.payloadSize / packet.totalSize) * 100}%` }}
                title={`Payload: ${packet.payloadSize} bytes`}
              >
                Payload: {packet.payloadSize}B
              </div>
              {/* MTU marker for first link */}
              {config.links.length > 0 && config.links[0].mtu < packet.totalSize && (
                <div
                  className="mtu-marker"
                  style={{
                    left: `${(config.links[0].mtu / packet.totalSize) * 100}%`,
                  }}
                  data-label={`MTU ${config.links[0].mtu}B`}
                />
              )}
            </div>
          </div>

          {/* Arrow */}
          {!hasError && fragments.length > 1 && (
            <div className="fragment-arrow">⬇ Fragmented into {fragments.length} fragments</div>
          )}
          {hasError && (
            <div className="fragment-arrow" style={{ color: 'var(--accent-rose)' }}>
              ⬇ ✕ Fragmentation blocked
            </div>
          )}

          {/* Error ICMP */}
          {hasError && errorHop && errorHop.icmpMessage && (
            <div className="icmp-message animate-fade-in">
              <div className="icmp-message__header">
                🚫 {errorHop.icmpMessage.description}
              </div>
              <div className="icmp-message__body">
                Router at {errorHop.linkName} (MTU: {errorHop.mtu}B) sent ICMP
                Destination Unreachable back to {packet.sourceIP}
              </div>
            </div>
          )}

          {hasError && errorHop && !errorHop.icmpMessage && (
            <div className="icmp-message animate-fade-in">
              <div className="icmp-message__header">⚠️ Error</div>
              <div className="icmp-message__body">{errorHop.error}</div>
            </div>
          )}

          {/* Fragments for each hop */}
          {!hasError &&
            hops.map((hop, hopIdx) => {
              if (!hop.success) return null;
              const showHop = hop.outputFragments.length > 1 || hops.length > 1;
              if (!showHop && hopIdx > 0) return null;

              return (
                <div key={hopIdx} className="hop-section animate-fade-in" style={{ animationDelay: `${hopIdx * 100}ms` }}>
                  {hops.length > 1 && (
                    <div className="hop-section__header">
                      <span className="hop-section__badge">Hop {hopIdx + 1}</span>
                      <span className="hop-section__name">{hop.linkName}</span>
                      <span className="hop-section__mtu">MTU: {hop.mtu}B</span>
                    </div>
                  )}
                  {hop.outputFragments.map((frag, fragIdx) => (
                    <div
                      key={fragIdx}
                      className="packet-row animate-slide-in"
                      style={{ animationDelay: `${fragIdx * 80}ms`, marginBottom: 6 }}
                    >
                      <div className="packet-row__label">
                        Fragment #{fragIdx}
                        <span className="total-size">
                          {frag.totalSize}B • Offset: {frag.fragmentOffset} • MF: {frag.moreFragments ? '1' : '0'}
                        </span>
                      </div>
                      <div className="packet-bar">
                        <div
                          className="packet-bar__header"
                          style={{
                            width: `${(frag.headerSize / frag.totalSize) * 100}%`,
                            minWidth: 42,
                          }}
                          title={`IP Header: ${frag.headerSize}B (copied per fragment)`}
                        >
                          {frag.headerSize}B
                        </div>
                        <div
                          className="packet-bar__payload"
                          style={{
                            width: `${(frag.payloadSize / frag.totalSize) * 100}%`,
                            background: `linear-gradient(135deg, ${FRAG_COLORS[fragIdx % FRAG_COLORS.length]}, ${FRAG_COLORS[fragIdx % FRAG_COLORS.length]}dd)`,
                          }}
                          title={`Payload: ${frag.payloadSize}B`}
                        >
                          {frag.payloadSize}B
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
