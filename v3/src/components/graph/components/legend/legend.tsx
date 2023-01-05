import React, {memo, useMemo, useRef} from "react"
import {createPortal} from "react-dom"
import {Active} from "@dnd-kit/core"
import {useDataConfigurationContext} from "../../hooks/use-data-configuration-context"
import {Bounds, useGraphLayoutContext} from "../../models/graph-layout"
import {AttributeLabel} from "../attribute-label"
import {CategoricalLegend} from "./categorical-legend"
import {NumericLegend} from "./numeric-legend"
import {DroppableSvg} from "../droppable-svg"
import {useInstanceIdContext} from "../../../../hooks/use-instance-id-context"
import {getDragAttributeId, useDropHandler} from "../../../../hooks/use-drag-drop"
import {useDropHintString} from "../../../../hooks/use-drop-hint-string"
import {GraphAttrRole, GraphPlace} from "../../graphing-types"
import {AxisOrLegendAttributeMenu} from "../../../axis/components/axis-or-legend-attribute-menu"

interface ILegendProps {
  legendAttrID: string
  graphElt: HTMLDivElement | null
  onDropAttribute: (place: GraphPlace, attrId: string) => void
  onTreatAttributeAs: (place: GraphPlace, attrId: string, treatAs: string) => void
}

const handleIsActive = (active: Active) => !!getDragAttributeId(active)

export const Legend = memo(function Legend({
  legendAttrID, graphElt, onDropAttribute, onTreatAttributeAs
}: ILegendProps) {
  const dataConfiguration = useDataConfigurationContext(),
    layout = useGraphLayoutContext(),
    attrType = dataConfiguration?.dataset?.attrFromID(legendAttrID ?? '')?.type,
    legendLabelRef = useRef<SVGGElement>(null),
    legendRef = useRef() as React.RefObject<SVGSVGElement>,
    instanceId = useInstanceIdContext(),
    droppableId = `${instanceId}-legend-area-drop`,
    role = 'legend' as GraphAttrRole,
    hintString = useDropHintString({role}),
    attributeIDs = useMemo(() => legendAttrID ? [legendAttrID] : [], [legendAttrID])

  useDropHandler(droppableId, active => {
    const dragAttributeID = getDragAttributeId(active)
    dragAttributeID && onDropAttribute('legend', dragAttributeID)
  })

  const legendBounds = layout.computedBounds.get('legend') as Bounds,
    transform = `translate(${legendBounds.left}, ${legendBounds.top})`

  return legendAttrID ? (
    <>
      <svg ref={legendRef} className='legend'>
        { graphElt && createPortal(
            <AxisOrLegendAttributeMenu
              place="legend"
              target={legendLabelRef.current}
              portal={graphElt}
              onChangeAttribute={onDropAttribute}
              onTreatAttributeAs={onTreatAttributeAs}
            />,
          graphElt)
        }
        <AttributeLabel
          ref={legendLabelRef}
          transform={transform}
          attributeIDs={attributeIDs}
          orientation='horizontal'
          attributeRole='legend'
        />
        {
          attrType === 'categorical' ? <CategoricalLegend transform={transform}
                                                          legendLabelRef={legendLabelRef}/>
            : attrType === 'numeric' ? <NumericLegend legendAttrID={legendAttrID}
                                                    transform={transform}/> : null
        }
      </svg>
      <DroppableSvg
        className="droppable-legend"
        portal={graphElt}
        target={legendRef.current}
        dropId={droppableId}
        onIsActive={handleIsActive}
        hintString={hintString}
      />
    </>

  ) : null
})
Legend.displayName = "Legend"
