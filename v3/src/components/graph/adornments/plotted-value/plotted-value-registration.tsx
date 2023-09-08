import React from "react"
import { registerAdornmentComponentInfo } from "../adornment-component-info"
import { registerAdornmentContentInfo } from "../adornment-content-info"
import { PlottedValueModel } from "./plotted-value-model"
import { kPlottedValueClass, kPlottedValueLabelKey, kPlottedValuePrefix,
         kPlottedValueType } from "./plotted-value-types"
import { PlottedValue } from "./plotted-value"
import { AdornmentCheckbox } from "../adornment-checkbox"
import { PlottedValueUI } from "./plotted-value-ui"

const Controls = () => {
  return (
    <AdornmentCheckbox
      classNameValue={kPlottedValueClass}
      labelKey={kPlottedValueLabelKey}
      type={kPlottedValueType}
    />
  )
}

registerAdornmentContentInfo({
  type: kPlottedValueType,
  plots: ["dotPlot", "scatterPlot"],
  prefix: kPlottedValuePrefix,
  modelClass: PlottedValueModel
})

registerAdornmentComponentInfo({
  adornmentEltClass: kPlottedValueClass,
  Component: PlottedValue,
  Controls,
  HelperComponent: PlottedValueUI,
  labelKey: kPlottedValueLabelKey,
  order: 10,
  type: kPlottedValueType
})
