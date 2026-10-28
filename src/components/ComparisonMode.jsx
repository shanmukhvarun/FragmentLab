export default function ComparisonMode({ comparison, config, packet }) {
  const { normal, df, pmtud } = comparison;

  const lastNormalHop = [...normal].reverse().find((h) => h.success);
  const normalFragments = lastNormalHop ? lastNormalHop.outputFragments : [];
  const normalSuccess = normal.every((h) => h.success);

  const dfSuccess = df.every((h) => h.success);
  const dfError = df.find((h) => !h.success);

  return (
    <div className="animate-fade-in">
      <div className="viz-canvas" style={{ marginBottom: 24 }}>
        <div className="viz-canvas__header">
          <div className="viz-canvas__title">⚖️ Comparison: Three Approaches</div>
          <span className="status-badge status-badge--info">
            {packet.totalSize}B packet → MTU {Math.min(...config.links.map((l) => l.mtu))}B
          </span>
        </div>
        <div className="viz-canvas__body">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            Sending a <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{packet.totalSize}-byte</strong> packet
            through {config.links.length} link(s) with minimum MTU of{' '}
            <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {Math.min(...config.links.map((l) => l.mtu))}B
            </strong>.
            Compare how each approach handles the situation:
          </div>

          <div className="comparison-grid">
            {/* Normal Fragmentation */}
            <div className="comparison-card">
              <div className="comparison-card__title" style={{ color: 'var(--accent-cyan)' }}>
                📦 Normal Fragmentation
              </div>
              <div className="comparison-card__subtitle">DF=0 — Router fragments the packet</div>
              
              <div className="comparison-card__result">
                <div className="comparison-card__result-label">Result</div>
                <div className="comparison-card__result-value" style={{ color: normalSuccess ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {normalSuccess
                    ? `✓ ${normalFragments.length} fragment(s) created`
                    : '✕ Failed'}
                </div>
              </div>

              {normalSuccess && normalFragments.length > 0 && (
                <>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">Total Bytes Transmitted</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--accent-cyan)' }}>
                      {normalFragments.reduce((s, f) => s + f.totalSize, 0)}B
                    </div>
                  </div>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">Header Overhead</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--accent-rose)' }}>
                      +{normalFragments.reduce((s, f) => s + f.headerSize, 0) - packet.headerSize}B
                    </div>
                  </div>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">Fragment Sizes</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {normalFragments.map((f) => `${f.totalSize}B`).join(', ')}
                    </div>
                  </div>
                </>
              )}

              <div className="info-section" style={{ marginTop: 12 }}>
                <div className="info-section__text">
                  Routers split oversized packets into fragments. Each fragment carries a copy of the IP header, adding overhead. Receiver must reassemble all fragments.
                </div>
              </div>
            </div>

            {/* Don't Fragment */}
            <div className="comparison-card">
              <div className="comparison-card__title" style={{ color: 'var(--accent-rose)' }}>
                🚫 Don't Fragment (DF)
              </div>
              <div className="comparison-card__subtitle">DF=1 — Packet dropped if too large</div>

              <div className="comparison-card__result">
                <div className="comparison-card__result-label">Result</div>
                <div className="comparison-card__result-value" style={{ color: dfSuccess ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {dfSuccess
                    ? '✓ Packet passed (fits MTU)'
                    : '✕ Packet dropped'}
                </div>
              </div>

              {!dfSuccess && dfError && (
                <>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">ICMP Response</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>
                      Type 3, Code 4
                    </div>
                  </div>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">Message</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                      Fragmentation Needed and DF Set
                    </div>
                  </div>
                  <div className="comparison-card__result">
                    <div className="comparison-card__result-label">Reported Next-Hop MTU</div>
                    <div className="comparison-card__result-value" style={{ color: 'var(--accent-amber)' }}>
                      {dfError.mtu}B
                    </div>
                  </div>
                </>
              )}

              <div className="info-section" style={{ marginTop: 12 }}>
                <div className="info-section__text">
                  With DF set, routers cannot fragment. If the packet exceeds MTU, it's dropped and an ICMP message is sent back. This is the basis for PMTUD.
                </div>
              </div>
            </div>

            {/* Path MTU Discovery */}
            <div className="comparison-card">
              <div className="comparison-card__title" style={{ color: 'var(--accent-emerald)' }}>
                🔍 Path MTU Discovery
              </div>
              <div className="comparison-card__subtitle">Iteratively discover the path MTU</div>

              <div className="comparison-card__result">
                <div className="comparison-card__result-label">Discovered Path MTU</div>
                <div className="comparison-card__result-value" style={{ color: 'var(--accent-emerald)' }}>
                  {pmtud.pathMTU}B
                </div>
              </div>
              <div className="comparison-card__result">
                <div className="comparison-card__result-label">Original Size → Adjusted</div>
                <div className="comparison-card__result-value" style={{ color: 'var(--accent-cyan)' }}>
                  {pmtud.originalSize}B → {pmtud.adjustedSize}B
                </div>
              </div>
              <div className="comparison-card__result">
                <div className="comparison-card__result-label">ICMP Messages Received</div>
                <div className="comparison-card__result-value" style={{ color: 'var(--accent-amber)' }}>
                  {pmtud.steps.filter((s) => s.action === 'icmp_received').length}
                </div>
              </div>
              <div className="comparison-card__result">
                <div className="comparison-card__result-label">Advantage</div>
                <div className="comparison-card__result-value" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                  No fragmentation, no overhead, optimal throughput
                </div>
              </div>

              <div className="info-section" style={{ marginTop: 12 }}>
                <div className="info-section__text">
                  PMTUD uses DF bit + ICMP feedback to find the smallest MTU along the path. The sender adjusts packet size to avoid fragmentation entirely.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
