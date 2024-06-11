import { ToolbarElements as toolbar } from "./toolbar-elements"

export const ComponentElements = {
  tooltips: {
    tableToolShelfIcon: "Open a case table for each data set(ctrl-alt-t)",
    graphToolShelfIcon: "Make a graph (ctrl-alt-g)",
    mapToolShelfIcon: "Make a map",
    sliderToolShelfIcon: "Make a slider (ctrl-alt-s)",
    calculatorToolShelfIcon: "Open/close the calculator (ctrl-alt-c)",
    minimizeComponent: "Minimize or expand this Component",
    closeComponent: "Close this Component",
    inspectorPanel: "Change what is shown along with the points",
    graphResizeButton: "Move the points to new random positions",
    graphHideShowButton: "Show all cases or hide selected/unselected cases",
    graphDisplayValuesButton: "Change what is shown along with the points",
    graphDisplayConfigButton: "Configure the display differently",
    graphDisplayStylesButton: "Change the appearance of the display",
    graphCameraButton: "Save the image",
    mapZoomInButton: "Zoom in",
    mapZoomOutButton: "Zoom out",
    mapResizeButton: "Rescale display to show all the data",
    mapHideShowButton: "Show all cases or hide selected/unselected cases",
    mapDisplayValuesButton: "Change what is shown along with the points",
    mapDisplayConfigButton: "Change the appearance of the map layers",
    mapCameraButton: "Save the image",
    tableSwitchCaseCard: "Switch to case card view of the data",
    tableDatasetInfoButton: "Display information about dataset",
    tableResizeButton: "Resize all columns to fit data",
    tableDeleteCasesButton: "Delete selected or unselected cases",
    tableHideShowButton: "Show all cases or hide selected/unselected cases",
    tableRulerButton: "Make new attributes. Export case data."
  },
  getComponentSelector(component) {
    return cy.get(`.codap-component[data-testid$=${component}]`)
  },
  getComponentTile(component, index = 0) {
    return this.getComponentSelector(component).then(element => {
      return element.eq(index)
    })
  },
  getComponentTitleBar(component, index = 0) {
    return this.getComponentTile(component, index).find(".component-title-bar")
  },
  checkComponentFocused(component, focused = true, index = 0) {
    const check = `${focused ? "" : "not."}have.class`
    this.getComponentTitleBar(component, index).should(check, "focusTile")
  },
  getComponentTitle(component, index = 0) {
    return this.getComponentTile(component, index).find("[data-testid=editable-component-title]")
  },
  changeComponentTitle(component: string, title: string, index = 0) {
    this.getComponentTitle(component, index).click().find("[data-testid=title-text-input]").type(`${title}{enter}`)
  },
  getInspectorPanel() {
    return cy.get("[data-testid=inspector-panel]")
  },
  getMinimizeButton(component, index = 0) {
    return this.getComponentTile(component, index).find("[data-testid=component-minimize-button]")
  },
  getCloseButton(component, index = 0) {
    return this.getComponentTile(component, index).find("[data-testid=component-close-button]")
  },
  getResizeControl(component, index = 0) {
    return this.getComponentTile(component, index).find(".codap-component-corner.bottom-right")
  },
  checkToolTip(element, tooltipText) {
    cy.wrap(element).invoke("attr", "title").should("contain", tooltipText)
  },
  getIconFromToolshelf(component) {
    return toolbar.getToolShelfIcon(component)
  },
  selectTile(component, index = 0) {
    cy.get(".codap-container").click("bottom")
    this.getComponentTile(component, index).click()
  },
  checkComponentDoesNotExist(component) {
    this.getComponentSelector(component).should("not.exist")
  },
  checkComponentExists(component) {
    this.getComponentSelector(component).should("exist")
  },
  moveComponent(component, x, index = 0) {
    this.getComponentTitle(component, index)
      .trigger("mousedown", { force: true })
      .wait(100)
      .trigger("mousemove", {force: true, clientX: x})
      .wait(100)
      .trigger("mouseup", { force: true })
  },
  closeComponent(component, index = 0) {
    this.selectTile(component, index)
    this.getCloseButton(component, index).click({ force: true })
  }
}
