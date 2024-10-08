import { SetOptional } from "type-fest"
import {AttributeType} from "../models/data/attribute"

export type AllowStringIds<T> = Omit<T, "guid" | "id"> & {
  guid: number | string
  id: number | string
}

export interface ICodapV2Attribute {
  guid: number
  id: number
  name: string
  type?: string | null
  title?: string
  cid?: string
  defaultMin?: number
  defaultMax?: number
  description?: string | null
  categoryMap?: any
  _categoryMap?: any
  colormap?: any
  _colormap?: any
  blockDisplayOfEmptyCategories?: boolean
  // plugin bugs have led to documents in the field with values like `[true]`
  editable: boolean | unknown
  hidden: boolean
  renameable?: boolean
  deleteable?: boolean
  formula?: string
  deletedFormula?: string
  precision?: number | string | null
  unit?: string | null
}
// when exporting a v3 attribute to v2
export type ICodapV2AttributeV3 = AllowStringIds<ICodapV2Attribute>

export function isCodapV2Attribute(o: any): o is ICodapV2Attribute {
  return o.type === "DG.Attribute"
}

export const v3TypeFromV2TypeIndex: Array<AttributeType | undefined> = [
  // indices are numeric values of v2 types
  undefined, "numeric", "categorical", "date", "boundary", "color"
  // v2 type eNone === 0 which v3 codes as undefined
]

export function v3TypeFromV2TypeString(v2Type?: string | null): AttributeType | undefined {
  if (v2Type == null || v2Type === "none") return undefined
  if (v2Type === "nominal") return "categorical"
  return v2Type as AttributeType
}

export interface ICodapV2Case {
  id?: number
  guid: number
  itemID?: number
  parent?: number
  values: Record<string, number | string>
}

export interface ICodapV2Collection {
  attrs: ICodapV2Attribute[]
  cases: ICodapV2Case[]
  caseName: string | null
  childAttrName: string | null
  cid?: string
  collapseChildren: boolean | null
  defaults?: {
    xAttr: string
    yAttr: string
  }
  guid: number
  id?: number
  labels?: {
    singleCase?: string
    pluralCase?: string
    singleCaseWithArticle?: string
    setOfCases?: string
    setOfCasesWithArticle?: string
  }
  name: string
  parent?: number
  title: string
  type: "DG.Collection"
}
// when exporting a v3 collection to v2
type CollectionNotYetExported = "cases" | "caseName" | "childAttrName" | "collapseChildren"
export interface ICodapV2CollectionV3
  extends SetOptional<Omit<AllowStringIds<ICodapV2Collection>, "attrs">, CollectionNotYetExported> {
  attrs: ICodapV2AttributeV3[]
}

export interface ICodapV2DataContextMetadata {
  description?: string
}
export interface ICodapV2DataContext {
  type: "DG.DataContext"
  document?: number // id of containing document
  guid: number
  id: number
  flexibleGroupingChangeFlag: boolean
  name: string
  title: string
  collections: ICodapV2Collection[]
  description?: string
  metadata?: ICodapV2DataContextMetadata,
  // preventReorg: boolean
  // setAsideItems: this.get('dataSet').archiveSetAsideItems(),
  // contextStorage: this.contextStorage
}
// when exporting a v3 data set to v2 data context
type DCNotYetExported = "flexibleGroupingChangeFlag"
export interface ICodapV2DataContextV3
  extends SetOptional<Omit<AllowStringIds<ICodapV2DataContext>, "document" | "collections">, DCNotYetExported> {
  document: number | string
  collections: ICodapV2CollectionV3[]
}

export interface ICodapV2GlobalValue {
  // from DG.GlobalValue.toArchive
  name: string
  value: number
  guid: number
}

export interface IGuidLink<T extends string> {
  type: T
  id: number
}

export interface ICodapV2BaseComponentStorage {
  // from DG.Component.toArchive
  title?: string
  name?: string
  userSetTitle: boolean
  cannotClose: boolean
}

export interface ICodapV2CalculatorStorage extends ICodapV2BaseComponentStorage {
}

export interface ICodapV2SliderStorage extends ICodapV2BaseComponentStorage {
  // from SliderController.createComponentStorage
  _links_: {
    model: IGuidLink<"DG.GlobalValue">
  },
  lowerBound?: number
  upperBound?: number
  animationDirection: number
  animationMode: number
  restrictToMultiplesOf: number | null
  maxPerSecond: number | null
  userTitle: boolean
}

export interface ICodapV2TableStorage extends ICodapV2BaseComponentStorage {
  _links_: {
    context: IGuidLink<"DG.DataContextRecord">
  }
  attributeWidths: Array<{
    _links_: {
      attr: IGuidLink<"DG.Attribute">
    }
    width: number
  }>
  title: string
}

export interface ICodapV2WebViewStorage extends ICodapV2BaseComponentStorage {
  URL: string
}

export interface ICodapV2GameViewStorage extends ICodapV2BaseComponentStorage {
  currentGameUrl: string
  savedGameState?: unknown
}

