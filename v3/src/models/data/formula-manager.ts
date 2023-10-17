import { comparer, makeObservable, observable, reaction } from "mobx"
import { ICase } from "./data-set-types"
import { onAnyAction } from "../../utilities/mst-utils"
import {
  getFormulaDependencies, formulaError, safeSymbolName, reverseDisplayNameMap, getLocalAttrCasesToRecalculate,
  getLookupCasesToRecalculate
} from "./formula-utils"
import {
  DisplayNameMap, IFormulaDependency, GLOBAL_VALUE, LOCAL_ATTR, ILocalAttributeDependency, IGlobalValueDependency,
  ILookupDependency, CASE_INDEX_FAKE_ATTR_ID, CANONICAL_NAME
} from "./formula-types"
import { IDataSet } from "./data-set"
import { AddCasesAction, SetCaseValuesAction } from "./data-set-actions"
import { IGlobalValueManager } from "../global/global-value-manager"
import { IFormula } from "./formula"
import { isAlive } from "@concord-consortium/mobx-state-tree"
import { AttributeFormulaAdapter } from "./attribute-formula-adapter"
import { PlottedValueFormulaAdapter } from "./plotted-value-formula-adapter"

export interface IFormulaMetadata {
  formula: IFormula
  registeredDisplay: string
  isInitialized: boolean
  adapter: IFormulaManagerAdapter
  dispose?: () => void
}

// Note that specific formula adapters might extend this interface and provide more information.
// `dataSetId` is the required minimum, as each formula is always associated with a single data set that is considered
// to be the "local one" (e.g. any formula's symbol is resolved to an attribute of this data set).
export interface IFormulaExtraMetadata {
  dataSetId: string
  attributeId?: string
}

export interface IFormulaContext {
  formula: IFormula
  dataSet: IDataSet
}

export interface IDataSetMetadata {
  dispose: () => void
}

export interface IFormulaAdapterApi {
  getDatasets: () => Map<string, IDataSet>
  getGlobalValueManager: () => IGlobalValueManager | undefined
  getFormulaContext(formulaId: string): IFormulaContext
  getFormulaExtraMetadata(formulaId: string): IFormulaExtraMetadata
}

export interface IFormulaManagerAdapter {
  type: string
  getAllFormulas: () => ({ formula: IFormula, extraMetadata?: any })[]
  recalculateFormula: (formulaContext: IFormulaContext, extraMetadata: any,
    casesToRecalculateDesc?: ICase[] | "ALL_CASES") => void
  setupFormulaObservers: (formulaContext: IFormulaContext, extraMetadata: any, recalculate: () => void) => () => void
  getFormulaError: (formulaContext: IFormulaContext, extraMetadata: any) => undefined | string
  setFormulaError: (formulaContext: IFormulaContext, extraMetadata: any, errorMsg: string) => void
}

export class FormulaManager {
  formulaMetadata = new Map<string, IFormulaMetadata>()
  extraMetadata = new Map<string, IFormulaExtraMetadata>()

  @observable dataSets = new Map<string, IDataSet>()
  dataSetMetadata = new Map<string, IDataSetMetadata>()
  globalValueManager?: IGlobalValueManager

  adapters: IFormulaManagerAdapter[] = [
    new AttributeFormulaAdapter(this.getAdapterApi()),
    new PlottedValueFormulaAdapter(this.getAdapterApi())
  ]

  constructor() {
    makeObservable(this)
    this.registerAllFormulas()
  }

  getAdapterApi() {
    return {
      getDatasets: () => this.dataSets,
      getGlobalValueManager: () => this.globalValueManager,
      getFormulaContext: (formulaId: string) => this.getFormulaContext(formulaId),
      getFormulaExtraMetadata: (formulaId: string) => this.getExtraMetadata(formulaId)
    }
  }

  addDataSet(dataSet: IDataSet) {
    this.removeDataSet(dataSet.id)
    this.observeDatasetChanges(dataSet)
    this.dataSets.set(dataSet.id, dataSet)
  }

  removeDataSet(dataSetId: string) {
    const metadata = this.dataSetMetadata.get(dataSetId)
    if (metadata) {
      metadata.dispose()
      this.dataSetMetadata.delete(dataSetId)
    }
    this.dataSets.delete(dataSetId)
  }

  addGlobalValueManager(globalValueManager: IGlobalValueManager) {
    this.globalValueManager = globalValueManager
  }

  getFormulaMetadata(formulaId: string) {
    const formulaMetadata = this.formulaMetadata.get(formulaId)
    if (!formulaMetadata) {
      throw new Error(`Formula ${formulaId} not registered`)
    }
    return formulaMetadata
  }

