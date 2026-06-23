// ============================================================
// AegisBrain — Knowledge Graph (D3.js Force Layout)
// ============================================================

class KnowledgeGraph {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.svg = null;
        this.simulation = null;
    }

    init(data) {
        this.container.innerHTML = '';
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.svg = d3.select('#' + this.containerId)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, width, height]);

        // Background
        this.svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'transparent');

        // Zoom
        const g = this.svg.append('g');
        this.svg.call(d3.zoom().scaleExtent([0.3, 4]).on('zoom', (e) => {
            g.attr('transform', e.transform);
        }));

        // Simulation
        this.simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id).distance(140))
            .force('charge', d3.forceManyBody().strength(-350))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(50));

        // Links
        const link = g.append('g')
            .selectAll('line')
            .data(data.links)
            .join('line')
            .attr('stroke', 'rgba(255,255,255,0.08)')
            .attr('stroke-width', 1.5);

        // Link Labels
        const linkLabel = g.append('g')
            .selectAll('text')
            .data(data.links)
            .join('text')
            .attr('font-size', '9px')
            .attr('fill', 'rgba(255,255,255,0.3)')
            .attr('text-anchor', 'middle')
            .text(d => d.relation);

        // Node groups
        const nodeGroup = g.append('g')
            .selectAll('g')
            .data(data.nodes)
            .join('g')
            .call(this._drag(this.simulation))
            .on('click', (event, d) => this._onNodeClick(d, data))
            .style('cursor', 'pointer');

        // Node circles
        nodeGroup.append('circle')
            .attr('r', d => this._getRadius(d))
            .attr('fill', d => this._getColor(d))
            .attr('stroke', d => d.status === 'Warning' ? '#ef4444' : 'rgba(255,255,255,0.1)')
            .attr('stroke-width', d => d.status === 'Warning' ? 2.5 : 1)
            .style('filter', d => d.status === 'Warning' ? 'drop-shadow(0 0 6px rgba(239,68,68,0.5))' : 'none')
            .on('mouseover', function() {
                d3.select(this).transition().duration(200).attr('r', function() {
                    return +d3.select(this).attr('r') + 4;
                });
            })
            .on('mouseout', function(event, d) {
                d3.select(this).transition().duration(200).attr('r', () => {
                    const self = d3.select(this);
                    return +self.attr('r') - 4;
                });
            });

        // Node labels
        nodeGroup.append('text')
            .attr('font-size', '11px')
            .attr('font-weight', '500')
            .attr('fill', '#e2e8f0')
            .attr('dx', d => this._getRadius(d) + 8)
            .attr('dy', 4)
            .text(d => d.label);

        // Tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
            linkLabel
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2);
            nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    _getColor(node) {
        const map = {
            'Equipment': '#3b82f6',
            'Sensor': '#10b981',
            'Valve': '#8b5cf6',
            'Regulation': '#f59e0b',
            'Standard': '#f59e0b',
            'Procedure': '#06b6d4',
            'WorkOrder': '#64748b',
            'Inspection': '#64748b',
            'Permit': '#ef4444'
        };
        return map[node.type] || '#64748b';
    }

    _getRadius(node) {
        if (node.type === 'Equipment') return 22;
        if (node.type === 'Regulation' || node.type === 'Standard') return 16;
        return 14;
    }

    _drag(simulation) {
        return d3.drag()
            .on('start', (e) => { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
            .on('drag', (e) => { e.subject.fx = e.x; e.subject.fy = e.y; })
            .on('end', (e) => { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; });
    }

    _onNodeClick(nodeData, graphData) {
        const drawerEmpty = document.getElementById('drawer-empty');
        const drawerContent = document.getElementById('drawer-content');
        const drawerTitle = document.getElementById('drawer-title');
        const drawerType = document.getElementById('drawer-type');
        const drawerDesc = document.getElementById('drawer-desc');
        const drawerConnections = document.getElementById('drawer-connections');

        drawerEmpty.style.display = 'none';
        drawerContent.style.display = 'block';

        drawerTitle.textContent = nodeData.label;
        drawerType.textContent = nodeData.type + (nodeData.status ? ` • ${nodeData.status}` : '');
        drawerDesc.textContent = nodeData.desc || '';

        // Find connections
        const links = graphData.links.filter(l =>
            (l.source.id || l.source) === nodeData.id || (l.target.id || l.target) === nodeData.id
        );

        drawerConnections.innerHTML = '';
        links.forEach(l => {
            const otherId = (l.source.id || l.source) === nodeData.id ? (l.target.id || l.target) : (l.source.id || l.source);
            const otherNode = graphData.nodes.find(n => n.id === otherId);
            if (!otherNode) return;

            const li = document.createElement('li');
            li.className = 'connection-item';
            li.innerHTML = `<strong>${otherNode.label}</strong><span class="conn-relation">${l.relation}</span>`;
            drawerConnections.appendChild(li);
        });

        if (drawerConnections.children.length === 0) {
            drawerConnections.innerHTML = '<li class="connection-item">No direct connections found.</li>';
        }
    }
}