interface ICodapV2Coordinates {
  x: number
  y: number
}

interface ICodapV2ProportionCoordinates {
  proportionX: number
  proportionY: number
}

interface ICodapV2ValueModel {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  values: Record<string, number>
}

interface ICodapV2CountAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  isShowingCount: boolean
  isShowingPercent: boolean
  percentKind: number
}

interface ICodapV2ConnectingLinesAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
}

interface ICodapV2MovableValueAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  isShowingCount: boolean
  isShowingPercent: boolean
  valueModels: ICodapV2ValueModel[]
}

interface ICodapV2MeanAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
}

interface ICodapV2MedianAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
}

interface ICodapV2StDevAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
}

interface ICodapV2StErrAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
  numStdErrs: number
}

interface ICodapV2MadAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
}

interface ICodapV2BoxPlotAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  equationCoordsArray: ICodapV2ProportionCoordinates[]
  showOutliers: boolean
  showICI: boolean
}

interface ICodapV2PlottedFunctionAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  adornmentKey: string
  expression: string
}

interface ICodapV2PlottedValueAdornment {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  adornmentKey: string
  expression: string
}

type ICodapV2Adornment = ICodapV2CountAdornment | ICodapV2ConnectingLinesAdornment | ICodapV2MovableValueAdornment |
                         ICodapV2MeanAdornment | ICodapV2MedianAdornment | ICodapV2StDevAdornment |
                         ICodapV2StErrAdornment | ICodapV2MadAdornment | ICodapV2PlottedFunctionAdornment |
                         ICodapV2PlottedValueAdornment | ICodapV2BoxPlotAdornment

interface ICodapV2MovablePointStorage {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  coordinates: ICodapV2Coordinates
}

interface ICodapV2MovableLineStorage {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  isInterceptLocked: boolean
  equationCoords: ICodapV2Coordinates | null
  intercept: number
  slope: number
  isVertical: boolean
  xIntercept: number
}

interface ICodapV2LSRL {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  isInterceptLocked: boolean
  equationCoords: ICodapV2Coordinates | null,
  showConfidenceBands: boolean
}

interface ICodapV2MultipleLSRLsStorage {
  isVisible: boolean
  enableMeasuresForSelection: boolean
  showSumSquares: boolean
  isInterceptLocked: boolean
  showConfidenceBands: boolean
  lsrls: ICodapV2LSRL[]
}

export interface ICodapV2PlotStorage {
  verticalAxisIsY2: boolean
  adornments: ICodapV2Adornment
  areSquaresVisible: boolean
  isLSRLVisible: boolean
  movableLineStorage: ICodapV2MovableLineStorage
  movablePointStorage: ICodapV2MovablePointStorage
  multipleLSRLsStorage: ICodapV2MultipleLSRLsStorage
  showMeasureLabels: boolean
}

export interface ICodapV2PlotModel {
  plotClass: string
  plotModelStorage: ICodapV2PlotStorage
}

export interface ICodapV2GraphStorage extends ICodapV2BaseComponentStorage {
  _links_: {
    context?: IGuidLink<"DG.DataContextRecord">
    hiddenCases: any[]
    xColl?: IGuidLink<"DG.Collection">
    xAttr?: IGuidLink<"DG.Attribute">
    yColl?: IGuidLink<"DG.Collection">
    yAttr?: IGuidLink<"DG.Attribute"> | Array<IGuidLink<"DG.Attribute">>
    y2Coll?: IGuidLink<"DG.Collection">
    y2Attr?: IGuidLink<"DG.Attribute">
    rightColl?: IGuidLink<"DG.Collection">
    rightAttr?: IGuidLink<"DG.Attribute">
  }
  displayOnlySelected: boolean
  legendRole: number
  legendAttributeType: number
  numberOfLegendQuantiles: number
  legendQuantilesAreLocked: boolean
  pointColor: string
  strokeColor: string
  pointSizeMultiplier: 1
  transparency: number
  strokeTransparency: number
  strokeSameAsFill: boolean
  isTransparent: boolean
  plotBackgroundColor?: string | null
  plotBackgroundOpacity: number
  plotBackgroundImageLockInfo: any
  plotBackgroundImage: string
  xRole: number
  xAttributeType: number
  yRole: number
  yAttributeType: number
  y2Role: number
  y2AttributeType: number
  topRole: number
  topAttributeType: number
  rightRole: number
  rightAttributeType: number
  xAxisClass: string
  xLowerBound?: number
  xUpperBound?: number
  yAxisClass: string
  yLowerBound?: number
  yUpperBound?: number
  y2AxisClass: string
  y2LowerBound?: number
  y2UpperBound?: number
  topAxisClass: string
  rightAxisClass: string
  plotModels: ICodapV2PlotModel[]
}

