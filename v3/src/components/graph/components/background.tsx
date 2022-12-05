import React, {forwardRef, MutableRefObject, useCallback, useEffect, useRef} from "react"
import {drag, select} from "d3"
import RTree from 'rtree'
import {InternalizedData, Point, rTreeRect} from "../graphing-types"
import {Bounds, useGraphLayoutContext} from "../models/graph-layout"
import {rectangleSubtract, rectNormalize} from "../utilities/graph-utils"
import {appState} from "../../app-state"
import {useCurrent} from "../../../hooks/use-current"
import {useDataSetContext} from "../../../hooks/use-data-set-context"
import {MarqueeState} from "../models/marquee-state"

interface IProps {
  marqueeState: MarqueeState
}

const prepareTree = (areaSelector: string, circleSelector: string, offset:Point): typeof RTree => {
  const selectionTree = RTree(10)
  select(areaSelector).selectAll(circleSelector)
    .each((datum: InternalizedData, index, groups) => {
      const element: any = groups[index],
        rect = {
          x: Number(element.cx.baseVal.value) + offset.x,
          y: Number(element.cy.baseVal.value) + offset.y,
          w: 1, h: 1
        }
      selectionTree.insert(rect, element.__data__)
    })
  // @ts-expect-error fromJSON
  return selectionTree
},

getCasesForDelta = (tree: any, newRect: rTreeRect, prevRect: rTreeRect) => {
  const diffRects = rectangleSubtract(newRect, prevRect)
  let caseIDs: string[] = []
  diffRects.forEach(aRect => {
    const newlyFoundIDs = tree.search(aRect)
    caseIDs = caseIDs.concat(newlyFoundIDs)
  })
  return caseIDs
}

export const Background = forwardRef<SVGGElement, IProps>((props, ref) => {
  const {marqueeState } = props,
    dataset = useCurrent(useDataSetContext()),
    layout = useGraphLayoutContext(),
    bounds = layout.computedBounds.get('plot') as Bounds,
    plotWidth = bounds.width,
    plotHeight = bounds.height,
    transform = `translate(${bounds.left}, ${bounds.top})`,
    bgRef = ref as MutableRefObject<SVGGElement | null>,
    startX = useRef(0),
    startY = useRef(0),
    width = useRef(0),
    height = useRef(0),
    selectionTree = useRef<typeof RTree | null>(null),
    previousMarqueeRect = useRef<rTreeRect>(),

    onDragStart = useCallback((event:{ x: number; y: number; sourceEvent: {shiftKey: boolean} }) => {
      const { computedBounds } = layout,
      plotBounds = computedBounds.get('plot') as Bounds
      appState.beginPerformance()
      selectionTree.current = prepareTree('.graph-dot-area', 'circle',
        {x: plotBounds.left, y: plotBounds.top})
      startX.current = event.x
      startY.current = event.y
      width.current = 0
      height.current = 0
      if( !event.sourceEvent.shiftKey) {
        dataset.current?.setSelectedCases([])
      }
      marqueeState.setMarqueeRect({x: event.x, y: event.y, width: 0, height: 0})
    }, [dataset, marqueeState, layout]),

    onDrag = useCallback((event: { dx: number; dy: number }) => {
      if (event.dx !== 0 || event.dy !== 0) {
        previousMarqueeRect.current = rectNormalize(
          {x: startX.current, y: startY.current, w: width.current, h: height.current})
        width.current = width.current + event.dx
        height.current = height.current + event.dy
        const marqueeRect = marqueeState.marqueeRect
        marqueeState.setMarqueeRect( {
            x: marqueeRect.x, y: marqueeRect.y,
            width: marqueeRect.width + event.dx,
            height: marqueeRect.height + event.dy
          })
        const currentRect = rectNormalize({
            x: startX.current, y: startY.current,
            w: width.current,
            h: height.current
          }),
          newSelection = getCasesForDelta(selectionTree.current, currentRect, previousMarqueeRect.current),
          newDeselection = getCasesForDelta(selectionTree.current, previousMarqueeRect.current, currentRect)
        newSelection.length && dataset.current?.selectCases(newSelection, true)
        newDeselection.length && dataset.current?.selectCases(newDeselection, false)
      }
    }, [dataset, marqueeState]),

    onDragEnd = useCallback(() => {
      marqueeState.setMarqueeRect({x: 0, y: 0, width: 0, height: 0})
      selectionTree.current = null
      appState.endPerformance()
    }, [marqueeState])

  useEffect(() => {
    const dragBehavior = drag()
        .on("start", onDragStart)
        .on("drag", onDrag)
        .on("end", onDragEnd),
      groupElement = bgRef.current
    select(groupElement).on('click', (event) => {
      if( !event.shiftKey) {
        dataset.current?.selectAll(false)
      }
    })
    select(groupElement)
      .selectAll('rect')
      .data([1])
      .join(
        // @ts-expect-error void => Selection
        (enter) => {
          enter.append('rect')
            .attr('class', 'graph-background')
            .call(dragBehavior)
        },
        (update) => {
          update
            .attr('transform', transform)
            .attr('width', plotWidth)
            .attr('height', plotHeight)
            .attr('x', 0)
            .attr('y', 0)
        }
      )
  }, [bgRef, transform, dataset, onDrag, onDragEnd, onDragStart, plotHeight, plotWidth])

  return (
    <g ref={bgRef}/>
  )
})
Background.displayName = "Background"