  updateFormulaMetadata(formulaId: string, metadata: Partial<IFormulaMetadata>) {
    const prevMetadata = this.getFormulaMetadata(formulaId)
    this.formulaMetadata.set(formulaId, { ...prevMetadata, ...metadata })
  }

  getExtraMetadata(formulaId: string) {
    const extraMetadata = this.extraMetadata.get(formulaId)
    if (!extraMetadata) {
      throw new Error(`Formula ${formulaId} not registered`)
    }
    return extraMetadata
  }

  // Retrieves formula context like its attribute, dataset, etc. It also validates correctness of the formula
  // and its context.
  getFormulaContext(formulaId: string) {
    const formulaMetadata = this.getFormulaMetadata(formulaId)
    const extraMetadata = this.getExtraMetadata(formulaId)
    const dataSet = this.dataSets.get(extraMetadata.dataSetId)
    if (!dataSet) {
      throw new Error(`Dataset ${extraMetadata.dataSetId} not available`)
    }
    return { dataSet, ...formulaMetadata }
  }

  recalculateAllFormulas() {
    this.formulaMetadata.forEach((metadata, formulaId) => {
      this.recalculateFormula(formulaId)
    })
  }

  recalculateFormula(formulaId: string, casesToRecalculate?: ICase[] | "ALL_CASES") {
    const formulaContext = this.getFormulaContext(formulaId)
    const { adapter, isInitialized } = formulaContext
    if (!isInitialized) {
      return
    }
    const extraMetadata = this.getExtraMetadata(formulaId)
    adapter.recalculateFormula(formulaContext, extraMetadata, casesToRecalculate)
  }

  getAllFormulas() {
    return this.adapters.flatMap(a => a.getAllFormulas())
  }

  registerAllFormulas() {
    reaction(() => {
      // Observe all the formulas
      const result: Record<string, string> = {}
      this.getAllFormulas().forEach(({ formula }) => {
        result[formula.id] = formula.display
      })
      return result
    }, () => {
      this.unregisterDeletedFormulas()
      // Register formulas. For simplicity, we unregister all formulas and register them again when canonical form is
      // updated. Note that even empty formulas are registered, so the metadata is always available when cycle detection
      // is executed.
      const updatedFormulas: string[] = []
      this.adapters.forEach(adapter => {
        adapter.getAllFormulas().forEach(({ formula, extraMetadata }) => {
          const metadata = this.formulaMetadata.get(formula.id)
          if (!metadata || metadata.registeredDisplay !== formula.display) {
            this.unregisterFormula(formula.id)
            this.registerFormula(formula, adapter, extraMetadata)
            formula.updateCanonicalFormula()
            updatedFormulas.push(formula.id)
          }
        })
      })
      updatedFormulas.forEach(formulaId => {
        const errorPresent = this.registerFormulaErrors(formulaId)
        if (!errorPresent) {
          this.updateFormulaMetadata(formulaId, { isInitialized: true })
          this.setupFormulaObservers(formulaId)
          this.recalculateFormula(formulaId)
        }
      })
    }, {
      equals: comparer.structural,
      fireImmediately: true,
      name: "FormulaManager.registerAllFormulas.reaction"
    })
  }

  unregisterDeletedFormulas() {
    this.formulaMetadata.forEach((metadata, formulaId) => {
      if (!isAlive(metadata.formula)) {
        this.unregisterFormula(formulaId)
      }
    })
  }

  unregisterFormula(formulaId: string) {
    const formulaMetadata = this.formulaMetadata.get(formulaId)
    if (formulaMetadata) {
      formulaMetadata.dispose?.() // dispose MST observers
      this.formulaMetadata.delete(formulaId)
    }
    this.extraMetadata.delete(formulaId)
  }

  registerFormula(formula: IFormula, adapter: IFormulaManagerAdapter, extraMetadata: IFormulaExtraMetadata) {
    this.formulaMetadata.set(formula.id, {
      formula,
      adapter,
      registeredDisplay: formula.display,
      isInitialized: false
    })
    this.extraMetadata.set(formula.id, extraMetadata)
  }

  registerFormulaErrors(formulaId: string) {
    const formulaContext = this.getFormulaContext(formulaId)
    const extraMetadata = this.getExtraMetadata(formulaId)
    const { adapter, formula } = formulaContext
    // Generic errors that can be applied to all the formulas:
    if (formula.syntaxError) {
      adapter.setFormulaError(
        formulaContext, extraMetadata, formulaError("DG.Formula.SyntaxErrorMiddle", [ formula.syntaxError ])
      )
      return true
    }
    // Errors specific to given formula context (e.g. attribute formulas can have dependency cycle):
    const formulaTypeSpecificError = adapter.getFormulaError(formulaContext, extraMetadata)
    if (formulaTypeSpecificError) {
      adapter.setFormulaError(formulaContext, extraMetadata, formulaTypeSpecificError)
      return true
    }
    return false
  }

