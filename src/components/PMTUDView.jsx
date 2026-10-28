export default function PMTUDView({ pmtud, config, packet }) {
  return (
    <div className="animate-fade-in">
      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-item">
          <div className="stat-item__value">{pmtud.originalSize}</div>
          <div className="stat-item__label">Original Size (B)</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__value" style={{ color: 'var(--accent-emerald)' }}>
            {pmtud.pathMTU}
          </div>
          <div className="stat-item__label">Path MTU (B)</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__value" style={{ color: 'var(--accent-amber)' }}>
            {pmtud.steps.filter((s) => s.action === 'icmp_received').length}
          </div>
          <div className="stat-item__label">ICMP Messages</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__value">{config.links.length}</div>
          <div className="stat-item__label">Links in Path</div>
        </div>
      </div>

      {/* Path visualization */}
      <div className="viz-canvas" style={{ marginBottom: 24 }}>
        <div className="viz-canvas__header">
          <div className="viz-canvas__title">🛤️ Network Path</div>
        </div>
        <div className="viz-canvas__body">
          <svg width="100%" height="80" viewBox="0 0 800 80">
            {/* Source */}
            <rect x="10" y="20" width="80" height="40" rx="8" fill="#1a2035" stroke="#6366f1" strokeWidth="1.5" />
            <text x="50" y="44" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
              Source
            </text>
            <text x="50" y="56" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono, monospace">
              {packet.sourceIP}
            </text>

            {/* Links */}
            {config.links.map((link, idx) => {
              const x = 120 + idx * 180;
              const isBottleneck = link.mtu === pmtud.pathMTU;
              return (
                <g key={idx}>
                  {/* Connection line */}
                  <line
                    x1={idx === 0 ? 90 : x - 30}
                    y1="40"
                    x2={x}
                    y2="40"
                    stroke={isBottleneck ? '#fb7185' : '#6366f1'}
                    strokeWidth="2"
                    strokeDasharray={isBottleneck ? '6,3' : 'none'}
                  />
                  <rect
                    x={x}
                    y="15"
                    width="120"
                    height="50"
                    rx="8"
                    fill={isBottleneck ? 'rgba(251,113,133,0.08)' : '#1a2035'}
                    stroke={isBottleneck ? '#fb7185' : '#374151'}
                    strokeWidth="1.5"
                  />
                  <text x={x + 60} y="36" textAnchor="middle" fill="#f1f5f9" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
                    {link.name}
                  </text>
                  <text x={x + 60} y="52" textAnchor="middle" fill={isBottleneck ? '#fb7185' : '#22d3ee'} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                    MTU: {link.mtu}
                  </text>
                  {isBottleneck && (
                    <text x={x + 60} y="78" textAnchor="middle" fill="#fb7185" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">
                      ▲ BOTTLENECK
                    </text>
                  )}
                </g>
              );
            })}

            {/* Destination */}
            {(() => {
              const destX = 120 + config.links.length * 180;
              return (
                <g>
                  <line
                    x1={destX - 30}
                    y1="40"
                    x2={destX}
                    y2="40"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  <rect x={destX} y="20" width="80" height="40" rx="8" fill="#1a2035" stroke="#34d399" strokeWidth="1.5" />
                  <text x={destX + 40} y="44" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
                    Dest
                  </text>
                  <text x={destX + 40} y="56" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono, monospace">
                    {packet.destIP}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Steps */}
      <div className="viz-canvas">
        <div className="viz-canvas__header">
          <div className="viz-canvas__title">📝 PMTUD Discovery Steps</div>
          <span className="status-badge status-badge--success">
            Path MTU: {pmtud.pathMTU}B
          </span>
        </div>
        <div className="viz-canvas__body">
          <div className="pmtud-steps stagger">
            {pmtud.steps.map((step, idx) => (
              <div key={idx} className="pmtud-step">
                <div className="pmtud-step__number">{step.step}</div>
                <div className="pmtud-step__content">
                  <div className={`pmtud-step__action pmtud-step__action--${step.action === 'pass' ? 'pass' : step.action === 'icmp_received' ? 'icmp' : 'discovered'}`}>
                    {step.action === 'pass' && '✓ PASS'}
                    {step.action === 'icmp_received' && '⚠ ICMP FRAGMENTATION NEEDED'}
                    {step.action === 'discovered' && '🎯 PATH MTU DISCOVERED'}
                  </div>
                  <div className="pmtud-step__desc">{step.description}</div>
                  {step.icmp && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(251,113,133,0.06)', borderRadius: 6, border: '1px solid rgba(251,113,133,0.15)' }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                        ICMP Type {step.icmp.type}, Code {step.icmp.code} • Next-Hop MTU: {step.icmp.nextHopMTU}B
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="info-section" style={{ marginTop: 20 }}>
            <div className="info-section__title">🔑 How Path MTU Discovery Works</div>
            <div className="info-section__text">
              <strong>1.</strong> Sender sets the DF (Don't Fragment) bit on all outgoing packets.<br />
              <strong>2.</strong> If a router encounters a packet larger than its MTU, it drops the packet and sends an ICMP "Fragmentation Needed" (Type 3, Code 4) message back.<br />
              <strong>3.</strong> The ICMP message includes the MTU of the link that caused the failure (Next-Hop MTU).<br />
              <strong>4.</strong> The sender reduces its packet size to match the reported MTU and retransmits.<br />
              <strong>5.</strong> This process repeats until the packet can traverse the entire path without fragmentation.<br />
              <strong>6.</strong> The result is the Path MTU — the smallest MTU along the entire path.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
