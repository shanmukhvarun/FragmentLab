#!/usr/bin/env python3
"""
FragmentLab - IEEE-Style Project Report PDF Generator
Generates a professional project report for the FragmentLab project.
"""

from fpdf import FPDF
import os
import math
from datetime import datetime

class FragmentLabReport(FPDF):
    """Custom PDF class for FragmentLab IEEE-style report."""
    
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=25)
        # Colors
        self.DARK_BLUE = (15, 23, 42)
        self.INDIGO = (99, 102, 241)
        self.CYAN = (34, 211, 238)
        self.TEXT = (30, 41, 59)
        self.TEXT_LIGHT = (100, 116, 139)
        self.HEADER_BG = (241, 245, 249)
        self.TABLE_ALT = (248, 250, 252)
        self.ACCENT = (79, 70, 229)
        self.RED = (239, 68, 68)
        self.GREEN = (34, 197, 94)
        self.AMBER = (245, 158, 11)
        
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(*self.TEXT_LIGHT)
        self.cell(0, 8, 'FragmentLab - Interactive IP Fragmentation & MTU Discovery', 0, 0, 'L')
        self.cell(0, 8, f'Page {self.page_no()}', 0, 1, 'R')
        self.set_draw_color(*self.INDIGO)
        self.set_line_width(0.3)
        self.line(10, 14, 200, 14)
        self.ln(4)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 7)
        self.set_text_color(*self.TEXT_LIGHT)
        self.cell(0, 10, f'Chaitanya Bharathi Institute of Technology - Department of Information Technology', 0, 0, 'C')

    def title_page(self):
        """Create a professional title page."""
        self.add_page()
        self.set_auto_page_break(auto=False)
        
        # Top bar
        self.set_fill_color(*self.DARK_BLUE)
        self.rect(0, 0, 210, 50, 'F')
        
        # Accent line
        self.set_fill_color(*self.INDIGO)
        self.rect(0, 50, 210, 3, 'F')
        
        # Title block
        self.set_y(15)
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(255, 255, 255)
        self.cell(0, 8, 'CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY', 0, 1, 'C')
        self.set_font('Helvetica', '', 9)
        self.set_text_color(180, 190, 210)
        self.cell(0, 6, 'Department of Information Technology', 0, 1, 'C')
        self.cell(0, 6, 'Hyderabad, Telangana, India', 0, 1, 'C')
        
        # Project title
        self.set_y(75)
        self.set_font('Helvetica', 'B', 28)
        self.set_text_color(*self.DARK_BLUE)
        self.cell(0, 16, 'FragmentLab', 0, 1, 'C')
        
        self.set_font('Helvetica', '', 14)
        self.set_text_color(*self.TEXT)
        self.cell(0, 10, 'Interactive IP Fragmentation & MTU Discovery', 0, 1, 'C')
        
        # Decorative line
        self.set_draw_color(*self.INDIGO)
        self.set_line_width(1)
        self.line(60, 107, 150, 107)
        
        # Subtitle
        self.set_y(112)
        self.set_font('Helvetica', 'I', 11)
        self.set_text_color(*self.TEXT_LIGHT)
        self.cell(0, 8, 'A Web-Based Simulator for IPv4 Packet Fragmentation,', 0, 1, 'C')
        self.cell(0, 8, 'Reassembly, and Path MTU Discovery', 0, 1, 'C')
        
        # Project type box
        self.set_y(140)
        self.set_fill_color(*self.HEADER_BG)
        self.set_draw_color(*self.INDIGO)
        self.set_line_width(0.4)
        self.rect(40, 140, 130, 12, 'DF')
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*self.ACCENT)
        self.cell(0, 12, 'Computer Networks Laboratory Project', 0, 1, 'C')
        
        # Author info
        self.set_y(168)
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(*self.DARK_BLUE)
        self.cell(0, 8, 'Submitted By', 0, 1, 'C')
        
        self.set_font('Helvetica', '', 12)
        self.set_text_color(*self.TEXT)
        self.cell(0, 8, 'Veer Nala Shanmukhavarun', 0, 1, 'C')
        
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*self.TEXT_LIGHT)
        self.cell(0, 7, 'Department of Information Technology', 0, 1, 'C')
        self.cell(0, 7, 'Chaitanya Bharathi Institute of Technology', 0, 1, 'C')
        
        # Date
        self.set_y(215)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*self.TEXT_LIGHT)
        self.cell(0, 8, f'October 2026', 0, 1, 'C')
        
        # Bottom bar
        self.set_fill_color(*self.DARK_BLUE)
        self.rect(0, 280, 210, 17, 'F')
        self.set_y(282)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(160, 170, 190)
        self.cell(0, 8, 'IPv4 Fragmentation | RFC 791 | MTU | ICMP | Path MTU Discovery', 0, 1, 'C')
        self.set_auto_page_break(auto=True, margin=25)

    def section_header(self, number, title):
        """IEEE-style section header."""
        self.ln(4)
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(*self.DARK_BLUE)
        self.cell(0, 8, f'{number}. {title.upper()}', 0, 1, 'L')
        self.set_draw_color(*self.INDIGO)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 60, self.get_y())
        self.ln(3)

    def subsection_header(self, label, title):
        """IEEE-style subsection header."""
        self.ln(2)
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*self.ACCENT)
        self.cell(0, 7, f'{label} {title}', 0, 1, 'L')
        self.ln(1)

    def body_text(self, text):
        """Body text with proper formatting."""
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*self.TEXT)
        self.multi_cell(0, 5.5, text, 0, 'J')
        self.ln(2)

    def bullet_point(self, text, indent=15):
        """Bullet point."""
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.TEXT)
        self.set_x(10 + indent)
        self.cell(4, 5.5, '-', 0, 0)
        self.multi_cell(190 - indent - 4, 5.5, f' {text}', 0, 'J')
        self.ln(1)

    def code_block(self, code, width=190):
        """Formatted code block."""
        self.set_fill_color(30, 41, 59)
        self.set_text_color(226, 232, 240)
        self.set_font('Courier', '', 8)
        lines = code.split('\n')
        y_start = self.get_y()
        block_height = len(lines) * 4.5 + 6
        
        if self.get_y() + block_height > 270:
            self.add_page()
        
        self.rect(10, self.get_y(), width, block_height, 'F')
        self.set_xy(13, self.get_y() + 3)
        for line in lines:
            self.cell(0, 4.5, line, 0, 1)
            self.set_x(13)
        self.ln(4)
        self.set_text_color(*self.TEXT)

    def info_box(self, title, text, color=None):
        """Colored info box."""
        if color is None:
            color = self.INDIGO
        self.set_fill_color(color[0], color[1], color[2])
        self.rect(10, self.get_y(), 3, 20, 'F')
        self.set_fill_color(color[0], color[1], color[2])
        
        y = self.get_y()
        self.set_fill_color(248, 250, 252)
        self.rect(13, y, 187, 20, 'F')
        self.set_xy(16, y + 2)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(color[0], color[1], color[2])
        self.cell(0, 5, title, 0, 1)
        self.set_x(16)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(*self.TEXT)
        self.multi_cell(180, 4, text, 0, 'L')
        self.set_y(y + 22)
        self.ln(2)


