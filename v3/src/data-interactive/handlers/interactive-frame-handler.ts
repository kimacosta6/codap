import { isWebViewModel } from "../../components/web-view/web-view-model"
import { appState } from "../../models/app-state"
import { toV2Id } from "../../utilities/codap-utils"
import { t } from "../../utilities/translation/translate"
import { registerDIHandler } from "../data-interactive-handler"
import { DIHandler, DIResources, diNotImplementedYet, DIValues, DIInteractiveFrame } from "../data-interactive-types"

const noIFResult = {success: false, values: {error: t("V3.DI.Error.interactiveFrameNotFound")}} as const

export const diInteractiveFrameHandler: DIHandler = {
  get(resources: DIResources) {
    const { interactiveFrame } = resources
    if (!interactiveFrame) return noIFResult
    
    const dimensions = appState.document.content?.getTileDimensions(interactiveFrame.id)
    const webViewContent = isWebViewModel(interactiveFrame.content) ? interactiveFrame.content : undefined
    const {
      externalUndoAvailable, preventAttributeDeletion, preventDataContextReorg, respectEditableItemAttribute,
      state: savedState, standaloneUndoModeAvailable, version
    } = webViewContent ?? {}
    const values: DIInteractiveFrame = {
      dimensions,
      externalUndoAvailable,
      id: toV2Id(interactiveFrame.id),
      name: interactiveFrame.title,
      preventAttributeDeletion,
      preventBringToFront: interactiveFrame.preventBringToFront,
      preventDataContextReorg,
      respectEditableItemAttribute,
      savedState,
      standaloneUndoModeAvailable,
      title: interactiveFrame.title,
      version,
    }
    return { success: true, values }
  },
  // Notify needs to handle:
  // dirty: true
  // image: ...
  // request: openGuideConfiguration | indicateBusy | indicateIdle
  // cursorMode: true
  notify: diNotImplementedYet,
  update(resources: DIResources, values?: DIValues) {
    const { interactiveFrame } = resources
    if (!interactiveFrame) return noIFResult
    const webViewContent = isWebViewModel(interactiveFrame.content) ? interactiveFrame.content : undefined
    // CODAP v2 seems to ignore interactiveFrame updates when an array is passed for values
    if (Array.isArray(values)) return { success: true }

    const {
      cannotClose, dimensions, externalUndoAvailable, name, preventAttributeDeletion, preventBringToFront,
      preventDataContextReorg, respectEditableItemAttribute, standaloneUndoModeAvailable, title, version
    } = values as DIInteractiveFrame
    interactiveFrame.applyModelChange(() => {
      if (cannotClose) interactiveFrame.setCannotClose(cannotClose)
      if (dimensions) {
        appState.document.content?.setTileDimensions(interactiveFrame.id, dimensions)
      }
      if (externalUndoAvailable != null) webViewContent?.setExternalUndoAvailable(externalUndoAvailable)
      if (name) interactiveFrame.setTitle(name)
      if (preventAttributeDeletion != null) webViewContent?.setPreventAttributeDeletion(preventAttributeDeletion)
      if (preventBringToFront != null) interactiveFrame.setPreventBringToFront(preventBringToFront)
      if (preventDataContextReorg != null) webViewContent?.setPreventDataContextReorg(preventDataContextReorg)
      if (respectEditableItemAttribute != null) {
        webViewContent?.setRespectEditableItemAttribute(respectEditableItemAttribute)
      }
      if (standaloneUndoModeAvailable != null) {
        webViewContent?.setStandaloneUndoModeAvailable(standaloneUndoModeAvailable)
      }
      if (title) interactiveFrame.setTitle(title)
      if (version) webViewContent?.setVersion(version)
    })
    return { success: true }
  }
}

registerDIHandler("interactiveFrame", diInteractiveFrameHandler)
