import { useState } from 'react';

export default function ConfigPanel({ config, setConfig, onSimulate, mode, fragmentCount }) {
  const update = (key, value) => setConfig((c) => ({ ...c, [key]: value }));

  const addLink = () => {
    setConfig((c) => ({
      ...c,
      links: [...c.links, { name: `Link ${c.links.length + 1}`, mtu: 1500 }],
    }));
  };

  const removeLink = (idx) => {
    if (config.links.length <= 1) return;
    setConfig((c) => ({
      ...c,
      links: c.links.filter((_, i) => i !== idx),
    }));
  };

  const updateLink = (idx, key, value) => {
    setConfig((c) => ({
      ...c,
      links: c.links.map((l, i) => (i === idx ? { ...l, [key]: value } : l)),
    }));
  };

  const loadDemo = () => {
    setConfig({
      packetSize: 4000,
      headerSize: 20,
      dontFragment: false,
      protocol: 6,
      sourceIP: '192.168.1.10',
      destIP: '10.0.0.5',
      ttl: 64,
      links: [{ name: 'Ethernet Link', mtu: 1500 }],
      lostFragments: [],
    });
  };

  const loadMultiHop = () => {
    setConfig({
      packetSize: 4000,
      headerSize: 20,
      dontFragment: false,
      protocol: 17,
      sourceIP: '10.0.1.1',
      destIP: '10.0.3.5',
      ttl: 64,
      links: [
        { name: 'Ethernet', mtu: 1500 },
        { name: 'VPN Tunnel', mtu: 1300 },
        { name: 'PPPoE Link', mtu: 1492 },
      ],
      lostFragments: [],
    });
  };

  return (
    <div className="card" style={{ position: 'sticky', top: 20 }}>
      <div className="card__header">
        <div className="card__icon card__icon--indigo">⚙️</div>
        <span className="card__title">Configuration</span>
      </div>

      {/* Packet Size */}
      <div className="form-group">
        <label className="form-label">
          Total Packet Size
          <span className="form-value">{config.packetSize} B</span>
        </label>
        <input
          type="range"
          className="form-slider"
          min={68}
          max={65535}
          step={1}
          value={config.packetSize}
          onChange={(e) => update('packetSize', Number(e.target.value))}
        />
        <input
          type="number"
          className="form-input"
          value={config.packetSize}
          min={68}
          max={65535}
          onChange={(e) => update('packetSize', Math.max(68, Math.min(65535, Number(e.target.value))))}
          style={{ marginTop: 6 }}
        />
      </div>

      {/* Header Size */}
      <div className="form-group">
        <label className="form-label">
          IP Header Size
          <span className="form-value">{config.headerSize} B</span>
        </label>
        <input
          type="range"
          className="form-slider"
          min={20}
          max={60}
          step={4}
          value={config.headerSize}
          onChange={(e) => update('headerSize', Number(e.target.value))}
        />
        <span className="form-label__hint" style={{ marginTop: 4, display: 'block' }}>
          Min: 20B (no options) • Max: 60B (with options)
        </span>
      </div>

      {/* Don't Fragment */}
      <div className="form-group">
        <label className="form-toggle">
          <input
            type="checkbox"
            checked={config.dontFragment}
            onChange={(e) => update('dontFragment', e.target.checked)}
          />
          <span className="form-toggle__switch"></span>
          <span className="form-toggle__label">Don't Fragment (DF) bit</span>
        </label>
      </div>

      {/* Protocol */}
      <div className="form-group">
        <label className="form-label">Protocol</label>
        <select
          className="form-input"
          value={config.protocol}
          onChange={(e) => update('protocol', Number(e.target.value))}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <option value={1}>ICMP (1)</option>
          <option value={6}>TCP (6)</option>
          <option value={17}>UDP (17)</option>
          <option value={47}>GRE (47)</option>
        </select>
      </div>

      {/* TTL */}
      <div className="form-group">
        <label className="form-label">
          TTL
          <span className="form-value">{config.ttl}</span>
        </label>
        <input
          type="range"
          className="form-slider"
          min={1}
          max={255}
          value={config.ttl}
          onChange={(e) => update('ttl', Number(e.target.value))}
        />
      </div>

      <div className="section-divider" />

      {/* Network Links */}
      <div className="form-group" style={{ marginTop: 14 }}>
        <label className="form-label">
          Network Links
          <span className="form-label__hint">{config.links.length} link(s)</span>
        </label>
        <div className="link-config">
          {config.links.map((link, idx) => (
            <div key={idx} className="link-item animate-fade-in">
              <div className="link-item__name">
                <input
                  value={link.name}
                  onChange={(e) => updateLink(idx, 'name', e.target.value)}
                  placeholder="Link name"
                />
              </div>
              <div className="link-item__mtu">
                <input
                  type="number"
                  value={link.mtu}
                  min={68}
                  max={9000}
                  onChange={(e) =>
                    updateLink(idx, 'mtu', Math.max(68, Number(e.target.value)))
                  }
                  title="MTU (bytes)"
                />
              </div>
              <button
                className="link-item__remove"
                onClick={() => removeLink(idx)}
                disabled={config.links.length <= 1}
                title="Remove link"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          className="btn btn--secondary btn--sm btn--full"
          onClick={addLink}
          style={{ marginTop: 8 }}
        >
          + Add Link
        </button>
      </div>

      <div className="section-divider" />

      {/* Action Buttons */}
      <div className="btn-group" style={{ flexDirection: 'column', gap: 8 }}>
        <button className="btn btn--primary btn--full" onClick={onSimulate}>
          ⚡ Run Simulation
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--secondary btn--sm" style={{ flex: 1 }} onClick={loadDemo}>
            📋 Demo
          </button>
          <button className="btn btn--secondary btn--sm" style={{ flex: 1 }} onClick={loadMultiHop}>
            🔗 Multi-Hop
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="info-section">
        <div className="info-section__title">
          💡 {mode === 'fragment' ? 'Fragmentation' : mode === 'reassembly' ? 'Reassembly' : mode === 'compare' ? 'Comparison' : 'Path MTU Discovery'}
        </div>
        <div className="info-section__text">
          {mode === 'fragment' && 'Configure packet size and link MTUs to see how IPv4 fragments packets. Each fragment carries its own IP header and a portion of the payload.'}
          {mode === 'reassembly' && 'Click fragment chips below to simulate lost fragments. The receiver must collect all fragments to reconstruct the original datagram.'}
          {mode === 'compare' && 'Compare three approaches: normal fragmentation, Don\'t Fragment (drops packet), and Path MTU Discovery (adjusts size using ICMP).'}
          {mode === 'pmtud' && 'Path MTU Discovery sends packets with the DF bit set. When a router can\'t forward without fragmenting, it replies with ICMP "Fragmentation Needed."'}
        </div>
      </div>
    </div>
  );
}
