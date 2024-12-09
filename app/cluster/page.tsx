'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import * as d3 from 'd3';

interface Cluster {
    mainKeyword: string;
    relatedKeywords: string[];
}

const ClusterPage: NextPage = () => {
    return <></>
    // const [phrase, setPhrase] = useState('');
    // const [xValue, setXValue] = useState(5);
    // const [nValue, setNValue] = useState(3);
    // const [clusters, setClusters] = useState<Cluster[]>([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    // const svgRef = useRef<SVGSVGElement>(null);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await fetch('/api/clusterAnalysis', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ phrase, xValue, nValue }),
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch clusters');
    //         }
    //         const data = await response.json();
    //         setClusters(data.clusters);
    //     } catch (error) {
    //         console.error('Error fetching clusters:', error);
    //         setError('An error occurred while fetching clusters. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (clusters.length > 0 && svgRef.current) {
    //         visualizeClusters();
    //     }
    // }, [clusters]);

    // const visualizeClusters = () => {
    //     const svg = d3.select(svgRef.current);
    //     svg.selectAll("*").remove();

    //     const width = 800;
    //     const height = 600;
    //     const padding = 50;

    //     const color = d3.scaleOrdinal(d3.schemeCategory10);

    //     // Create a pack layout
    //     const pack = d3.pack<Cluster>()
    //         .size([width - padding * 2, height - padding * 2])
    //         .padding(20);

    //     // Create a hierarchy from the clusters
    //     const root = d3.hierarchy({ children: clusters } as any)
    //         .sum(d => (d as any).relatedKeywords ? (d as any).relatedKeywords.length + 1 : 0);

    //     // Generate the pack layout
    //     const packedData = pack(root);

    //     // Create a group for the zoomable area
    //     const g = svg.append("g");

    //     // Create a group for each cluster
    //     const clusterGroups = g.selectAll("g")
    //         .data(packedData.children || [])
    //         .enter().append("g")
    //         .attr("transform", d => `translate(${d.x + padding},${d.y + padding})`);

    //     // Add circles for each cluster
    //     clusterGroups.append("circle")
    //         .attr("r", d => d.r)
    //         .attr("fill", (_, i) => color(i.toString()))
    //         .attr("opacity", 0.3)
    //         .attr("stroke", "#000")
    //         .attr("stroke-width", 2);

    //     // Add main keywords
    //     clusterGroups.append("text")
    //         .attr("text-anchor", "middle")
    //         .attr("dy", "0.3em")
    //         .text(d => (d.data as Cluster).mainKeyword)
    //         .style("font-size", "16px")
    //         .style("font-weight", "bold");

    //     // Add related keywords
    //     clusterGroups.each(function (d) {
    //         const cluster = d.data as Cluster;
    //         const group = d3.select(this);
    //         const radius = d.r;

    //         cluster.relatedKeywords.forEach((keyword, i) => {
    //             const angle = (i / cluster.relatedKeywords.length) * 2 * Math.PI;
    //             const x = Math.cos(angle) * radius * 0.6;
    //             const y = Math.sin(angle) * radius * 0.6;

    //             group.append("text")
    //                 .attr("x", x)
    //                 .attr("y", y)
    //                 .attr("text-anchor", "middle")
    //                 .attr("dy", "0.3em")
    //                 .text(keyword)
    //                 .style("font-size", "12px")
    //                 .style("color", "white");
    //         });
    //     });

    //     // Add zoom capabilities
    //     const zoom = d3.zoom<SVGSVGElement, unknown>()
    //         .scaleExtent([0.5, 3])
    //         .on('zoom', (event) => {
    //             g.attr('transform', event.transform.toString());
    //         });

    //     svg.call(zoom as any);

    //     // Add tooltip
    //     const tooltip = d3.select("body").append("div")
    //         .attr("class", "tooltip")
    //         .style("position", "absolute")
    //         .style("background-color", "white")
    //         .style("border", "1px solid #ddd")
    //         .style("border-radius", "4px")
    //         .style("padding", "10px")
    //         .style("opacity", 0);

    //     svg.on("mouseover", () => {
    //         tooltip.transition()
    //             .duration(200)
    //             .style("opacity", .9);
    //         tooltip.html("Zoom: Use mouse wheel<br/>Pan: Click and drag")
    //             .style("left", (d3.event.pageX + 10) + "px")
    //             .style("top", (d3.event.pageY - 28) + "px");
    //     })
    //         .on("mouseout", () => {
    //             tooltip.transition()
    //                 .duration(500)
    //                 .style("opacity", 0);
    //         });
    // };

    // return (
    //     <div className="container mx-auto p-4">
    //         <h1 className="text-2xl font-bold mb-4">Cluster Visualization</h1>
    //         <form onSubmit={handleSubmit} className="mb-4">
    //             <div className="mb-2">
    //                 <label htmlFor="phrase" className="block">Phrase:</label>
    //                 <input
    //                     type="text"
    //                     id="phrase"
    //                     value={phrase}
    //                     onChange={(e) => setPhrase(e.target.value)}
    //                     className="border p-1 w-full text-black"
    //                     required
    //                 />
    //             </div>
    //             <div className="mb-2">
    //                 <label htmlFor="xValue" className="block">X Value (number of articles):</label>
    //                 <input
    //                     type="number"
    //                     id="xValue"
    //                     value={xValue}
    //                     onChange={(e) => setXValue(parseInt(e.target.value))}
    //                     className="border p-1 w-full text-black"
    //                     required
    //                     min="1"
    //                 />
    //             </div>
    //             <div className="mb-2">
    //                 <label htmlFor="nValue" className="block">N Value (cluster size):</label>
    //                 <input
    //                     type="number"
    //                     id="nValue"
    //                     value={nValue}
    //                     onChange={(e) => setNValue(parseInt(e.target.value))}
    //                     className="border p-1 w-full text-black"
    //                     required
    //                     min="1"
    //                 />
    //             </div>
    //             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
    //                 {loading ? 'Generating...' : 'Generate Clusters'}
    //             </button>
    //         </form>
    //         {error && <div className="text-red-500 mb-4">{error}</div>}
    //         {loading && <div className="text-blue-500 mb-4">Loading clusters...</div>}
    //         {clusters.length > 0 && (
    //             <div id="clusterVisualization" className="border rounded p-4">
    //                 <svg ref={svgRef} width="800" height="600"></svg>
    //             </div>
    //         )}
    //     </div>
    // );
};

export default ClusterPage;
