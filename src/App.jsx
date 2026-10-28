import { useState, useCallback, useMemo } from 'react';
import ConfigPanel from './components/ConfigPanel';
import PacketVisualizer from './components/PacketVisualizer';
import FragmentTable from './components/FragmentTable';
import ReassemblyView from './components/ReassemblyView';
import ComparisonMode from './components/ComparisonMode';
import PMTUDView from './components/PMTUDView';
import StatsBar from './components/StatsBar';
import {
  createPacket,
  fragmentPacket,
  fragmentThroughPath,
  reassembleFragments,
  simulatePMTUD,
  resetIdentification,
} from './engine/fragmentation';

const MODES = [
  { id: 'fragment', label: '⚡ Fragmentation', desc: 'Fragment packets through links' },
  { id: 'reassembly', label: '🔄 Reassembly', desc: 'Simulate fragment reassembly' },
  { id: 'compare', label: '⚖️ Compare', desc: 'IPv4 vs DF vs PMTUD' },
  { id: 'pmtud', label: '🔍 Path MTU Discovery', desc: 'PMTUD simulation' },
];

export default function App() {
  const [mode, setMode] = useState('fragment');
  const [config, setConfig] = useState({
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
  const [simulationKey, setSimulationKey] = useState(0);

  const runSimulation = useCallback(() => {
    setSimulationKey((k) => k + 1);
    resetIdentification();
  }, []);

  const results = useMemo(() => {
    const packet = createPacket({
      totalSize: config.packetSize,
      headerSize: config.headerSize,
      dontFragment: config.dontFragment,
      protocol: config.protocol,
      sourceIP: config.sourceIP,
      destIP: config.destIP,
      ttl: config.ttl,
    });

    // Multi-link fragmentation
    const hops = fragmentThroughPath(packet, config.links);
    const lastSuccessHop = [...hops].reverse().find((h) => h.success);
    const finalFragments = lastSuccessHop ? lastSuccessHop.outputFragments : [];

    // Reassembly
    const reassembly = finalFragments.length > 0
      ? reassembleFragments(finalFragments, config.lostFragments)
      : null;

    // PMTUD
    const pmtud = simulatePMTUD(packet, config.links);

    // Comparison: normal, DF, PMTUD
    const normalPacket = createPacket({ ...config, dontFragment: false, totalSize: config.packetSize, headerSize: config.headerSize });
    const dfPacket = createPacket({ ...config, dontFragment: true, totalSize: config.packetSize, headerSize: config.headerSize });

    const normalResult = fragmentThroughPath(normalPacket, config.links);
    const dfResult = fragmentThroughPath(dfPacket, config.links);

    return {
      packet,
      hops,
      finalFragments,
      reassembly,
      pmtud,
      comparison: {
        normal: normalResult,
        df: dfResult,
        pmtud,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, simulationKey]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">📦</div>
          <div>
            <div className="header__title">FragmentLab</div>
            <div className="header__subtitle">Interactive IP Fragmentation & MTU Discovery</div>
          </div>
        </div>
        <span className="header__badge">IPv4 • RFC 791</span>
      </header>

      {/* Mode Tabs */}
      <div className="mode-tabs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`mode-tab ${mode === m.id ? 'mode-tab--active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar — Config */}
        <aside>
          <ConfigPanel
            config={config}
            setConfig={setConfig}
            onSimulate={runSimulation}
            mode={mode}
            fragmentCount={results.finalFragments.length}
          />
        </aside>

        {/* Main Area */}
        <main className="viz-area">
          {mode === 'fragment' && (
            <>
              <StatsBar
                packet={results.packet}
                fragments={results.finalFragments}
                hops={results.hops}
              />
              <PacketVisualizer
                packet={results.packet}
                hops={results.hops}
                fragments={results.finalFragments}
                config={config}
              />
              <FragmentTable
                fragments={results.finalFragments}
                packet={results.packet}
                hops={results.hops}
              />
            </>
          )}

          {mode === 'reassembly' && (
            <>
              <StatsBar
                packet={results.packet}
                fragments={results.finalFragments}
                hops={results.hops}
              />
              <PacketVisualizer
                packet={results.packet}
                hops={results.hops}
                fragments={results.finalFragments}
                config={config}
              />
              <ReassemblyView
                fragments={results.finalFragments}
                reassembly={results.reassembly}
                lostFragments={config.lostFragments}
                setLostFragments={(lost) =>
                  setConfig((c) => ({ ...c, lostFragments: lost }))
                }
                packet={results.packet}
              />
            </>
          )}

          {mode === 'compare' && (
            <ComparisonMode
              comparison={results.comparison}
              config={config}
              packet={results.packet}
            />
          )}

          {mode === 'pmtud' && (
            <PMTUDView pmtud={results.pmtud} config={config} packet={results.packet} />
          )}
        </main>
      </div>
    </div>
  );
}
