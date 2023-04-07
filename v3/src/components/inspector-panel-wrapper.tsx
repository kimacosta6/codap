import { useDndContext } from "@dnd-kit/core"
import React from "react"
import { getTileComponentInfo } from "../models/tiles/tile-component-info"
import { ITileModel } from "../models/tiles/tile-model"
import { uiState } from "../models/ui-state"

interface IInspectorPanelWrapper {
  tile?: ITileModel
}
export function InspectorPanelWrapper({ tile }: IInspectorPanelWrapper) {
  const { InspectorPanel } = getTileComponentInfo(tile?.content.type) || {}
  const { active } = useDndContext()
  const show = uiState.isFocusedTile(tile?.id) && !active
  return InspectorPanel ? <InspectorPanel tile={tile} show={show} /> : null
}
