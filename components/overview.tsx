"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  DownloadIcon,
  Share1Icon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@radix-ui/react-icons"
import html2canvas from "html2canvas"
import { Legend, ResponsiveContainer, Sankey, Tooltip } from "recharts"

import { cn } from "@/lib/utils"
import { getDictionary } from "@/app/[lang]/dictionaries"

import Filter from "./filter-option"
import { Icons } from "./icons"
import { Button } from "./ui/button"

interface Node {
  name: string
  count: number
  color: string
  stroke: string
}

interface Link {
  source: number
  target: number
  value: number
  color: string
  stroke: string
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export function Overview({ applications, params: { lang } }) {
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const selectedValues = new Set(filteredStatus ? [filteredStatus] : [])
  const windowSize = useWindowSize()
  const chartRef = useRef(null)
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang, dict])

  const getHostName = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  const nodes: Node[] = []
  const links: Link[] = []

  const startMap = new Map<string, number>()
  const jobTypeMap = new Map<string, number>()
  const referrerMap = new Map<string, number>()
  const statusMap = new Map<string, number>()
  const sourceMap = new Map<string, number>()

  if (dict != null) {
    applications.forEach((app) => {
      if ((!filteredStatus || app.status === filteredStatus) && dict) {
        const jobType =
          app.job?.job_type || dict.dashboard.dashboard.analytics.unknown
        const referrer = getHostName(
          app.job?.referrer_url || dict.dashboard.dashboard.analytics.unknown
        )
        const status = app.status
        const source = app.job_id

        if (!startMap.has("Start")) {
          startMap.set("Start", nodes.length)
          nodes.push({
            name: "Start",
            count: 0,
            color: "#ff7300",
            stroke: "#333",
          })
        }

        if (!jobTypeMap.has(jobType)) {
          jobTypeMap.set(jobType, nodes.length)
          nodes.push({
            name: jobType,
            count: 0,
            color: "#8884d8",
            stroke: "#333",
          })
        }

        if (!referrerMap.has(referrer)) {
          referrerMap.set(referrer, nodes.length)
          nodes.push({
            name: referrer,
            count: 0,
            color: "#82ca9d",
            stroke: "#333",
          })
        }

        if (!statusMap.has(status)) {
          statusMap.set(status, nodes.length)
          nodes.push({
            name: status,
            count: 0,
            color: "#ffc658",
            stroke: "#333",
          })
        }

        if (!sourceMap.has(source)) {
          sourceMap.set(source, nodes.length)
          nodes.push({
            name: source,
            count: 0,
            color: "#ff7300",
            stroke: "#333",
          })
        }

        nodes[startMap.get("Start")!].count++
        nodes[jobTypeMap.get(jobType)!].count++
        nodes[referrerMap.get(referrer)!].count++
        nodes[statusMap.get(status)!].count++
        nodes[sourceMap.get(source)!].count++

        links.push({
          source: startMap.get("Start")!,
          target: jobTypeMap.get(jobType)!,
          value: 1,
          color: "#8884d8",
          stroke: "#333",
        })

        links.push({
          source: jobTypeMap.get(jobType)!,
          target: referrerMap.get(referrer)!,
          value: 1,
          color: "#8884d8",
          stroke: "#333",
        })

        links.push({
          source: referrerMap.get(referrer)!,
          target: statusMap.get(status)!,
          value: 1,
          color: "#82ca9d",
          stroke: "#333",
        })

        links.push({
          source: statusMap.get(status)!,
          target: sourceMap.get(source)!,
          value: 1,
          color: "#ffc658",
          stroke: "#333",
        })
      }
    })
    const handleExport = () => {
      const dataStr = JSON.stringify({ nodes, links })
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = "data.json"

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ffa65c", "#ff7300"]

    const handleExportPNG = async () => {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current)
        const dataUrl = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = "sankey-diagram.png"
        link.click()
      }
    }

    const handleSelect = (value: string) => {
      setFilteredStatus((prevStatus) => (prevStatus === value ? null : value))
    }

    const handleClear = () => {
      setFilteredStatus(null)
    }

    const handleZoomIn = () => {
      setZoom((prevZoom) => Math.min(prevZoom + 0.1, 1.1))
    }

    const handleZoomOut = () => {
      setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5))
    }

    const availableStatuses = new Set(applications.map((app) => app.status))
    const filterOptions = [
      {
        label: dict.dashboard.applications.status.pending,
        value: "pending",
        icon: Icons.timer,
      },
      {
        label: dict.dashboard.applications.status.rejected,
        value: "rejected",
        icon: Icons.warning,
      },
      {
        label: dict.dashboard.applications.status.accepted,
        value: "accepted",
        icon: Icons.check,
      },
    ].filter((option) => availableStatuses.has(option.value))

    const CustomNode = (props: NodeProps): React.ReactElement => {
      return (
        <rect
          x={props.x + 4}
          y={props.y - 2}
          width={props.width - 8}
          height={props.height + 4}
          fill={colors[props.payload.depth % colors.length]}
          rx={2.5}
        />
      )
    }

    const CustomLink = (props) => {
      const {
        sourceX,
        sourceY,
        sourceControlX,
        targetControlX,
        targetX,
        targetY,
        payload,
        linkWidth,
      } = props
      return (
        <g>
          <path
            d={`
            M${sourceX},${sourceY}
            C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
          `}
            fill="none"
            stroke={colors[payload.source.depth % colors.length]}
            strokeOpacity={0.4}
            strokeWidth={linkWidth}
            strokeLinecap="butt"
          />
          <foreignObject
            x={sourceX}
            y={targetY - linkWidth / 2}
            width={Math.max(targetX, sourceX) - Math.min(targetX, sourceX)}
            height={linkWidth}
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                overflow: "visible",
                padding: "0.5em",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "sans-serif",
                  textAlign: "center",
                  backgroundColor: "#f1f5fe80",
                  padding: "0.25em 0.5em",
                  borderRadius: 4,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {payload.target.name ? `${payload.target.name}: ` : ""}
                {payload.value}
                &nbsp;
              </div>
            </div>
          </foreignObject>
        </g>
      )
    }

    const margin = {
      left: windowSize.width > 1200 ? 200 : 50,
      right: windowSize.width > 1200 ? 200 : 50,
      top: windowSize.height > 800 ? 20 : 20,
      bottom: windowSize.height > 800 ? 100 : 20,
    }

    return (
      dict && (
        <div>
          <div className="flex items-center space-x-2">
            <Filter
              title={dict.dashboard.dashboard.analytics.filterStatus}
              options={filterOptions}
              selectedValues={selectedValues}
              onSelect={handleSelect}
              onClear={handleClear}
            />
            <Button onClick={handleExport} variant="ghost" size="sm">
              <Share1Icon className="mr-2 size-3.5 text-muted-foreground/70" />
              {dict.dashboard.dashboard.analytics.exportJson}
            </Button>
            <Button onClick={handleExportPNG} variant="ghost" size="sm">
              <DownloadIcon className="mr-2 size-3.5 text-muted-foreground/70" />
              {dict.dashboard.dashboard.analytics.exportPng}
            </Button>
            <Button onClick={handleZoomIn} variant="ghost" size="sm">
              <ZoomInIcon className="mr-2 size-3.5 text-muted-foreground/70" />
              {dict.dashboard.dashboard.analytics.zoomIn}
            </Button>
            <Button onClick={handleZoomOut} variant="ghost" size="sm">
              <ZoomOutIcon className="mr-2 size-3.5 text-muted-foreground/70" />
              {dict.dashboard.dashboard.analytics.zoomOut}
            </Button>
          </div>
          <div ref={chartRef}>
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              <ResponsiveContainer width="100%" height={700}>
                <Sankey
                  width={960}
                  height={500}
                  data={{ nodes, links }}
                  node={<CustomNode />}
                  link={<CustomLink />}
                  nodePadding={50}
                  margin={margin}
                  iterations={32}
                >
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null
                      const { source, target, value } = payload[0].payload
                      return (
                        <div className="rounded border bg-muted p-2 shadow">
                          <p>
                            <strong>{nodes[source]?.name}</strong> to{" "}
                            <strong>{nodes[target]?.name}</strong>
                          </p>
                          <p>
                            <strong>Value:</strong> {value}
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Legend />
                </Sankey>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )
    )
  }
}
