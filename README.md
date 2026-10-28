# 🌐 FragmentLab — Interactive IP Fragmentation & MTU Discovery

An interactive, browser-based Computer Networks learning tool that visualizes IPv4 packet fragmentation, fragment reassembly, and Path MTU Discovery (PMTUD). FragmentLab transforms complex networking concepts into intuitive visual simulations, helping students understand how packet sizes, link MTUs, fragment offsets, and IP header flags affect packet delivery.

## ✨ Overview

In computer networks, a packet may exceed the Maximum Transmission Unit (MTU) of a network link. IPv4 fragmentation allows oversized datagrams to be divided into smaller fragments that can traverse links with lower MTUs.

Understanding this process involves several related concepts, including fragment offsets, the More Fragments (MF) flag, the Don't Fragment (DF) flag, header overhead, reassembly, and ICMP feedback.

**FragmentLab brings these concepts together in one interactive learning environment**, allowing users to configure packets, simulate different network paths, inspect fragmentation results, and explore what happens when fragments are lost or a packet cannot be fragmented.

## 🚀 Key Features

### 1. 📦 Interactive IPv4 Fragmentation

- Configure the total packet size and IPv4 header size.
- Select the transport or encapsulated protocol used in the simulation, such as TCP, UDP, ICMP, or GRE.
- Configure the TTL and Don't Fragment (DF) flag.
- Visualize the original packet and the fragments produced for a selected MTU.
- Inspect fragment sizes, payload lengths, offsets, and MF flag values.
- View detailed IPv4 header information for each fragment.

### 2. 🔗 Multi-Hop Network Simulation

- Build a network path containing multiple links.
- Configure a different MTU for each link.
- Observe how packets and fragments move through successive links.
- Understand how smaller MTUs can trigger further fragmentation.
- Visualize the relationship between bottleneck links and packet sizes.
- Track the additional header overhead introduced by fragmentation.

### 3. 🧩 Fragment Reassembly Simulation

- Examine how fragments are reconstructed at the destination.
- Select individual fragments to simulate packet loss.
- Visualize received payload regions and missing portions.
- Track received fragments, total fragments, bytes received, and gaps.
- Observe why an incomplete set of fragments prevents successful reconstruction of the original datagram.

### 4. ⚖️ Fragmentation Comparison Mode

Compare three approaches to handling packets that exceed a link's MTU:

- **Normal Fragmentation:** The packet is divided into smaller fragments when fragmentation is permitted.
- **Don't Fragment (DF):** An oversized packet is dropped when fragmentation is prohibited, with the simulation illustrating the corresponding ICMP feedback.
- **Path MTU Discovery (PMTUD):** The sender discovers a suitable packet size using MTU information and ICMP feedback.

The comparison highlights fragment count, transmitted bytes, header overhead, and the consequences of each approach.

### 5. 🧭 Path MTU Discovery (PMTUD)

- Visualize the source, intermediate links, and destination.
- Display MTU values along the network path.
- Identify the bottleneck link and its MTU.
- Follow the discovery process step by step.
- Inspect simulated ICMP feedback and packet-size adjustments.
- Understand how PMTUD can help avoid repeated fragmentation.

### 6. 📊 Visual Analytics

- Proportional packet and fragment bars.
- MTU threshold markers.
- Detailed fragment-header tables.
- Network path diagrams.
- Summary statistics for fragmentation and reassembly.
- A dark-themed interface designed for clear technical visualization.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19 |
| Language | JavaScript (ES2022+) and JSX |
| Styling | CSS3 and CSS custom properties |
| Build Tool | Vite 8 |
| Visualization | HTML, CSS, and SVG |
| Package Management | npm |

## 🧠 Networking Concepts Demonstrated

FragmentLab provides practical demonstrations of:

- IPv4 datagram structure and header fields.
- Maximum Transmission Unit (MTU).
- IPv4 packet fragmentation.
- Fragment Identification and Total Length.
- Fragment Offset and its 8-byte units.
- More Fragments (MF) and Don't Fragment (DF) flags.
- Fragment reassembly and packet loss.
- ICMP Destination Unreachable — Fragmentation Needed feedback.
- Path MTU Discovery.
- Multi-hop paths with heterogeneous MTUs.
- Fragmentation overhead and bottleneck links.

