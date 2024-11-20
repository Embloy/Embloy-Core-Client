import React, { useCallback, useEffect, useRef, useState } from "react"
import { Locale } from "@/i18n-config"
import {
  Background,
  ControlButton,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"

import "reactflow/dist/style.css"
import { Fullscreen, FullscreenIcon } from "lucide-react"

import { Application, ApplicationEvent } from "@/lib/api/application"
import { ScrollArea } from "@/components/new-york/ui/scroll-area"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ApplicationPipelineProps {
  application: Application
  version: Number
  params: {
    lang: Locale
  }
}

export function ApplicationPipeline({
  application,
  version,
  params: { lang },
}: ApplicationPipelineProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true)
          })
          .catch((err) => {
            console.error(
              `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
            )
          })
      } else {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "F11") {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  useEffect(() => {
    if (application && application.application_events) {
      const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]
      const newNodes: Node[] = application.application_events.map(
        (event: ApplicationEvent, index: number) => ({
          id: event.id.toString(),
          data: { label: `${event.id}: ${event.event_type}` },
          position: { x: 250 * index, y: 0 },
          style: {
            backgroundColor: colors[index % colors.length],
            color: "#fff",
          },
          draggable: false, // Lock the nodes by default
        })
      )

      const newEdges: Edge[] = application.application_events
        .filter(
          (event: ApplicationEvent) =>
            event.next_event_id !== null || event.previous_event_id !== null
        )
        .map((event: ApplicationEvent) => {
          const edges: Edge[] = []
          if (event.next_event_id !== null) {
            edges.push({
              id: `e${event.id}-${event.next_event_id}`,
              source: event.id.toString(),
              target: event.next_event_id!.toString(),
              type: "smoothstep",
              animated: true,
              style: { stroke: colors[event.id % colors.length] },
            })
          }
          if (event.previous_event_id !== null) {
            edges.push({
              id: `e${event.previous_event_id}-${event.id}`,
              source: event.previous_event_id!.toString(),
              target: event.id.toString(),
              type: "smoothstep",
              animated: true,
              style: {
                stroke: colors[event.previous_event_id % colors.length],
              },
            })
          }
          return edges
        })
        .flat()

      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [application, setNodes, setEdges])

  return (
    dict && (
      <ScrollArea className="h-screen" style={{ height: "50vh" }}>
        <div className="space-y-4 p-4">
          {application.application_events?.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-lg border bg-secondary p-4 text-sm font-light italic text-muted-foreground shadow-lg">
                {dict.dashboard.applications.noPipeline}
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="rounded-lg bg-background shadow-lg"
              style={{ width: "50vw", height: "20vw" }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                {isFullscreen && <MiniMap />}
                <Controls>
                  <ControlButton onClick={toggleFullScreen}>
                    {isFullscreen ? (
                      <FullscreenIcon color="black" />
                    ) : (
                      <Fullscreen color="black" />
                    )}
                  </ControlButton>
                </Controls>
                <Background />
              </ReactFlow>
            </div>
          )}
        </div>
      </ScrollArea>
    )
  )
}
