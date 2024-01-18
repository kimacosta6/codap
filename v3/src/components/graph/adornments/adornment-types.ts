import { types } from "mobx-state-tree"
import { IAdornmentModel, IUnknownAdornmentModel, UnknownAdornmentModel } from "./adornment-models"
import { IMovableLineAdornmentModel, MovableLineAdornmentModel } from "./movable-line/movable-line-adornment-model"
import { IMovablePointAdornmentModel, MovablePointAdornmentModel } from "./movable-point/movable-point-adornment-model"
import { IMovableValueAdornmentModel, MovableValueAdornmentModel } from "./movable-value/movable-value-adornment-model"
import { CountAdornmentModel, ICountAdornmentModel } from "./count/count-adornment-model"
import { IPlottedValueAdornmentModel, PlottedValueAdornmentModel }
  from "./univariate-measures/plotted-value/plotted-value-adornment-model"
import { IMeanAdornmentModel, MeanAdornmentModel } from "./univariate-measures/mean/mean-adornment-model"
import { IMedianAdornmentModel, MedianAdornmentModel } from "./univariate-measures/median/median-adornment-model"
import { IStandardDeviationAdornmentModel, StandardDeviationAdornmentModel }
  from "./univariate-measures/standard-deviation/standard-deviation-adornment-model"
import { IMeanAbsoluteDeviationAdornmentModel, MeanAbsoluteDeviationAdornmentModel }
  from "./univariate-measures/mean-absolute-deviation/mean-absolute-deviation-adornment-model"
import { BoxPlotAdornmentModel, IBoxPlotAdornmentModel } from "./univariate-measures/box-plot/box-plot-adornment-model"
import { PlottedFunctionAdornmentModel, IPlottedFunctionAdornmentModel }
  from "./plotted-function/plotted-function-adornment-model"
import { ILSRLAdornmentModel, LSRLAdornmentModel } from "./lsrl/lsrl-adornment-model"

export const kGraphAdornmentsClass = "graph-adornments-grid"
export const kGraphAdornmentsClassSelector = `.${kGraphAdornmentsClass}`
export const kDefaultFontSize = 12
export const kGraphAdornmentsBannerHeight = 22

const adornmentTypeDispatcher = (adornmentSnap: IAdornmentModel) => {
  switch (adornmentSnap.type) {
    case "Box Plot": return BoxPlotAdornmentModel
    case "Count": return CountAdornmentModel
    case "LSRL": return LSRLAdornmentModel
    case "Mean": return MeanAdornmentModel
    case "Mean Absolute Deviation": return MeanAbsoluteDeviationAdornmentModel
    case "Median": return MedianAdornmentModel
    case "Movable Line": return MovableLineAdornmentModel
    case "Movable Point": return MovablePointAdornmentModel
    case "Movable Value": return MovableValueAdornmentModel
    case "Plotted Function": return PlottedFunctionAdornmentModel
    case "Plotted Value": return PlottedValueAdornmentModel
    case "Standard Deviation": return StandardDeviationAdornmentModel
    default: return UnknownAdornmentModel
  }
}

export const AdornmentModelUnion = types.union({ dispatcher: adornmentTypeDispatcher },
  BoxPlotAdornmentModel, CountAdornmentModel, LSRLAdornmentModel, MeanAdornmentModel,
  MeanAbsoluteDeviationAdornmentModel, MedianAdornmentModel, MovableValueAdornmentModel, MovableLineAdornmentModel,
  MovablePointAdornmentModel, PlottedFunctionAdornmentModel, PlottedValueAdornmentModel,
  StandardDeviationAdornmentModel, UnknownAdornmentModel)
export type IAdornmentModelUnion = IBoxPlotAdornmentModel | ICountAdornmentModel | ILSRLAdornmentModel |
  IMeanAdornmentModel | IMeanAbsoluteDeviationAdornmentModel | IMedianAdornmentModel | IMovableValueAdornmentModel |
  IMovableLineAdornmentModel | IMovablePointAdornmentModel | IPlottedFunctionAdornmentModel |
  IPlottedValueAdornmentModel | IStandardDeviationAdornmentModel | IUnknownAdornmentModel

export type PlotTypes = "casePlot" | "dotChart" | "dotPlot" | "scatterPlot"

export interface IMeasure {
  title: string
  type: string
}
  
export interface IMeasures {
  [key: string]: IMeasure[]
}

export const ParentAdornmentTypes = ["Univariate Measure"] as const
export type ParentAdornmentType = typeof ParentAdornmentTypes[number]
  
export const measures: IMeasures = {
  "casePlot": [
    { title: "DG.Inspector.graphCount", type: "Count" }
  ],
  "dotChart": [
    { title: "DG.Inspector.graphCount", type: "Count" }
  ],
  "dotPlot":  [
    { title: "DG.Inspector.graphCount", type: "Count" },
    { title: "DG.Inspector.graphPlottedMean", type: "Mean" },
    { title: "DG.Inspector.graphPlottedMedian", type: "Median" },
    { title: "DG.Inspector.graphPlottedStDev", type: "Standard Deviation" },
    { title: "DG.Inspector.graphPlottedMeanAbsDev", type: "Mean Absolute Deviation" },
    { title: "DG.Inspector.graphPlottedBoxPlot", type: "Box Plot" },
    { title: "DG.Inspector.graphPlottedValue", type: "Plotted Value" },
    { title: "DG.Inspector.graphMovableValue", type: "Movable Value" }
  ],
  "scatterPlot": [
    { title: "DG.Inspector.graphCount", type: "Count" },
    { title: "DG.Inspector.graphMovablePoint", type: "Movable Point" },
    { title: "DG.Inspector.graphMovableLine", type: "Movable Line" },
    { title: "DG.Inspector.graphLSRL", type: "LSRL" },
    { title: "DG.Inspector.graphPlottedFunction", type: "Plotted Function" },
    { title: "DG.Inspector.graphPlottedValue", type: "Plotted Value" }
  ]
}
