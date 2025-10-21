"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface ASTSectionProps {
  data: any
}

interface TreeNode {
  id: string
  label: string
  x: number
  y: number
  children: string[]
}

export default function ASTSection({ data }: ASTSectionProps) {
  const exampleData = {
    nodes: [
      { id: 0, label: "S" },
      { id: 1, label: "C" },
      { id: 2, label: "c" },
      { id: 3, label: "C" },
      { id: 4, label: "d" },
      { id: 5, label: "C" },
      { id: 6, label: "d" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 0, to: 5 },
      { from: 5, to: 6 },
    ],
  }

  const astGraph = data.ast_graph || exampleData
  const astString = data.ast_string || "No se generó AST"
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const treeData = useMemo(() => {
    if (!astGraph.nodes || astGraph.nodes.length === 0) return null

    const nodeMap = new Map<string, TreeNode>()
    const childrenMap = new Map<string, string[]>()

    // Initialize nodes
    astGraph.nodes.forEach((node: any) => {
      nodeMap.set(String(node.id), {
        id: String(node.id),
        label: node.label,
        x: 0,
        y: 0,
        children: [],
      })
      childrenMap.set(String(node.id), [])
    })

    // Build children relationships
    astGraph.edges.forEach((edge: any) => {
      const children = childrenMap.get(String(edge.from)) || []
      children.push(String(edge.to))
      childrenMap.set(String(edge.from), children)
    })

    // Assign children to nodes
    childrenMap.forEach((children, nodeId) => {
      const node = nodeMap.get(nodeId)
      if (node) node.children = children
    })

    // Find root
    const hasParent = new Set(astGraph.edges.map((e: any) => String(e.to)))
    const roots = Array.from(nodeMap.values()).filter((n) => !hasParent.has(n.id))

    if (roots.length === 0) return null

    const root = roots[0]
    let minX = 0
    let maxX = 0
    let maxY = 0

    const calculatePositions = (node: TreeNode, x: number, y: number, offset: number) => {
      node.x = x
      node.y = y
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)

      if (node.children.length === 0) return

      const childWidth = offset / Math.max(node.children.length, 1)
      let childX = x - offset / 2 + childWidth / 2

      node.children.forEach((childId) => {
        const child = nodeMap.get(childId)
        if (child) {
          calculatePositions(child, childX, y + 120, offset * 0.85)
          childX += childWidth
        }
      })
    }

    calculatePositions(root, 0, 0, 250)

    const offsetX = Math.abs(minX) + 100
    const offsetY = 50

    nodeMap.forEach((node) => {
      node.x += offsetX
      node.y += offsetY
    })

    const width = maxX - minX + 200
    const height = maxY + 150

    console.log("[v0] Tree data:", {
      nodeCount: nodeMap.size,
      edgeCount: astGraph.edges.length,
      width,
      height,
      nodes: Array.from(nodeMap.values()).map((n) => ({
        id: n.id,
        label: n.label,
        x: n.x,
        y: n.y,
        children: n.children,
      })),
    })

    return { nodeMap, root, width, height }
  }, [astGraph])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (direction: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + direction * 0.2)))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  if (!treeData) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Árbol de Sintaxis Abstracta</h3>
          <div className="text-center py-8 text-foreground/50">
            <p>No se generó AST para esta entrada</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Árbol de Sintaxis Abstracta</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleZoom(1)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={18} className="text-primary" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={18} className="text-primary" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Reset view"
            >
              <RotateCcw size={18} className="text-primary" />
            </button>
          </div>
        </div>

        <div
          className="border border-primary/20 rounded-lg overflow-hidden bg-gradient-to-br from-secondary/5 to-primary/5 cursor-grab active:cursor-grabbing"
          style={{ height: "500px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${treeData.width} ${treeData.height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {Array.from(treeData.nodeMap.values()).map((node) =>
              node.children.map((childId) => {
                const child = treeData.nodeMap.get(childId)
                if (!child) return null
                console.log("[v0] Drawing edge:", {
                  from: node.id,
                  to: childId,
                  x1: node.x,
                  y1: node.y,
                  x2: child.x,
                  y2: child.y,
                })
                return (
                  <line
                    key={`edge-${node.id}-${childId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                )
              }),
            )}

            {/* Draw nodes */}
            {Array.from(treeData.nodeMap.values()).map((node) => (
              <g key={`node-${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="url(#gradient)"
                  opacity="0.9"
                  className="hover:opacity-100 transition-opacity"
                />
                <circle cx={node.x} cy={node.y} r="30" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.3" />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono font-semibold text-xs"
                  fill="white"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Text representation */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-primary/70 mb-2">Representación en Texto</h4>
          <pre className="font-mono text-xs bg-secondary/10 p-4 rounded overflow-x-auto text-foreground/80 whitespace-pre-wrap break-words max-h-48">
            {astString}
          </pre>
        </div>
      </Card>
    </div>
  )
}
