import React, { useEffect, useRef, useState } from "react"
import {
  DownloadIcon,
  Share1Icon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@radix-ui/react-icons"
import html2canvas from "html2canvas"
import { ResponsiveContainer, Sankey, Tooltip } from "recharts"

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
    width: 0,
    height: 0,
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

const CustomLegend = () => {
  const legendItems = [
    { label: "Job Type", color: "#8884d8" },
    { label: "Referrer", color: "#82ca9d" },
    { label: "Application Status", color: "#ffc658" },
    { label: "Position", color: "#ff7300" },
  ]

  return (
    <div className="mt-4 flex flex-wrap justify-center">
      {legendItems.map((item) => (
        <div key={item.label} className="mx-2 my-1 flex items-center">
          <div
            className="mr-2 size-4"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Overview({
  applications,
  params: { lang },
}: {
  applications: any
  params: { lang: any }
}): JSX.Element | null {
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

  const addNode = (map: Map<string, number>, key: string, color: string) => {
    if (!map.has(key)) {
      map.set(key, nodes.length)
      nodes.push({
        name: key,
        count: 1,
        color: color,
        stroke: color,
      })
    } else {
      nodes[map.get(key)!].count++
    }
  }

  const addLink = (source: number, target: number, color: string, stroke: string) => {
    const existingLink = links.find(link => link.source === source && link.target === target)
    if (existingLink) {
      existingLink.value++
    } else {
      links.push({
        source,
        target,
        value: 1,
        color,
        stroke,
      })
    }
  }

  if (dict != null) {
    applications.forEach((app: any) => {
      if ((!filteredStatus || app.status === filteredStatus) && dict) {
        const jobType =
          app.job?.job_type || dict.dashboard.dashboard.analytics.unknown
        const referrer = getHostName(
          app.job?.referrer_url || dict.dashboard.dashboard.analytics.unknown
        )
        const status = app.status
        const source = app.job?.position ?? app.job?.title ?? app.job_id.toString() 

        addNode(startMap, "Start", "#ff7300")
        addNode(jobTypeMap, jobType, "#8884d8")
        addNode(referrerMap, referrer, "#82ca9d")
        addNode(statusMap, status, "#ffc658")
        addNode(sourceMap, source, "#ff7300")

        addLink(startMap.get("Start")!, jobTypeMap.get(jobType)!, "#8884d8", "#333")
        addLink(jobTypeMap.get(jobType)!, referrerMap.get(referrer)!, "#8884d8", "#333")
        addLink(referrerMap.get(referrer)!, statusMap.get(status)!, "#82ca9d", "#333")
        addLink(statusMap.get(status)!, sourceMap.get(source)!, "#ffc658", "#333")
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
        link.download = "embloy-sankey-diagram.png"
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

    const availableStatuses = new Set(
      applications.map((app: any) => app.status)
    )
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

    const CustomNode = (props: any): React.ReactElement => {
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

    const CustomLink = (props: any) => {
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
                  color: "black",
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
                <Tooltip/>
              </Sankey>
            </ResponsiveContainer>
          </div>
        </div>
        <CustomLegend />
      </div>
    )
  }

  return null
}
