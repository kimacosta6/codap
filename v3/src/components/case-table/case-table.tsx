import { useDndContext } from "@dnd-kit/core"
import { observer } from "mobx-react-lite"
import React, { useCallback, useRef } from "react"
import DataGrid, { DataGridHandle } from "react-data-grid"
import { AttributeDragOverlay } from "./attribute-drag-overlay"
import { TRow } from "./case-table-types"
import { useColumns } from "./use-columns"
import { useIndexColumn } from "./use-index-column"
import { useRows } from "./use-rows"
import { useSelectedRows } from "./use-selected-rows"
import { useDataSetContext } from "../../hooks/use-data-set-context"
import { useInstanceIdContext } from "../../hooks/use-instance-id-context"
import { prf } from "../../utilities/profiler"

import "./case-table.scss"

interface IProps {
  setNodeRef: (element: HTMLElement | null) => void
}
export const CaseTable = observer(({ setNodeRef }: IProps) => {
  const instanceId = useInstanceIdContext() || "case-table"
  const data = useDataSetContext()
  return prf.measure("Table.render", () => {

    const gridRef = useRef<DataGridHandle>(null)
    const { active } = useDndContext()
    const overlayDragId = active && `${active.id}`.startsWith(instanceId) ? `${active.id}` : undefined

    const { selectedRows, setSelectedRows, handleRowClick } = useSelectedRows({ data, gridRef })

    const handleIndexClick = useCallback((caseId: string, evt: React.MouseEvent) => {
      // TODO: put up a menu, for instance
    }, [])

    // columns
    const indexColumn = useIndexColumn({ data, onClick: handleIndexClick })
    const columns = useColumns({ data, indexColumn })

    // rows
    const { rows, handleRowsChange } = useRows(data)
    const rowKey = (row: TRow) => row.__id__

    if (!data) return null

    return (
      <div ref={setNodeRef} className="case-table" data-testid="case-table">
        <DataGrid ref={gridRef} className="rdg-light"
          columns={columns} rows={rows} rowKeyGetter={rowKey}
          selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows}
          onRowClick={handleRowClick} onRowsChange={handleRowsChange}/>
        <AttributeDragOverlay activeDragId={overlayDragId} />
      </div>
    )
  })
})
