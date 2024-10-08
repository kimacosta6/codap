import { registerComponentHandler } from "../../data-interactive/handlers/component-handler"
import { registerTileComponentInfo } from "../../models/tiles/tile-component-info"
import { ITileLikeModel, registerTileContentInfo } from "../../models/tiles/tile-content-info"
import { ITileModelSnapshotIn } from "../../models/tiles/tile-model"
import { CalculatorComponent } from "./calculator"
import { kCalculatorTileClass, kCalculatorTileType, kV2CalculatorType } from "./calculator-defs"
import { CalculatorModel, ICalculatorSnapshot } from "./calculator-model"
import { CalculatorTitleBar } from "./calculator-title-bar"
import CalcIcon from '../../assets/icons/icon-calc.svg'
import { toV3Id } from "../../utilities/codap-utils"
import { registerV2TileImporter } from "../../v2/codap-v2-tile-importers"
import { isV2CalculatorComponent } from "../../v2/codap-v2-types"
import { t } from "../../utilities/translation/translate"

export const kCalculatorIdPrefix = "CALC"

registerTileContentInfo({
  type: kCalculatorTileType,
  prefix: kCalculatorIdPrefix,
  modelClass: CalculatorModel,
  defaultContent: () => ({ type: kCalculatorTileType }),
  defaultName: () => t("DG.DocumentController.calculatorTitle"),
  isSingleton: true,
  getTitle: (tile: ITileLikeModel) => {
    return tile.title || t("DG.DocumentController.calculatorTitle")
  }
})

registerTileComponentInfo({
  type: kCalculatorTileType,
  TitleBar: CalculatorTitleBar,
  Component: CalculatorComponent,
  tileEltClass: kCalculatorTileClass,
  Icon: CalcIcon,
  shelf: {
    position: 5,
    labelKey: "DG.ToolButtonData.calcButton.title",
    hintKey: "DG.ToolButtonData.calcButton.toolTip"
  },
  isFixedWidth: true,
  isFixedHeight: true,
  // must be in sync with rendered size for auto placement code
  defaultHeight: 162,
  defaultWidth: 137
})

registerV2TileImporter("DG.Calculator", ({ v2Component, insertTile }) => {
  if (!isV2CalculatorComponent(v2Component)) return

  const { guid, componentStorage: { name = "", title = "" } } = v2Component

  const content: ICalculatorSnapshot = {
    type: kCalculatorTileType,
    name
  }
  const calculatorTileSnap: ITileModelSnapshotIn = {
    id: toV3Id(kCalculatorIdPrefix, guid), name, _title: title, content
  }
  const calculatorTile = insertTile(calculatorTileSnap)

  return calculatorTile
})

registerComponentHandler(kV2CalculatorType, {
  create() {
    return { content: { type: kCalculatorTileType } }
  },
  get(content) {
    return {}
  }
})