  getDisplayNameMapForFormula(formulaId: string, options?: { useSafeSymbolNames: boolean }) {
    const { dataSet: localDataSet } = this.getFormulaContext(formulaId)
    const { useSafeSymbolNames } = options || { useSafeSymbolNames: true }

    const displayNameMap: DisplayNameMap = {
      localNames: {},
      dataSet: {}
    }

    const mapAttributeNames = (dataSet: IDataSet, localPrefix: string, _useSafeSymbolNames: boolean) => {
      const result: Record<string, string> = {}
      dataSet.attributes.forEach(attr => {
        const key = _useSafeSymbolNames ? safeSymbolName(attr.name) : attr.name
        result[key] = `${CANONICAL_NAME}${localPrefix}${attr.id}`
      })
      return result
    }

    displayNameMap.localNames = {
      ...mapAttributeNames(localDataSet, LOCAL_ATTR, useSafeSymbolNames),
      // caseIndex is a special name supported by formulas. It essentially behaves like a local data set attribute
      // that returns the current, 1-based index of the case in its collection group.
      caseIndex: `${CANONICAL_NAME}${LOCAL_ATTR}${CASE_INDEX_FAKE_ATTR_ID}`
    }

    this.globalValueManager?.globals.forEach(global => {
      const key = useSafeSymbolNames ? safeSymbolName(global.name) : global.name
      displayNameMap.localNames[key] = `${CANONICAL_NAME}${GLOBAL_VALUE}${global.id}`
    })

    this.dataSets.forEach(dataSet => {
      if (dataSet.name) {
        displayNameMap.dataSet[dataSet.name] = {
          id: `${CANONICAL_NAME}${dataSet.id}`,
          // No prefix is necessary for external attributes. They always need to be resolved manually by custom
          // mathjs functions (like "lookupByIndex"). Also, it's never necessary to use safe names, as these names
          // are string constants, not a symbols, so MathJS will not care about special characters there.
          attribute: mapAttributeNames(dataSet, "", false)
        }
      }
    })

    return displayNameMap
  }

  getCanonicalNameMap(formulaId: string) {
    const displayNameMap = this.getDisplayNameMapForFormula(formulaId, { useSafeSymbolNames: false })
    return reverseDisplayNameMap(displayNameMap)
  }

  setupFormulaObservers(formulaId: string) {
    const formulaContext = this.getFormulaContext(formulaId)
    const formulaMetadata = this.getFormulaMetadata(formulaId)
    const extraMetadata = this.getExtraMetadata(formulaId)
    const { formula, adapter } = formulaMetadata
    if (formula.empty) {
      return
    }
    const formulaDependencies = getFormulaDependencies(formula.canonical, extraMetadata.attributeId)
    const disposeLocalAttributeObserver = this.observeLocalAttributes(formulaId, formulaDependencies)
    const disposeGlobalValueObservers = this.observeGlobalValues(formulaId, formulaDependencies)
    const disposeLookupObservers = this.observeLookup(formulaId, formulaDependencies)
    const disposeAdapterObservers = adapter.setupFormulaObservers(formulaContext, extraMetadata, () => {
      this.recalculateFormula(formula.id)
    })

    this.formulaMetadata.set(formulaId, {
      ...formulaMetadata,
      dispose: () => {
        disposeLocalAttributeObserver()
        disposeGlobalValueObservers.forEach(disposeGlobalValObserver => disposeGlobalValObserver())
        disposeLookupObservers.forEach(disposeLookupObserver => disposeLookupObserver())
        disposeAdapterObservers()
      },
    })
  }

