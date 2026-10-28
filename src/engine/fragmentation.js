/**
 * FragmentLab — IPv4 Fragmentation Engine
 * 
 * Implements RFC 791 fragmentation calculations:
 *  - Fragment offset computation (in 8-byte units)
 *  - More Fragments (MF) flag management
 *  - Identification field assignment
 *  - Header overhead tracking
 *  - Reassembly simulation
 *  - Path MTU Discovery (PMTUD) simulation
 */

let nextIdentification = 1;

/**
 * Represents an IPv4 packet or fragment.
 */
export function createPacket({
  totalSize,
  headerSize = 20,
  payload = null,
  identification = null,
  fragmentOffset = 0,
  moreFragments = false,
  dontFragment = false,
  ttl = 64,
  protocol = 6, // TCP
  sourceIP = '192.168.1.10',
  destIP = '10.0.0.5',
}) {
  const payloadSize = payload !== null ? payload : totalSize - headerSize;
  return {
    totalSize,
    headerSize,
    payloadSize,
    identification: identification ?? nextIdentification++,
    fragmentOffset,
    moreFragments,
    dontFragment,
    ttl,
    protocol,
    sourceIP,
    destIP,
  };
}

/**
 * Fragment an IPv4 packet based on a given MTU.
 *
 * Returns an object with:
 *  - success: boolean
 *  - fragments: array of fragment objects
 *  - error: string (if DF bit is set and packet exceeds MTU)
 *  - icmpMessage: ICMP message object (if DF bit triggers ICMP)
 */
export function fragmentPacket(packet, mtu) {
  // Validate inputs
  if (mtu < packet.headerSize + 8) {
    return {
      success: false,
      fragments: [],
      error: `MTU (${mtu}) is too small. Minimum MTU must be at least header size (${packet.headerSize}) + 8 bytes = ${packet.headerSize + 8} bytes.`,
      icmpMessage: null,
    };
  }

  // If packet fits within MTU, no fragmentation needed
  if (packet.totalSize <= mtu) {
    return {
      success: true,
      fragments: [{ ...packet, fragmentIndex: 0 }],
      error: null,
      icmpMessage: null,
    };
  }

  // If Don't Fragment (DF) bit is set
  if (packet.dontFragment) {
    return {
      success: false,
      fragments: [],
      error: `Packet size (${packet.totalSize} bytes) exceeds MTU (${mtu} bytes) but Don't Fragment (DF) bit is set. Packet dropped.`,
      icmpMessage: {
        type: 3,           // Destination Unreachable
        code: 4,           // Fragmentation Needed and DF Set
        mtu: mtu,
        description: `ICMP Type 3, Code 4: Fragmentation Needed and Don't Fragment was Set. Next-Hop MTU: ${mtu}`,
        sourceIP: 'router',
        destIP: packet.sourceIP,
      },
    };
  }

  // Perform fragmentation
  const fragments = [];
  const maxPayloadPerFragment = Math.floor((mtu - packet.headerSize) / 8) * 8; // Must be multiple of 8
  let remainingPayload = packet.payloadSize;
  let currentOffset = packet.fragmentOffset; // in bytes (will convert to 8-byte units for display)
  let fragmentIndex = 0;

  while (remainingPayload > 0) {
    const isLastFragment = remainingPayload <= maxPayloadPerFragment;
    const fragmentPayload = isLastFragment ? remainingPayload : maxPayloadPerFragment;
    const fragmentTotal = fragmentPayload + packet.headerSize;

    fragments.push({
      totalSize: fragmentTotal,
      headerSize: packet.headerSize,
      payloadSize: fragmentPayload,
      identification: packet.identification,
      fragmentOffset: currentOffset,           // byte offset
      fragmentOffsetField: currentOffset / 8,  // 8-byte units (as stored in IP header)
      moreFragments: isLastFragment ? packet.moreFragments : true,
      dontFragment: false,
      ttl: packet.ttl,
      protocol: packet.protocol,
      sourceIP: packet.sourceIP,
      destIP: packet.destIP,
      fragmentIndex,
    });

    currentOffset += fragmentPayload;
    remainingPayload -= fragmentPayload;
    fragmentIndex++;
  }

  return {
    success: true,
    fragments,
    error: null,
    icmpMessage: null,
  };
}

/**
 * Fragment a packet through multiple links with different MTUs.
 * Returns the fragmentation state at each hop.
 */
export function fragmentThroughPath(packet, links) {
  const hops = [];
  let currentFragments = [{ ...packet, fragmentIndex: 0 }];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const newFragments = [];
    let hasError = false;
    let errorMessage = null;
    let icmpMessage = null;

    for (const frag of currentFragments) {
      const result = fragmentPacket(frag, link.mtu);
      if (!result.success) {
        hasError = true;
        errorMessage = result.error;
        icmpMessage = result.icmpMessage;
        break;
      }
      newFragments.push(...result.fragments);
    }

    hops.push({
      linkIndex: i,
      linkName: link.name || `Link ${i + 1}`,
      mtu: link.mtu,
      inputFragments: [...currentFragments],
      outputFragments: hasError ? [] : newFragments,
      error: errorMessage,
      icmpMessage,
      success: !hasError,
    });

    if (hasError) break;

    // Re-index fragments
    currentFragments = newFragments.map((f, idx) => ({ ...f, fragmentIndex: idx }));
  }

  return hops;
}