def generate_report():
    pdf = FragmentLabReport()
    
    # ======================== TITLE PAGE ========================
    pdf.title_page()
    
    # ======================== ABSTRACT ========================
    pdf.add_page()
    pdf.section_header('I', 'Abstract')
    pdf.body_text(
        'Understanding how IP packets are fragmented and reassembled is fundamental to mastering computer '
        'networking. When a packet exceeds the Maximum Transmission Unit (MTU) of a network link, routers must '
        'fragment it into smaller pieces that fit within the link constraints. This process introduces header '
        'overhead, requires careful offset tracking, and demands successful reassembly at the destination. '
        'FragmentLab is an interactive, web-based simulator that provides hands-on visualization of IPv4 packet '
        'fragmentation, fragment reassembly, and Path MTU Discovery (PMTUD). Built with React and modern JavaScript, '
        'the application implements RFC 791 fragmentation calculations and allows users to configure packet sizes, '
        'IP header sizes, and MTU values for multiple network links. The simulator demonstrates core networking '
        'concepts including fragment offsets (in 8-byte units), the More Fragments (MF) flag, Identification field '
        'grouping, Don\'t Fragment (DF) behavior, ICMP Fragmentation Needed messages (Type 3, Code 4), and the '
        'iterative Path MTU Discovery process. A comparison mode enables side-by-side evaluation of three approaches: '
        'normal fragmentation, Don\'t Fragment packet dropping, and PMTUD. The tool also simulates lost fragments '
        'and failed reassembly scenarios, providing comprehensive coverage of fragmentation-related networking concepts.'
    )
    
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(*pdf.ACCENT)
    pdf.cell(0, 6, 'Keywords:', 0, 0)
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(*pdf.TEXT)
    pdf.cell(0, 6, ' IPv4 fragmentation, MTU, fragment offset, reassembly, ICMP, Path MTU Discovery, RFC 791, React', 0, 1)
    pdf.ln(4)
    
    # ======================== INTRODUCTION ========================
    pdf.section_header('II', 'Introduction')
    pdf.body_text(
        'The Internet Protocol version 4 (IPv4), defined in RFC 791, is the foundational protocol of the Internet. '
        'One of its key mechanisms is fragmentation - the ability to split a datagram into smaller fragments when '
        'the packet size exceeds the Maximum Transmission Unit (MTU) of a network link. While modern networks '
        'increasingly rely on Path MTU Discovery to avoid fragmentation altogether, understanding the fragmentation '
        'process remains essential for network engineers, security analysts, and students of computer networking.'
    )
    pdf.body_text(
        'FragmentLab addresses the gap in interactive networking education tools by providing a visual, hands-on '
        'simulator specifically focused on MTU constraints, fragmentation, and reassembly. Unlike generic packet-flow '
        'animation tools or route simulators, FragmentLab concentrates exclusively on how packets are sized, split '
        'into fragments, transmitted, and reconstructed - making it a targeted educational resource for these concepts.'
    )
    
    pdf.subsection_header('A.', 'Motivation')
    pdf.body_text(
        'Students and professionals learning about IP fragmentation often struggle to visualize how a large packet '
        'is broken down, what header fields change across fragments, and how the receiver reassembles the original '
        'datagram. Key concepts such as 8-byte offset alignment, the interaction between More Fragments (MF) and '
        'Don\'t Fragment (DF) flags, and the role of ICMP in Path MTU Discovery are difficult to grasp from '
        'textbooks alone. FragmentLab bridges this gap with interactive, real-time visualization.'
    )
    
    pdf.subsection_header('B.', 'Objectives')
    pdf.bullet_point('Implement accurate IPv4 fragmentation calculations following RFC 791 specifications')
    pdf.bullet_point('Visualize the fragmentation process with proportional packet and fragment bars')
    pdf.bullet_point('Display all relevant IPv4 header fields: fragment offsets, identification, MF/DF flags')
    pdf.bullet_point('Simulate multi-link fragmentation through paths with varying MTU sizes')
    pdf.bullet_point('Demonstrate reassembly with selectable lost fragment simulation')
    pdf.bullet_point('Compare three approaches: normal fragmentation, DF bit dropping, and Path MTU Discovery')
    pdf.bullet_point('Provide a PMTUD simulation showing ICMP Fragmentation Needed message flow')
    
    # ======================== BACKGROUND ========================
    pdf.add_page()
    pdf.section_header('III', 'Theoretical Background')
    
    pdf.subsection_header('A.', 'IPv4 Header Structure')
    pdf.body_text(
        'The IPv4 header is a minimum of 20 bytes (without options) and a maximum of 60 bytes (with options). '
        'Key fields relevant to fragmentation include:'
    )
    pdf.bullet_point('Total Length (16 bits): The total datagram size in bytes, including header and payload.')
    pdf.bullet_point('Identification (16 bits): A unique value assigned by the sender to identify fragments belonging to the same original datagram.')
    pdf.bullet_point('Flags (3 bits): Bit 0 is reserved. Bit 1 is Don\'t Fragment (DF). Bit 2 is More Fragments (MF).')
    pdf.bullet_point('Fragment Offset (13 bits): The offset of the fragment\'s payload relative to the beginning of the original datagram, measured in 8-byte units.')
    pdf.bullet_point('Time to Live (TTL): Decremented at each hop; prevents infinite routing loops.')
    pdf.bullet_point('Protocol (8 bits): Identifies the upper-layer protocol (TCP=6, UDP=17, ICMP=1).')

    pdf.subsection_header('B.', 'Maximum Transmission Unit (MTU)')
    pdf.body_text(
        'The MTU is the largest packet size (in bytes) that a network link can transmit in a single frame. '
        'Common MTU values include: Ethernet (1500 bytes), PPPoE (1492 bytes), VPN tunnels (1300-1400 bytes), '
        'and Jumbo Frames (9000 bytes). When a router receives a packet larger than the outgoing link\'s MTU, '
        'it must either fragment the packet or drop it (if the DF bit is set).'
    )
    
    pdf.subsection_header('C.', 'IPv4 Fragmentation Process')
    pdf.body_text(
        'When a router must fragment a packet, it performs the following steps:\n\n'
        '1. Calculate the maximum payload per fragment: floor((MTU - header_size) / 8) x 8 bytes. '
        'The payload must be a multiple of 8 bytes (except for the last fragment).\n\n'
        '2. Copy the IP header to each fragment, updating: Total Length, Fragment Offset, and the More Fragments (MF) flag.\n\n'
        '3. The Identification field is copied unchanged to all fragments, enabling the receiver to group them.\n\n'
        '4. Each fragment except the last has MF=1. The last fragment has MF=0 (or inherits the original MF value).\n\n'
        '5. Fragment offsets are expressed in 8-byte units in the IP header field.'
    )
    
    pdf.subsection_header('D.', 'Fragment Reassembly')
    pdf.body_text(
        'The destination host reassembles fragments using the Identification field to group related fragments, '
        'the Fragment Offset to order them, and the MF flag to detect the final fragment. If any fragment is lost, '
        'reassembly fails and the entire datagram must be retransmitted. This is a significant vulnerability - '
        'the loss of a single fragment wastes the bandwidth consumed by all other fragments.'
    )
    
    pdf.subsection_header('E.', 'Path MTU Discovery (PMTUD)')
    pdf.body_text(
        'Path MTU Discovery (RFC 1191) is a technique to determine the smallest MTU along a network path without '
        'actually fragmenting packets. The process works as follows:\n\n'
        '1. The sender sets the Don\'t Fragment (DF) bit on all outgoing packets.\n\n'
        '2. If a router cannot forward the packet without fragmentation, it drops the packet and sends an ICMP '
        '"Destination Unreachable - Fragmentation Needed and DF Set" message (Type 3, Code 4) back to the sender.\n\n'
        '3. The ICMP message includes the Next-Hop MTU of the link that caused the failure.\n\n'
        '4. The sender reduces its packet size to match the reported MTU and retransmits.\n\n'
        '5. This process repeats until the packet can traverse the entire path without fragmentation.'
    )
    
    # ======================== SYSTEM DESIGN ========================
    pdf.add_page()
    pdf.section_header('IV', 'System Design & Architecture')
    
    pdf.subsection_header('A.', 'Technology Stack')
    pdf.body_text('FragmentLab is built using the following technologies:')
    pdf.bullet_point('Frontend Framework: React 19 with Vite 8 build tool')
    pdf.bullet_point('Language: JavaScript (ES2022+) with JSX syntax')
    pdf.bullet_point('Styling: Vanilla CSS with CSS custom properties (design tokens)')
    pdf.bullet_point('Typography: Inter (sans-serif) and JetBrains Mono (monospace) from Google Fonts')
    pdf.bullet_point('Visualization: HTML/CSS-based proportional bar charts and SVG network path diagrams')
    pdf.bullet_point('Build: Vite development server with Hot Module Replacement (HMR)')
    
    pdf.subsection_header('B.', 'Project Structure')
    pdf.code_block(
        'fragmentlab/\n'
        '  index.html              # Entry point with Google Fonts\n'
        '  package.json            # Dependencies and scripts\n'
        '  vite.config.js          # Vite configuration\n'
        '  src/\n'
        '    main.jsx              # React DOM render entry\n'
        '    index.css             # Global design system (700+ lines)\n'
        '    App.jsx               # Main app with state management\n'
        '    engine/\n'
        '      fragmentation.js    # Core fragmentation engine (RFC 791)\n'
        '    components/\n'
        '      ConfigPanel.jsx     # Packet & link configuration UI\n'
        '      PacketVisualizer.jsx # Visual fragment bars & MTU markers\n'
        '      FragmentTable.jsx   # Detailed fragment header table\n'
        '      ReassemblyView.jsx  # Reassembly simulation with lost frags\n'
        '      ComparisonMode.jsx  # Side-by-side approach comparison\n'
        '      PMTUDView.jsx       # Path MTU Discovery visualization\n'
        '      StatsBar.jsx        # Summary statistics dashboard'
    )
    
    pdf.subsection_header('C.', 'Core Engine: fragmentation.js')
    pdf.body_text(
        'The fragmentation engine implements the following core functions:'
    )
    pdf.bullet_point('createPacket(): Creates an IPv4 packet object with configurable totalSize, headerSize, protocol, TTL, DF bit, and source/destination IPs.')
    pdf.bullet_point('fragmentPacket(packet, mtu): Fragments a single packet based on the given MTU. Calculates 8-byte-aligned payload sizes, fragment offsets, and MF flags. Returns fragments or ICMP error if DF is set.')
    pdf.bullet_point('fragmentThroughPath(packet, links): Iteratively fragments packets through multiple links with different MTUs, tracking the fragmentation state at each hop.')
    pdf.bullet_point('reassembleFragments(fragments, lostIndices): Simulates reassembly by checking for gaps, ordering by offset, and verifying the presence of the final fragment (MF=0).')
    pdf.bullet_point('simulatePMTUD(packet, links): Simulates Path MTU Discovery by iterating through links, detecting oversized packets, generating ICMP messages, and discovering the path MTU.')
    
    pdf.subsection_header('D.', 'Fragmentation Algorithm')
    pdf.body_text('The core fragmentation algorithm (RFC 791 compliant):')
    pdf.code_block(
        'function fragmentPacket(packet, mtu) {\n'
        '  // Max payload per fragment (must be multiple of 8)\n'
        '  maxPayload = floor((mtu - headerSize) / 8) * 8;\n'
        '  \n'
        '  remainingPayload = packet.payloadSize;\n'
        '  currentOffset = 0;  // in bytes\n'
        '  \n'
        '  while (remainingPayload > 0) {\n'
        '    isLast = remainingPayload <= maxPayload;\n'
        '    fragPayload = isLast ? remainingPayload : maxPayload;\n'
        '    \n'
        '    fragment = {\n'
        '      totalSize: fragPayload + headerSize,\n'
        '      fragmentOffset: currentOffset,\n'
        '      offsetField: currentOffset / 8,  // 8-byte units\n'
        '      moreFragments: !isLast,\n'
        '      identification: packet.identification\n'
        '    };\n'
        '    \n'
        '    currentOffset += fragPayload;\n'
        '    remainingPayload -= fragPayload;\n'
        '  }\n'
        '}'
    )
    
    # ======================== DEMO SCENARIO ========================
    pdf.add_page()
    pdf.section_header('V', 'Demo Scenario: 4000-Byte Packet')
    
    pdf.info_box(
        'Demo Configuration',
        'Packet: 4,000 bytes (20B header + 3,980B payload)  |  Link: Ethernet  |  MTU: 1,500 bytes  |  Protocol: TCP',
        pdf.INDIGO
    )
    
    pdf.subsection_header('A.', 'Fragmentation Calculation')
    pdf.body_text(
        'Given a 4,000-byte IPv4 packet (20-byte header + 3,980-byte payload) traversing an Ethernet link '
        'with a 1,500-byte MTU:\n\n'
        '1. Maximum payload per fragment = floor((1500 - 20) / 8) x 8 = floor(1480 / 8) x 8 = 185 x 8 = 1,480 bytes\n\n'
        '2. Number of fragments = ceil(3980 / 1480) = ceil(2.689) = 3 fragments'
    )
    
    pdf.subsection_header('B.', 'Fragment Details')
    
    # Fragment table
    pdf.set_font('Helvetica', 'B', 8)
    col_widths = [15, 22, 22, 22, 30, 28, 22, 18]
    headers = ['#', 'Total (B)', 'Header (B)', 'Payload (B)', 'Identification', 'Offset (B)', 'Offset Field', 'MF']
    
    pdf.set_fill_color(*pdf.DARK_BLUE)
    pdf.set_text_color(255, 255, 255)
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], 7, h, 1, 0, 'C', True)
    pdf.ln()
    
    fragments = [
        ['0', '1500', '20', '1480', '0x0001', '0', '0', 'MF=1'],
        ['1', '1500', '20', '1480', '0x0001', '1480', '185', 'MF=1'],
        ['2', '1040', '20', '1020', '0x0001', '2960', '370', 'MF=0'],
    ]
    
    pdf.set_font('Courier', '', 8)
    for idx, row in enumerate(fragments):
        if idx % 2 == 0:
            pdf.set_fill_color(*pdf.TABLE_ALT)
        else:
            pdf.set_fill_color(255, 255, 255)
        
        for i, val in enumerate(row):
            if i == 4:  # Identification
                pdf.set_text_color(*pdf.AMBER)
            elif i == 5 or i == 6:  # Offset
                pdf.set_text_color(*pdf.CYAN)
            elif i == 7:  # MF flag
                if 'MF=1' in val:
                    pdf.set_text_color(*pdf.AMBER)
                else:
                    pdf.set_text_color(*pdf.GREEN)
            else:
                pdf.set_text_color(*pdf.TEXT)
            pdf.cell(col_widths[i], 6, val, 1, 0, 'C', True)
        pdf.ln()
    
    pdf.ln(4)
    pdf.set_text_color(*pdf.TEXT)
    
    pdf.subsection_header('C.', 'Analysis')
    pdf.body_text(
        'Key observations from the demo scenario:\n\n'
        '1. Header Overhead: The original packet had one 20-byte header. After fragmentation, three headers '
        'are transmitted (3 x 20 = 60 bytes), adding 40 bytes of overhead.\n\n'
        '2. Total Bytes Transmitted: 1500 + 1500 + 1040 = 4,040 bytes vs. the original 4,000 bytes.\n\n'
        '3. Fragment Offset Alignment: All offsets are multiples of 8 (0, 1480, 2960). The offset field '
        'stores values in 8-byte units (0, 185, 370).\n\n'
        '4. More Fragments Flag: Fragments #0 and #1 have MF=1. Fragment #2 (the last) has MF=0, '
        'signaling the end of the fragment chain.\n\n'
        '5. Identification: All three fragments share the same Identification value (0x0001), allowing '
        'the receiver to group them for reassembly.'
    )
    
    # ======================== FEATURES ========================
    pdf.add_page()
    pdf.section_header('VI', 'Application Features')
    
    pdf.subsection_header('A.', 'Fragmentation Mode')
    pdf.body_text(
        'The primary mode of FragmentLab. Users configure:\n'
        '- Total Packet Size (68 - 65,535 bytes) via slider and numeric input\n'
        '- IP Header Size (20 - 60 bytes, in 4-byte increments for IP options)\n'
        '- Don\'t Fragment (DF) bit toggle\n'
        '- Protocol selection (TCP, UDP, ICMP, GRE)\n'
        '- TTL value (1 - 255)\n'
        '- Multiple network links with configurable names and MTUs\n\n'
        'The visualization shows the original packet as a proportional bar (header + payload), a red MTU '
        'marker line, and each resulting fragment with its own header/payload bar, offset, and MF flag. '
        'A detailed table displays all IPv4 header fields for each fragment.'
    )
    
    pdf.subsection_header('B.', 'Reassembly Simulation Mode')
    pdf.body_text(
        'This mode allows users to simulate the reassembly process at the destination. Fragment chips are '
        'displayed below the visualization - clicking a chip marks that fragment as "lost." The reassembly '
        'buffer visualizes which portions of the original payload have been received (colored segments) and '
        'which are missing (hatched gaps). Statistics show received/total fragments, bytes received, and gap '
        'count. If any fragment is missing, the reassembly fails with a descriptive error message.'
    )
    
    pdf.subsection_header('C.', 'Comparison Mode')
    pdf.body_text(
        'Side-by-side comparison of three approaches to handling oversized packets:\n\n'
        '1. Normal Fragmentation (DF=0): The router fragments the packet. Shows fragment count, total bytes '
        'transmitted, and header overhead.\n\n'
        '2. Don\'t Fragment (DF=1): The router drops the packet and sends ICMP Type 3, Code 4. Shows the ICMP '
        'message details and reported Next-Hop MTU.\n\n'
        '3. Path MTU Discovery: The sender iteratively discovers the path MTU using DF+ICMP feedback. Shows '
        'the discovered path MTU, adjusted packet size, and number of ICMP messages received.'
    )
    
    pdf.subsection_header('D.', 'Path MTU Discovery (PMTUD) Mode')
    pdf.body_text(
        'A dedicated visualization of the PMTUD process. Features include:\n'
        '- An SVG network path diagram showing source, each link (with MTU labels), and destination\n'
        '- Bottleneck link detection and highlighting\n'
        '- Step-by-step discovery process with ICMP message details\n'
        '- Summary statistics (original size, path MTU, ICMP messages, link count)\n'
        '- Educational explanation of how PMTUD works'
    )

    pdf.subsection_header('E.', 'Multi-Hop Fragmentation')
    pdf.body_text(
        'Users can add multiple network links with different MTUs to simulate real-world paths. For example, '
        'a path through Ethernet (MTU 1500) -> VPN Tunnel (MTU 1300) -> PPPoE (MTU 1492) demonstrates how '
        'fragments may be re-fragmented at intermediate hops, progressively increasing the fragment count and '
        'header overhead.'
    )
    
    # ======================== NETWORKING CONCEPTS ========================
    pdf.add_page()
    pdf.section_header('VII', 'Networking Concepts Covered')
    
    concepts = [
        ('IPv4 Header Fields', 'Total Length, Identification, Flags (DF, MF), Fragment Offset, TTL, Protocol, Source/Destination IP addresses.'),
        ('Maximum Transmission Unit', 'The largest packet size a link can carry. Ethernet = 1500B, PPPoE = 1492B, VPN tunnels = 1300-1400B.'),
        ('Fragmentation', 'The process of splitting an oversized datagram into smaller fragments, each with its own IP header copy.'),
        ('Fragment Offset', 'Expressed in 8-byte units. Tells the receiver where each fragment\'s payload fits in the original datagram.'),
        ('More Fragments Flag', 'MF=1 indicates more fragments follow. MF=0 on the last fragment signals the end of the chain.'),
        ('Don\'t Fragment Flag', 'DF=1 instructs routers not to fragment. If the packet exceeds MTU, it is dropped.'),
        ('Identification Field', 'A 16-bit value set by the sender to group fragments belonging to the same original datagram.'),
        ('Reassembly', 'The destination host collects fragments (using Identification), orders them (using Offset), and reconstructs the datagram.'),
        ('ICMP Type 3, Code 4', '"Fragmentation Needed and DF Set" - sent by a router when it cannot fragment a packet with DF=1. Includes Next-Hop MTU.'),
        ('Path MTU Discovery', 'RFC 1191. Uses DF bit + ICMP feedback to find the smallest MTU along a path, avoiding fragmentation entirely.'),
        ('Header Overhead', 'Each fragment carries a copy of the IP header. N fragments produce (N-1) x header_size bytes of overhead.'),
    ]
    
    for concept, desc in concepts:
        pdf.set_font('Helvetica', 'B', 9)
        pdf.set_text_color(*pdf.ACCENT)
        pdf.cell(55, 5.5, f'  {concept}:', 0, 0)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(*pdf.TEXT)
        pdf.multi_cell(0, 5.5, desc, 0, 'J')
        pdf.ln(1.5)
    
    # ======================== IMPLEMENTATION ========================
    pdf.add_page()
    pdf.section_header('VIII', 'Implementation Details')
    
    pdf.subsection_header('A.', 'Fragmentation Engine')
    pdf.body_text(
        'The fragmentation engine (fragmentation.js) is a pure JavaScript module with no external dependencies. '
        'It exports six core functions: createPacket, fragmentPacket, fragmentThroughPath, reassembleFragments, '
        'simulatePMTUD, and getDemoScenario. The engine handles edge cases including:\n'
        '- MTU too small for even one payload byte (minimum = header_size + 8)\n'
        '- Packets that already fit within the MTU (no fragmentation needed)\n'
        '- DF bit set with oversized packets (ICMP error generation)\n'
        '- Multi-level fragmentation across multiple links\n'
        '- Gap detection and reassembly failure on lost fragments'
    )
    
    pdf.subsection_header('B.', 'State Management')
    pdf.body_text(
        'The application uses React hooks (useState, useCallback, useMemo) for state management. The configuration '
        'state includes packet parameters, link definitions, and lost fragment selections. All simulation results '
        'are derived via useMemo, automatically recomputing when the configuration changes. This reactive approach '
        'provides instant visual feedback as users adjust parameters.'
    )
    
    pdf.subsection_header('C.', 'Visual Design')
    pdf.body_text(
        'FragmentLab uses a dark-mode, cyberpunk-inspired design with:\n'
        '- A deep space color palette with indigo, violet, and cyan accents\n'
        '- Glassmorphism-style cards with backdrop-filter blur and translucent borders\n'
        '- Proportional bar charts for packet/fragment size visualization\n'
        '- SVG-based network path diagrams for PMTUD\n'
        '- Smooth CSS animations (fadeInUp, slideIn) with staggered delays\n'
        '- Monospace (JetBrains Mono) typography for numeric and code values\n'
        '- Status badges with color-coded states (success, error, warning, info)'
    )
    
    pdf.subsection_header('D.', 'Key Design Decisions')
    pdf.bullet_point('8-byte alignment enforcement: Payload sizes are rounded down to the nearest 8-byte multiple using floor((mtu - headerSize) / 8) * 8, matching RFC 791 requirements.')
    pdf.bullet_point('Dual offset display: The fragment table shows both byte offsets (human-readable) and field values (divided by 8, as stored in the IP header).')
    pdf.bullet_point('Proportional visualization: Fragment bars are scaled proportionally to packet sizes, providing an intuitive sense of relative sizes.')
    pdf.bullet_point('Lost fragment simulation: Uses array index tracking rather than modifying fragment objects, allowing instant toggling without re-running the fragmentation engine.')
    
    # ======================== RESULTS ========================
    pdf.add_page()
    pdf.section_header('IX', 'Results & Observations')
    
    pdf.subsection_header('A.', 'Demo Scenario Results')
    pdf.body_text(
        'The default demo scenario (4,000-byte packet, 1,500-byte MTU) produces 3 fragments with total '
        'transmitted bytes of 4,040 (1.0% overhead). The fragmentation correctly calculates 1,480-byte '
        'payloads for the first two fragments and a 1,020-byte payload for the last fragment.'
    )
    
    pdf.subsection_header('B.', 'Multi-Hop Scenario Results')
    
    # Multi-hop table
    pdf.set_font('Helvetica', 'B', 8)
    mh_widths = [40, 25, 30, 30, 30]
    mh_headers = ['Link', 'MTU (B)', 'Input Frags', 'Output Frags', 'Re-fragmented']
    
    pdf.set_fill_color(*pdf.DARK_BLUE)
    pdf.set_text_color(255, 255, 255)
    for i, h in enumerate(mh_headers):
        pdf.cell(mh_widths[i], 7, h, 1, 0, 'C', True)
    pdf.ln()
    
    mh_data = [
        ['Ethernet', '1500', '1', '3', 'Yes'],
        ['VPN Tunnel', '1300', '3', '4', 'Yes'],
        ['PPPoE', '1492', '4', '4', 'No'],
    ]
    
    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(*pdf.TEXT)
    for idx, row in enumerate(mh_data):
        if idx % 2 == 0:
            pdf.set_fill_color(*pdf.TABLE_ALT)
        else:
            pdf.set_fill_color(255, 255, 255)
        for i, val in enumerate(row):
            pdf.cell(mh_widths[i], 6, val, 1, 0, 'C', True)
        pdf.ln()
    
    pdf.ln(4)
    
    pdf.body_text(
        'The multi-hop scenario demonstrates cascading fragmentation: the initial 4,000-byte packet is first '
        'fragmented into 3 pieces at the Ethernet link (MTU 1500), then re-fragmented to 4 pieces at the '
        'VPN Tunnel (MTU 1300). The PPPoE link (MTU 1492) does not cause further fragmentation since all '
        'fragments already fit within its MTU. This scenario illustrates how header overhead compounds with '
        'each fragmentation stage.'
    )
    
    pdf.subsection_header('C.', 'Overhead Analysis')
    pdf.body_text(
        'Fragmentation overhead grows linearly with the number of fragments. For a 20-byte IP header:\n'
        '- 3 fragments: +40 bytes overhead (2 extra headers)\n'
        '- 4 fragments: +60 bytes overhead (3 extra headers)\n'
        '- 10 fragments: +180 bytes overhead (9 extra headers)\n\n'
        'With IP options (60-byte header), overhead increases proportionally. This demonstrates why Path MTU '
        'Discovery is preferred in production networks - it eliminates fragmentation overhead entirely.'
    )
    
    pdf.subsection_header('D.', 'Reassembly Failure Scenario')
    pdf.body_text(
        'When Fragment #1 (middle fragment, 1,480 bytes of payload at offset 1480) is marked as lost, '
        'the reassembly buffer shows a gap from byte 1480 to byte 2960. The system reports: "Reassembly '
        'failed: 1 gap(s) detected in fragment stream. Missing 1480 bytes." This demonstrates that the loss '
        'of a single fragment invalidates all other fragments, wasting significant bandwidth.'
    )
    
    # ======================== HOW TO RUN ========================
    pdf.add_page()
    pdf.section_header('X', 'How to Run')
    
    pdf.body_text('Prerequisites: Node.js (v18+) and npm installed on the system.')
    
    pdf.code_block(
        '# Navigate to the project directory\n'
        'cd ~/Desktop/fragmentlab\n'
        '\n'
        '# Install dependencies (only needed once)\n'
        'npm install\n'
        '\n'
        '# Start the development server\n'
        'npm run dev\n'
        '\n'
        '# Open in browser\n'
        '# http://localhost:5173/'
    )
    
    pdf.body_text(
        'The application will start on port 5173 by default. Navigate to http://localhost:5173/ in a modern '
        'web browser (Chrome, Firefox, Safari, or Edge). The demo scenario is pre-loaded. Click "Demo" for '
        'the single-link scenario or "Multi-Hop" for the multi-link scenario.'
    )
    
    # ======================== CONCLUSION ========================
    pdf.section_header('XI', 'Conclusion')
    pdf.body_text(
        'FragmentLab successfully provides an interactive, educational tool for understanding IPv4 packet '
        'fragmentation, reassembly, and Path MTU Discovery. The application implements RFC 791 fragmentation '
        'calculations with 8-byte offset alignment, proper MF/DF flag handling, and ICMP message generation. '
        'Four distinct modes - Fragmentation, Reassembly, Compare, and PMTUD - cover the complete lifecycle '
        'of packet fragmentation from initial split to final reassembly.\n\n'
        'The multi-link fragmentation capability demonstrates real-world scenarios where packets traverse paths '
        'with varying MTU constraints, and the lost fragment simulation effectively illustrates the fragility '
        'of IP-layer fragmentation. The comparison mode clearly shows why modern networks prefer Path MTU '
        'Discovery over traditional fragmentation.\n\n'
        'Key accomplishments:\n'
        '- Accurate RFC 791 fragmentation with configurable packet sizes, headers, and MTUs\n'
        '- Real-time visualization with proportional fragment bars and detailed header field table\n'
        '- Multi-link cascading fragmentation through heterogeneous network paths\n'
        '- Interactive reassembly simulation with selectable fragment loss\n'
        '- Three-way comparison of fragmentation, DF dropping, and PMTUD\n'
        '- SVG network path diagram with bottleneck detection\n'
        '- Professional dark-mode UI with glassmorphism design'
    )
    
    # ======================== REFERENCES ========================
    pdf.section_header('XII', 'References')
    
    refs = [
        '[1] J. Postel, "Internet Protocol," RFC 791, DARPA, September 1981.',
        '[2] J. Mogul and S. Deering, "Path MTU Discovery," RFC 1191, IETF, November 1990.',
        '[3] J. Postel, "Internet Control Message Protocol," RFC 792, ISI, September 1981.',
        '[4] A. S. Tanenbaum and D. J. Wetherall, Computer Networks, 5th ed. Pearson, 2011.',
        '[5] J. F. Kurose and K. W. Ross, Computer Networking: A Top-Down Approach, 8th ed. Pearson, 2021.',
        '[6] W. R. Stevens, TCP/IP Illustrated, Volume 1: The Protocols, 2nd ed. Addison-Wesley, 2011.',
        '[7] React Documentation, "React 19," https://react.dev/, accessed October 2026.',
        '[8] Vite Documentation, "Vite 8," https://vite.dev/, accessed October 2026.',
    ]
    
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(*pdf.TEXT)
    for ref in refs:
        pdf.multi_cell(0, 5, ref, 0, 'L')
        pdf.ln(1.5)
    
    # ======================== SAVE ========================
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'FragmentLab_Report.pdf')
    pdf.output(output_path)
    print(f'\n✅ Report generated successfully!')
    print(f'📄 Location: {output_path}')
    print(f'📊 Pages: {pdf.page_no()}')
    return output_path


if __name__ == '__main__':
    generate_report()