## ⚙️ Getting Started

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's dependencies.
- npm — included with Node.js.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/shanmukhvarun/FragmentLab.git
```

**2. Navigate to the project directory**

```bash
cd FragmentLab
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Open the local URL printed in your terminal by Vite, commonly:

```text
http://localhost:5173
```

### Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🏗️ Project Structure

```text
FragmentLab/
├── public/                  # Static assets
├── src/
│   ├── engine/
│   │   └── fragmentation.js # Core fragmentation calculations
│   ├── components/
│   │   ├── ConfigPanel.jsx
│   │   ├── PacketVisualizer.jsx
│   │   ├── FragmentTable.jsx
│   │   ├── ReassemblyView.jsx
│   │   ├── ComparisonMode.jsx
│   │   ├── PMTUDView.jsx
│   │   └── StatsBar.jsx
│   ├── App.jsx               # Main application
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── FragmentLab_Report.pdf
└── README.md
```

## 🧪 Example Scenario

Consider an IPv4 datagram with a total length of **4,000 bytes**, an IPv4 header of **20 bytes**, and an outgoing link with an MTU of **1,500 bytes**.

The maximum payload in each non-final fragment is:

```text
floor((1500 - 20) / 8) × 8 = 1472 bytes
```

The original payload is 3,980 bytes. The simulator divides it into payloads of 1,472 bytes, 1,472 bytes, and 1,036 bytes.

| Fragment | Payload | Total Length | Offset Field | MF |
|---|---:|---:|---:|---:|
| 1 | 1,472 B | 1,492 B | 0 | 1 |
| 2 | 1,472 B | 1,492 B | 184 | 1 |
| 3 | 1,036 B | 1,056 B | 368 | 0 |

*This is an illustrative calculation for a 20-byte header and a 1,500-byte MTU. The offset field is measured in 8-byte units, and MF indicates whether additional fragments follow.*

FragmentLab lets users explore this type of calculation interactively and examine the resulting headers and packet visualizations.

## 🎯 Applications

- Computer Networks laboratory demonstrations.
- Understanding IPv4 fragmentation and MTU constraints.
- Practising fragment-offset and header-flag calculations.
- Learning destination-side reassembly and packet-loss behavior.
- Comparing fragmentation with Path MTU Discovery.
- Visualizing packet behavior across links with different MTUs.

## 🔮 Future Enhancements

Potential improvements include:

- IPv6 fragmentation and comparison with IPv4.
- Downloadable fragmentation tables and simulation traces.
- Guided exercises and interactive quizzes.
- Step-by-step playback of fragmentation and PMTUD events.
- Saving and loading custom network-path scenarios.
- More detailed reassembly timeout and incomplete-fragment scenarios.
- Improved accessibility and mobile responsiveness.

## ⚠️ Scope and Limitations

FragmentLab is an **educational simulator**, not a packet-capturing or packet-forwarding tool.

- It models fragmentation, reassembly, and PMTUD behavior in the browser.
- It does not transmit actual fragmented IP packets or send real ICMP messages.
- It focuses on IPv4 rather than implementing IPv6 fragmentation.
- Its results reflect the assumptions and behaviors implemented in the simulation.

## 📚 References

1. J. Postel, [RFC 791 — Internet Protocol](https://www.rfc-editor.org/rfc/rfc791).
2. J. Mogul and S. Deering, [RFC 1191 — Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).
3. J. Postel, [RFC 792 — Internet Control Message Protocol](https://www.rfc-editor.org/rfc/rfc792).
4. A. S. Tanenbaum and D. J. Wetherall, *Computer Networks*, 5th Edition.
5. J. F. Kurose and K. W. Ross, *Computer Networking: A Top-Down Approach*, 8th Edition.
6. [React Documentation](https://react.dev/).
7. [Vite Documentation](https://vite.dev/).

## 👨‍💻 Project Information

**Project:** FragmentLab — Interactive IP Fragmentation & MTU Discovery

**Domain:** Computer Networks

**Institution:** Chaitanya Bharathi Institute of Technology (CBIT), Department of Information Technology

**Repository:** [shanmukhvarun/FragmentLab](https://github.com/shanmukhvarun/FragmentLab)

---

*FragmentLab — Visualizing the journey of an IP packet, one fragment at a time.*