/**
 * Simulate reassembly of fragments.
 * 
 * @param fragments - Array of fragments
 * @param lostFragmentIndices - Indices of fragments to simulate as lost
 * @returns reassembly result
 */
export function reassembleFragments(fragments, lostFragmentIndices = []) {
  const receivedFragments = fragments.filter(
    (_, idx) => !lostFragmentIndices.includes(idx)
  );

  // Sort by fragment offset
  const sorted = [...receivedFragments].sort(
    (a, b) => a.fragmentOffset - b.fragmentOffset
  );

  // Check for gaps
  let expectedOffset = 0;
  const gaps = [];
  const reassembledParts = [];

  for (const frag of sorted) {
    if (frag.fragmentOffset > expectedOffset) {
      gaps.push({
        start: expectedOffset,
        end: frag.fragmentOffset,
        size: frag.fragmentOffset - expectedOffset,
      });
    }
    reassembledParts.push({
      offset: frag.fragmentOffset,
      size: frag.payloadSize,
      fragmentIndex: frag.fragmentIndex,
    });
    expectedOffset = frag.fragmentOffset + frag.payloadSize;
  }

  // Check if last fragment has MF=0
  const lastFragment = sorted[sorted.length - 1];
  const hasLastFragment = lastFragment && !lastFragment.moreFragments;

  // Calculate total expected size
  const totalExpectedPayload = hasLastFragment
    ? lastFragment.fragmentOffset + lastFragment.payloadSize
    : null;

  const totalReceivedPayload = sorted.reduce((sum, f) => sum + f.payloadSize, 0);

  const success = gaps.length === 0 && hasLastFragment;

  return {
    success,
    receivedFragments: sorted,
    lostFragments: fragments.filter((_, idx) => lostFragmentIndices.includes(idx)),
    gaps,
    reassembledParts,
    totalExpectedPayload,
    totalReceivedPayload,
    hasLastFragment,
    error: !success
      ? gaps.length > 0
        ? `Reassembly failed: ${gaps.length} gap(s) detected in fragment stream. Missing ${gaps.reduce((s, g) => s + g.size, 0)} bytes.`
        : 'Reassembly failed: Missing final fragment (no fragment with MF=0 received).'
      : null,
  };
}

/**
 * Simulate Path MTU Discovery.
 * Sends packets with DF bit set, receives ICMP messages, and adjusts packet size.
 */
export function simulatePMTUD(originalPacket, links) {
  const steps = [];
  let currentMTU = originalPacket.totalSize;

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (currentMTU <= link.mtu) {
      steps.push({
        step: steps.length + 1,
        action: 'pass',
        linkName: link.name || `Link ${i + 1}`,
        linkMTU: link.mtu,
        packetSize: currentMTU,
        description: `Packet (${currentMTU} bytes) fits within ${link.name || `Link ${i + 1}`} MTU (${link.mtu} bytes). Passes through.`,
      });
    } else {
      // DF bit triggers ICMP
      steps.push({
        step: steps.length + 1,
        action: 'icmp_received',
        linkName: link.name || `Link ${i + 1}`,
        linkMTU: link.mtu,
        packetSize: currentMTU,
        description: `Packet (${currentMTU} bytes) exceeds ${link.name || `Link ${i + 1}`} MTU (${link.mtu} bytes). ICMP "Fragmentation Needed" received. Reducing packet size to ${link.mtu} bytes.`,
        icmp: {
          type: 3,
          code: 4,
          nextHopMTU: link.mtu,
        },
      });
      currentMTU = link.mtu;

      // Retry from beginning with new MTU
      // In real PMTUD, the sender retransmits. We simulate the final discovery.
    }
  }

  const pathMTU = Math.min(...links.map(l => l.mtu));
  steps.push({
    step: steps.length + 1,
    action: 'discovered',
    pathMTU,
    description: `Path MTU discovered: ${pathMTU} bytes. Sender adjusts packet size to fit.`,
  });

  return {
    steps,
    pathMTU,
    originalSize: originalPacket.totalSize,
    adjustedSize: pathMTU,
  };
}

/**
 * Get the demo scenario: 4000-byte packet through 1500-byte MTU link.
 */
export function getDemoScenario() {
  const packet = createPacket({
    totalSize: 4000,
    headerSize: 20,
    dontFragment: false,
  });

  const links = [
    { name: 'Ethernet Link', mtu: 1500 },
  ];

  return { packet, links };
}

/**
 * Reset identification counter (for fresh simulations)
 */
export function resetIdentification() {
  nextIdentification = 1;
}

/**
 * Get protocol name from number
 */
export function getProtocolName(num) {
  const protocols = {
    1: 'ICMP',
    6: 'TCP',
    17: 'UDP',
    47: 'GRE',
    50: 'ESP',
    89: 'OSPF',
  };
  return protocols[num] || `Protocol ${num}`;
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