export interface ICodapV2MapLayerStorage {
  _links_: {
    context: IGuidLink<"DG.DataContextRecord">
    hiddenCases: any[],
    legendColl?: IGuidLink<"DG.Collection">,
    // We sometimes see an array of links here
    legendAttr?: IGuidLink<"DG.Attribute"> | IGuidLink<"DG.Attribute">[],
  }
  legendRole: number
  legendAttributeType: number
  isVisible: boolean
  strokeSameAsFill: boolean
  // Polygons
  areaColor?: string
  areaTransparency?: number
  areaStrokeColor?: string
  areaStrokeTransparency?: number
  // Points
  pointColor?: string
  strokeColor?: string
  pointSizeMultiplier?: number
  transparency?: number
  strokeTransparency?: number
  pointsShouldBeVisible?: boolean
  grid: { gridMultiplier: number, isVisible: boolean }
  connectingLines: { isVisible: boolean, enableMeasuresForSelection: boolean }
}

export interface ICodapV2MapStorage extends ICodapV2BaseComponentStorage {
  mapModelStorage: {
    center: { lat: number, lng: number }
    zoom: number
    baseMapLayerName: string
    gridMultiplier: number
    layerModels: ICodapV2MapLayerStorage[]
  }
}

export interface ICodapV2GuideStorage extends ICodapV2BaseComponentStorage {
  currentItemIndex?: number
  isVisible?: boolean
  items: Array<{ itemTitle: string, url: string }>
}

export interface ICodapV2BaseComponent {
  type: string  // e.g. "DG.TableView", "DG.GraphView", "DG.GuideView", etc.
  guid: number
  id?: number
  componentStorage: Record<string, any>
  layout: {
    width: number
    height: number
    left: number
    top: number
    isVisible: boolean
    zIndex?: number
  }
  savedHeight: number | null
}

export interface ICodapV2CalculatorComponent extends ICodapV2BaseComponent {
  type: "DG.Calculator"
  componentStorage: ICodapV2CalculatorStorage
}
export const isV2CalculatorComponent = (component: ICodapV2BaseComponent): component is ICodapV2CalculatorComponent =>
  component.type === "DG.Calculator"

export interface ICodapV2SliderComponent extends ICodapV2BaseComponent {
  type: "DG.SliderView",
  componentStorage: ICodapV2SliderStorage
}
export const isV2SliderComponent = (component: ICodapV2BaseComponent): component is ICodapV2SliderComponent =>
  component.type === "DG.SliderView"
export interface ICodapV2TableComponent extends ICodapV2BaseComponent {
  type: "DG.TableView"
  componentStorage: ICodapV2TableStorage
}
export const isV2TableComponent = (component: ICodapV2BaseComponent): component is ICodapV2TableComponent =>
              component.type === "DG.TableView"
export interface ICodapV2WebViewComponent extends ICodapV2BaseComponent {
  type: "DG.WebView"
  componentStorage: ICodapV2WebViewStorage
}
export const isV2WebViewComponent =
  (component: ICodapV2BaseComponent): component is ICodapV2WebViewComponent => component.type === "DG.WebView"
export interface ICodapGameViewComponent extends ICodapV2BaseComponent {
  type: "DG.GameView"
  componentStorage: ICodapV2GameViewStorage
}
export const isV2GameViewComponent =
  (component: ICodapV2BaseComponent): component is ICodapGameViewComponent => component.type === "DG.GameView"

export interface ICodapV2GraphComponent extends ICodapV2BaseComponent {
  type: "DG.GraphView"
  componentStorage: ICodapV2GraphStorage
}
export const isV2GraphComponent = (component: ICodapV2BaseComponent): component is ICodapV2GraphComponent =>
              component.type === "DG.GraphView"

export interface ICodapV2MapComponent extends ICodapV2BaseComponent {
  type: "DG.MapView"
  componentStorage: ICodapV2MapStorage
}
export const isV2MapComponent = (component: ICodapV2BaseComponent): component is ICodapV2MapComponent =>
              component.type === "DG.MapView"

export interface ICodapV2GuideComponent extends ICodapV2BaseComponent {
  type: "DG.GuideView"
  componentStorage: ICodapV2GuideStorage
}
export const isV2GuideComponent = (component: ICodapV2BaseComponent): component is ICodapV2GuideComponent =>
              component.type === "DG.GuideView"

export type CodapV2Component = ICodapV2GraphComponent | ICodapV2GuideComponent | ICodapV2TableComponent

export interface ICodapV2DocumentJson {
  type?: string         // "DG.Document"
  id?: number
  guid: number
  name: string
  appName: string       // "DG"
  appVersion: string
  appBuildNum: string
  metadata: Record<string, any>
  // these three are maintained as maps internally but serialized as arrays
  components: CodapV2Component[]
  contexts: ICodapV2DataContext[]
  globalValues: ICodapV2GlobalValue[]
  lang?: string
  idCount?: number
}

export function isCodapV2Document(content: unknown): content is ICodapV2DocumentJson {
  if (!content || typeof content !== "object") return false
  const hasV2AppName = "appName" in content && content.appName === "DG"
  const hasNoAppName = !("appName" in content) || !content.appName
  return ((hasV2AppName || hasNoAppName) &&
          "components" in content && Array.isArray(content.components) &&
          "contexts" in content && Array.isArray(content.contexts))
}
