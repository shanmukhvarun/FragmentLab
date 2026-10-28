import { getProtocolName } from '../engine/fragmentation';

export default function FragmentTable({ fragments, packet, hops }) {
  const hasError = hops.some((h) => !h.success);

  if (hasError || fragments.length === 0) {
    return (
      <div className="viz-canvas animate-fade-in">
        <div className="viz-canvas__header">
          <div className="viz-canvas__title">📋 Fragment Details</div>
        </div>
        <div className="empty-state">
          <div className="empty-state__icon">{hasError ? '🚫' : '📦'}</div>
          <div className="empty-state__title">
            {hasError ? 'Fragmentation Blocked' : 'No Fragmentation Needed'}
          </div>
          <div className="empty-state__desc">
            {hasError
              ? 'The packet could not be fragmented. Check the error above.'
              : 'The packet fits within the MTU. No fragments were created.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="viz-canvas animate-fade-in">
      <div className="viz-canvas__header">
        <div className="viz-canvas__title">
          📋 Fragment Details
        </div>
        <span className="status-badge status-badge--info">
          {fragments.length} fragment{fragments.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="viz-canvas__body" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="fragment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Total Size</th>
                <th>Header</th>
                <th>Payload</th>
                <th>Identification</th>
                <th>Offset (bytes)</th>
                <th>Offset (field)</th>
                <th>MF Flag</th>
                <th>DF Flag</th>
                <th>Protocol</th>
                <th>TTL</th>
              </tr>
            </thead>
            <tbody>
              {fragments.map((frag, idx) => (
                <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td style={{ color: 'var(--accent-tertiary)', fontWeight: 600 }}>{idx}</td>
                  <td className="highlight">{frag.totalSize} B</td>
                  <td>{frag.headerSize} B</td>
                  <td>{frag.payloadSize} B</td>
                  <td style={{ color: 'var(--accent-amber)' }}>0x{frag.identification.toString(16).padStart(4, '0').toUpperCase()}</td>
                  <td className="highlight">{frag.fragmentOffset}</td>
                  <td>{frag.fragmentOffsetField}</td>
                  <td>
                    <span className={`mf-flag ${frag.moreFragments ? 'mf-flag--on' : 'mf-flag--off'}`}>
                      {frag.moreFragments ? 'MF=1' : 'MF=0'}
                    </span>
                  </td>
                  <td style={{ color: frag.dontFragment ? 'var(--accent-rose)' : 'var(--text-tertiary)' }}>
                    {frag.dontFragment ? 'DF=1' : 'DF=0'}
                  </td>
                  <td>{getProtocolName(frag.protocol)}</td>
                  <td>{frag.ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Original:</strong>{' '}
              {packet.totalSize}B ({packet.headerSize}B header + {packet.payloadSize}B payload)
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Total transmitted:</strong>{' '}
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {fragments.reduce((s, f) => s + f.totalSize, 0)}B
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Overhead:</strong>{' '}
              <span style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                +{fragments.reduce((s, f) => s + f.headerSize, 0) - packet.headerSize}B
              </span>
              {' '}({fragments.length - 1} extra headers)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
