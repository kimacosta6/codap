import {max, range, select} from "d3"
import React, {memo, useCallback, useEffect, useRef, useState} from "react"
import {observer} from "mobx-react-lite"
import {
  plotProps,
  transitionDuration,
  InternalizedData,
  defaultRadius,
  defaultDiameter,
  dragRadius
} from "./graphing-types"
import {useDragHandlers, useSelection} from "./graph-hooks/graph-hooks"
import {IDataSet} from "../../data-model/data-set"
import {getScreenCoord} from "./graph-utils/graph_utils"


export const DotPlotDots = memo(observer(function DotPlotDots(props: {
  dots: plotProps,
  plotWidth: number,
  plotHeight: number,
  xMin: number,
  xMax: number,
  worldDataRef:  React.MutableRefObject<IDataSet | undefined>,
  graphDataRef: React.MutableRefObject<InternalizedData>,
  dotsRef: React.RefObject<SVGSVGElement>
}) {
  const {
      worldDataRef, graphDataRef, dotsRef, plotWidth, plotHeight, xMax, xMin,
      dots: {xScale, yScale}
    } = props,
    [dragID, setDragID] = useState<string>(),
    [refreshCounter, setRefreshCounter] = useState(0),
    currPos = useRef({x: 0}),
    target = useRef<any>(),
    [firstTime, setFirstTime] = useState<boolean | null>(true),
    selectedDataObjects = useRef<Record<string, { x: number }>>({}),
    [forceRefreshCounter, setForceRefreshCounter] = useState(0)

  const onDragStart = useCallback((event: MouseEvent) => {

      if (firstTime) {
        setFirstTime(false) // We never want to animate points on drag
      }
      const xAttrID = graphDataRef.current.xAttributeID
      target.current = select(event.target as SVGSVGElement)
      const tItsID: string = target.current.property('id')
      if (target.current.node()?.nodeName === 'circle') {
        target.current.transition()
          .attr('r', dragRadius)
        setDragID(() => tItsID)
        currPos.current = {x: event.clientX}
        worldDataRef.current?.selectCases([tItsID])
        // Record the current values so we can change them during the drag and restore them when done
        worldDataRef.current?.selection.forEach(anID => {
          selectedDataObjects.current[anID] = {
            x: worldDataRef.current?.getNumeric(anID, xAttrID) ?? NaN
          }
        })
      }
    }, [firstTime, setFirstTime, worldDataRef, graphDataRef]),

    onDrag = useCallback((event: MouseEvent) => {
      const xAttrID = graphDataRef.current.xAttributeID
      if (dragID) {
        const newPos = {x: event.clientX},
          dx = newPos.x - currPos.current.x
        currPos.current = newPos
        if (dx !== 0) {
          const deltaX = Number(xScale?.invert(dx)) - Number(xScale?.invert(0))
          worldDataRef.current?.selection.forEach(anID => {
            const currX = worldDataRef.current?.getNumeric(anID, xAttrID)
            worldDataRef.current?.setValue(anID, xAttrID, Number(currX ?? 0) + deltaX)
          })
          setRefreshCounter(prevCounter => ++prevCounter)
        }
      }
    }, [currPos, dragID, xScale, worldDataRef, graphDataRef]),

    onDragEnd = useCallback(() => {
      const xAttrID = graphDataRef.current.xAttributeID
      if (dragID) {
        target.current
          .classed('dragging', false)
          .transition()
          .attr('r', defaultRadius)
        setDragID(undefined)
        target.current = null
      }
      worldDataRef.current?.selection.forEach(anID => {
        worldDataRef.current?.setValue(anID, xAttrID, selectedDataObjects.current[anID].x)
      })
      setFirstTime(true)  // So points will animate back to original positions
      setRefreshCounter(prevCounter => ++prevCounter)
    }, [dragID, worldDataRef, graphDataRef])

  useDragHandlers(window, {start: onDragStart, drag: onDrag, end: onDragEnd})

  useEffect(function refreshPoints() {
    const xAttrID = graphDataRef.current.xAttributeID

      function computeBinPlacements() {
        const numBins = Math.ceil(plotWidth / defaultDiameter) + 1,
          binWidth = plotWidth / (numBins - 1),
          bins: string[][] = range(numBins + 1).map(() => [])

        graphDataRef.current.cases.forEach((anID) => {
          const numerator = xScale?.(worldDataRef.current?.getNumeric(anID, xAttrID) ?? -1),
            bin = Math.ceil((numerator ?? 0) / binWidth)
          if (bin >= 0 && bin <= numBins) {
            bins[bin].push(anID)
            binMap[anID] = {yIndex: bins[bin].length}
          }
        })
        const maxInBin = (max(bins, (b => b.length)) || 0) + 1,
          excessHeight = Math.max(0, maxInBin - Math.floor(yHeight / defaultDiameter)) * defaultDiameter
        overlap = excessHeight / maxInBin
      }

      const computeYCoord = (binContents: { yIndex: number }) => {
        return binContents ? yHeight - defaultRadius / 2 - binContents.yIndex * (defaultDiameter - overlap) : 0
      }

      const
        yHeight = Number(yScale?.range()[0]),
        dotsSvgElement = dotsRef.current,
        binMap: { [id: string]: { yIndex: number } } = {},
        tTransitionDuration = firstTime ? transitionDuration : 0
      let overlap = 0
      computeBinPlacements()

      const selection = select(dotsSvgElement).selectAll('circle')
        .classed('dot-highlighted',
          (anID:string ) => !!(worldDataRef.current?.isCaseSelected(anID)))
      if (tTransitionDuration > 0) {
        selection
          .transition()
          .duration(tTransitionDuration)
          .on('end', () => {
            setFirstTime(false)
          })
          .attr('cx', (anID:string) => getScreenCoord(worldDataRef.current, anID, xAttrID, xScale))
          .attr('cy', (anID: string) => computeYCoord(binMap[anID]))
          .attr('r', defaultRadius)
      } else {
        selection
          .attr('cx', (anID: string) => getScreenCoord(worldDataRef.current, anID, xAttrID, xScale))
          .attr('cy', (anID: string) => computeYCoord(binMap[anID]))
      }
      select(dotsSvgElement)
        .selectAll('.dot-highlighted')
        .raise()

    }, [firstTime, dotsRef, xScale, yScale, xMin, xMax, graphDataRef, worldDataRef,
      plotWidth, plotHeight, refreshCounter, forceRefreshCounter]
  )

  /**
   * In the initial refreshPoints there are no circles. We call this once to force a refreshPoints in which
   * there are circles.
   */
  useEffect(function forceRefresh() {
    setForceRefreshCounter(prevCounter => ++prevCounter)
  }, [])

  useSelection(worldDataRef, setRefreshCounter)

  return (
    <svg/>
  )
}))
/*
if (DotPlotDots) {
  (DotPlotDots as any).whyDidYouRender = {logOnDifferentValues: true, customName: 'DotPlotDots'}
}
*/