  observeDatasetChanges(dataSet: IDataSet) {
    // When any collection is added or removed, or attribute is moved between collections,
    // we need to recalculate all formulas.
    const disposeAttrCollectionReaction = reaction(
      () => Object.fromEntries(dataSet.collections.map(c => [ c.id, c.attributes.map(a => a?.id) ])),
      () => {
        this.unregisterDeletedFormulas()
        this.recalculateAllFormulas()
      },
      {
        equals: comparer.structural,
        name: "FormulaManager.observeDatasetChanges.reaction [collections]"
      }
    )
    // When any attribute name is updated, we need to update display formulas. We could make this more granular,
    // and observe only dependant attributes, but it doesn't seem necessary for now.
    const disposeAttrNameReaction = reaction(
      () => dataSet.attrNameMap,
      () => {
        this.unregisterDeletedFormulas()
        this.formulaMetadata.forEach(({ formula }) => {
          formula.updateDisplayFormula()
          // Note that when attribute is removed or renamed, this can also affect the formula's canonical form.
          // 1. Attribute is removed - its ID needs to be removed from the canonical form and the formula should be
          //    recalculated (usually to show the error about undefined symbol).
          // 2. Attribute is renamed - if the previous display form had undefined symbols, they might now be resolved
          //    to the renamed attribute. This means that the canonical form needs to be updated.
          const oldCanonical = formula.canonical
          formula.updateCanonicalFormula()
          if (oldCanonical !== formula.canonical) {
            this.recalculateFormula(formula.id)
          }
        })
      },
      {
        equals: comparer.structural,
        name: "FormulaManager.observeDatasetChanges.reaction [attrNameMap]"
      }
    )
    const dispose = () => {
      disposeAttrCollectionReaction()
      disposeAttrNameReaction()
    }
    this.dataSetMetadata.set(dataSet.id, { dispose })
  }

  observeLocalAttributes(formulaId: string, formulaDependencies: IFormulaDependency[]) {
    const { dataSet } = this.getFormulaContext(formulaId)

    const localAttrDependencies =
      formulaDependencies.filter(d => d.type === "localAttribute") as ILocalAttributeDependency[]

    // Observe local dataset attribute changes
    const disposeDatasetObserver = onAnyAction(dataSet, mstAction => {
      let casesToRecalculate: ICase[] | "ALL_CASES" = []
      switch (mstAction.name) {
        case "addCases": {
          // recalculate all new cases
          casesToRecalculate = (mstAction as AddCasesAction).args[0] || []
          break
        }
        case "setCaseValues": {
          // recalculate cases with dependency attribute updated
          const cases = (mstAction as SetCaseValuesAction).args[0] || []
          casesToRecalculate = getLocalAttrCasesToRecalculate(cases, localAttrDependencies)
          break
        }
        default:
          break
      }

      if (casesToRecalculate.length > 0) {
        this.recalculateFormula(formulaId, casesToRecalculate)
      }
    })

    return disposeDatasetObserver
  }

  observeGlobalValues(formulaId: string, formulaDependencies: IFormulaDependency[]) {
    const globalValueDependencies =
      formulaDependencies.filter(d => d.type === "globalValue") as IGlobalValueDependency[]

    const disposeGlobalValueObservers = globalValueDependencies.map(dependency =>
      [
        // Recalculate formula when global value dependency is updated.
        reaction(
          () => this.globalValueManager?.getValueById(dependency.globalId)?.value,
          () => this.recalculateFormula(formulaId),
          { name: "FormulaManager.observeGlobalValues.reaction [globalValue]" }
        ),
        // Update display form of the formula when global value name is updated.
        reaction(
          () => this.globalValueManager?.getValueById(dependency.globalId)?.name,
          () => this.getFormulaContext(formulaId).formula.updateDisplayFormula(),
          { name: "FormulaManager.observeGlobalValues.reaction [globalValueName]" }
        ),
      ]
    ).flat()

    return disposeGlobalValueObservers
  }

  observeLookup(formulaId: string, formulaDependencies: IFormulaDependency[]) {
    const lookupDependencies: ILookupDependency[] =
      formulaDependencies.filter(d => d.type === "lookup") as ILookupDependency[]

    const disposeLookupObservers = lookupDependencies.map(dependency => {
      const externalDataSet = this.dataSets.get(dependency.dataSetId)
      if (!externalDataSet) {
        throw new Error(`External dataSet with id "${dependency.dataSetId}" not found`)
      }

      return onAnyAction(externalDataSet, mstAction => {
        let casesToRecalculate: ICase[] | "ALL_CASES" = []
        switch (mstAction.name) {
          // TODO: these rules are very broad, think if there are some ways to optimize and narrow them down.
          case "addCases": {
            casesToRecalculate = "ALL_CASES"
            break
          }
          case "removeCases": {
            casesToRecalculate = "ALL_CASES"
            break
          }
          case "setCaseValues": {
            // recalculate cases with dependency attribute updated
            const cases = (mstAction as SetCaseValuesAction).args[0] || []
            casesToRecalculate = getLookupCasesToRecalculate(cases, dependency)
            break
          }
          default:
            break
        }

        this.recalculateFormula(formulaId, casesToRecalculate)
      })
    })

    return disposeLookupObservers
  }
}
