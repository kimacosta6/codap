import { GraphTileElements as graph } from "../support/elements/graph-tile"
import { ComponentElements as c } from "../support/elements/component-elements"
import { AxisElements as ae } from "../support/elements/axis-elements"
import { ToolbarElements as toolbar } from "../support/elements/toolbar-elements"

context("Graph adornments", () => {
  beforeEach(function () {
    const queryParams = "?sample=mammals&dashboard&mouseSensor"
    const url = `${Cypress.config("index")}${queryParams}`
    cy.visit(url)
    cy.wait(2500)
  })

  it("shows inspector palette when Display Values button is clicked", () => {
    c.selectTile("graph", 0)
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
  })
  it("adds a count to graph when Count checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")

    // add undo/redo to this test
    toolbar.getUndoTool().click()
    ae.getAxisLabel("left").should("have.length", 0)
    cy.wait(250)
    toolbar.getRedoTool().click()
    ae.getAxisLabel("left").should("have.length", 1)
    cy.wait(250)


    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-count-count]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("exist")
    // this test is still flaky, sometimes returning 21 and sometimes returning 24
    // cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("have.text", "21")
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-count-count]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // Add a test undo/redo for the count checkbox

    toolbar.getUndoTool().click()
    cy.wait(250)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("exist")
    // this test is flaky, sometimes returning 21 and sometimes returning 24
    // cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("have.text", "21")

    toolbar.getRedoTool().click()
    cy.wait(250)

    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

  })
  it("adds a percent to graph when Percent checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Diet", "bottom")
    cy.dragAttributeToTarget("table", "Habitat", "left")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-count-percent]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 9)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 9)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").first().should("have.text", "0%")
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-count-percent]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // add tests for undo and redo for percent checkbox

    toolbar.getUndoTool().click()
    cy.wait(250)

    // The percent should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 9)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 9)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").first().should("have.text", "0%")

    // The percent should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")


  })
  it("adds mean adornment to graph when Mean checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-mean]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean]").should("exist")
    cy.get("*[data-testid^=mean-line]").should("exist")
    cy.get("*[data-testid^=mean-cover]").should("exist")
    cy.get("*[data-testid^=mean-tip]").should("exist").should("not.be.visible")
    // TODO: Test that mean-tip appears on mouseover
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are multiple means)
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-mean]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // add tests for undo and redo for Mean checkbox

    toolbar.getUndoTool().click()
    cy.wait(250)

    // The mean line should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean]").should("exist")
    cy.get("*[data-testid^=mean-line]").should("exist")
    cy.get("*[data-testid^=mean-cover]").should("exist")
    cy.get("*[data-testid^=mean-tip]").should("exist").should("not.be.visible")

    // The mean line should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
  })
  it("adds median adornment to graph when Median checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-median]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=median]").should("exist")
    cy.get("*[data-testid^=median-line]").should("exist")
    cy.get("*[data-testid^=median-cover]").should("exist")
    cy.get("*[data-testid^=median-tip]").should("exist").should("not.be.visible")
    // TODO: Test that median-tip appears on mouseover
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are multiple medians)
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-median]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // add tests for undo and redo for median checkbox

    toolbar.getUndoTool().click()
    cy.wait(250)

    // The median line should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=median]").should("exist")
    cy.get("*[data-testid^=median-line]").should("exist")
    cy.get("*[data-testid^=median-cover]").should("exist")
    cy.get("*[data-testid^=median-tip]").should("exist").should("not.be.visible")

    // The median line should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
  })
  it("adds standard deviation adornment to graph when Standard Deviation checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-measuresOfSpread]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-standard-deviation]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=standard-deviation]").should("exist")
    cy.get("*[data-testid^=standard-deviation]").should("exist")
    cy.get("*[data-testid^=standard-deviation-cover]").should("not.exist")
    cy.get("*[data-testid^=standard-deviation-range]").should("exist")
    cy.get("*[data-testid^=standard-deviation-min]").should("exist")
    cy.get("*[data-testid^=standard-deviation-min-cover]").should("exist")
    cy.get("*[data-testid^=standard-deviation-max]").should("exist")
    cy.get("*[data-testid^=standard-deviation-max-cover]").should("exist")
    cy.get("*[data-testid^=standard-deviation-tip]").should("exist").should("not.be.visible")
    // TODO: Test that standard-deviation-tip appears on mouseover
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are
    // multiple standard deviations)
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-standard-deviation]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // add tests for undo and redo for standard deviation checkbox

    toolbar.getUndoTool().click()
    cy.wait(250)

    // The standard deviation adornment should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=standard-deviation]").should("exist")
    cy.get("*[data-testid^=standard-deviation]").should("exist")
    cy.get("*[data-testid^=standard-deviation-cover]").should("not.exist")
    cy.get("*[data-testid^=standard-deviation-range]").should("exist")
    cy.get("*[data-testid^=standard-deviation-min]").should("exist")
    cy.get("*[data-testid^=standard-deviation-min-cover]").should("exist")
    cy.get("*[data-testid^=standard-deviation-max]").should("exist")
    cy.get("*[data-testid^=standard-deviation-max-cover]").should("exist")
    cy.get("*[data-testid^=standard-deviation-tip]").should("exist").should("not.be.visible")
    cy.wait(250)

    // The standard deviation adornment should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
  })
  it("adds mean absolute deviation adornment to graph when Mean Absolute Deviation checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-measuresOfSpread]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-mean-absolute-deviation]")
      .should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean-absolute-deviation]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-cover]").should("not.exist")
    cy.get("*[data-testid^=mean-absolute-deviation-range]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-min]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-min-cover]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-max]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-max-cover]").should("exist")
    cy.get("*[data-testid^=mean-absolute-deviation-tip]").should("exist").should("not.be.visible")
    // TODO: Test that mean-absolute-deviation-tip appears on mouseover
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are
    // multiple mean absolute deviations)
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-mean-absolute-deviation]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

       // add tests for undo and redo for MAD

       toolbar.getUndoTool().click()
       cy.wait(250)

       // The MAD adornment should be visible again after an undo
       cy.get("[data-testid=graph-adornments-grid]").should("exist")
       cy.get("[data-testid=graph-adornments-grid]")
         .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
       cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
       cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
       cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean-absolute-deviation]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-cover]").should("not.exist")
       cy.get("*[data-testid^=mean-absolute-deviation-range]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-min]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-min-cover]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-max]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-max-cover]").should("exist")
       cy.get("*[data-testid^=mean-absolute-deviation-tip]").should("exist").should("not.be.visible")
       cy.wait(250)

       // The standard deviation adornment should be hidden after a redo
       toolbar.getRedoTool().click()
       cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
      })
  it("adds box plot adornment to the graph when Box Plot checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Height", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-boxPlotAndNormalCurve]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-box-plot]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=box-plot]").should("exist")
    cy.get("*[data-testid^=box-plot-line]").should("exist")
    cy.get("*[data-testid^=box-plot-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-range]").should("exist")
    cy.get("*[data-testid^=box-plot-min]").should("exist")
    cy.get("*[data-testid^=box-plot-min-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-max]").should("exist")
    cy.get("*[data-testid^=box-plot-max-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-lower]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-lower-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-upper]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-upper-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-label]").should("exist").should("not.be.visible")
    cy.get("*[data-testid^=box-plot-outlier]").should("not.exist")
    cy.get("*[data-testid^=box-plot-outlier-cover]").should("not.exist")
    // TODO: Test Show Outliers option. Test that labels appear on mouseover.


      // add tests for undo and redo for box plot

       toolbar.getUndoTool().click()
       cy.wait(250)

       // The box plot adornment should be invisible after an undo
       // how to test this one? bpCheckbox.should("not.be.visible")?
       cy.wait(250)

       // The box plot adornment should be visible again after a redo
       toolbar.getRedoTool().click()
       cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=box-plot]").should("exist")
    cy.get("*[data-testid^=box-plot-line]").should("exist")
    cy.get("*[data-testid^=box-plot-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-range]").should("exist")
    cy.get("*[data-testid^=box-plot-min]").should("exist")
    cy.get("*[data-testid^=box-plot-min-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-max]").should("exist")
    cy.get("*[data-testid^=box-plot-max-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-lower]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-lower-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-upper]").should("exist")
    cy.get("*[data-testid^=box-plot-whisker-upper-cover]").should("exist")
    cy.get("*[data-testid^=box-plot-label]").should("exist").should("not.be.visible")
    cy.get("*[data-testid^=box-plot-outlier]").should("not.exist")
    cy.get("*[data-testid^=box-plot-outlier-cover]").should("not.exist")
  })
  it("adds a least squares line to graph when Least Squares Line checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Mass", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()
    cy.get("[data-testid=adornment-show-confidence-bands-options]").find("input").should("have.attr", "disabled")
    cy.get("[data-testid=adornment-checkbox-lsrl]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl-cover]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl-equation-]").should("exist")
      .should(
        "contain.html",
        "<span><em>Speed</em> = −0.0014 (<em>Mass</em>) + 50<br>r<sup>2</sup> = 0.009</span>"
      )
    cy.get("*[data-testid=lsrl-confidence-band]").should("exist").should("not.have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-cover]").should("exist").should("not.have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-shading]").should("exist").should("not.have.attr", "d")
    cy.get("[data-testid=adornment-show-confidence-bands-options]").find("input").should("not.have.attr", "disabled")
    cy.get("[data-testid=adornment-show-confidence-bands-options]").click()
    cy.get("*[data-testid=lsrl-confidence-band]").should("have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-cover]").should("exist").should("have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-shading]").should("exist").should("have.attr", "d")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl-equation-]").should("exist")
      .should(
        "contain.html",
        // eslint-disable-next-line max-len
        "<span><em>Speed</em> = −0.0014 (<em>Mass</em>) + 50<br>r<sup>2</sup> = 0.009<br>SE<sub>slope</sub> = 0.003</span>"
      )
    // TODO: Test that mousing over equation highlights the line and vice versa
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are
    // multiple least squares lines)

    // TODO: Add a test undo/redo for the least squares line

    // toolbar.getUndoTool().click()
    // cy.wait(250)
    // Show Confidence Bands should not be visible after an undo
    // bug reported here: #187005022

    // TODO: Least square lines should not be visible after a second undo

  })
  it("adds movable labels for univariate measures to graph when Show Measure Labels checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    cy.get("[data-testid=adornment-checkbox-mean]").click()
    cy.get("[data-testid=adornment-checkbox-show-measure-labels]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean]").should("exist")
    cy.get("*[data-testid^=mean-line]").should("exist")
    cy.get("*[data-testid^=mean-cover]").should("exist")
    cy.get("*[data-testid^=mean-tip]").should("not.exist")
    cy.get("*[data-testid^=mean-measure-labels-tip]").should("exist")
      .should("be.visible")
      .should("have.text", "mean=10.79")
      .should("have.css", "top", "0px")
      // The exact value of left may vary slightly depending on browser, screen resolution, etc.
      // The below checks that the value is within an expected range to accommodate these variations.
      // Modeled after https://github.com/cypress-io/cypress/issues/14722#issuecomment-767367519
      .should("have.css", "left").should((left: string) => {
        expect(left).to.include("px")
        expect(parseInt(left, 10)).to.be.within(271, 273)
      })
    // TODO: Test drag and drop of label and saving of dropped coordinates
    cy.get("[data-testid=adornment-checkbox-show-measure-labels]").click()
    cy.get("*[data-testid^=mean-measure-labels-tip]").should("not.exist")
    // add tests for undo and redo for Show Measures label; checkbox
     toolbar.getUndoTool().click()
     cy.wait(250)

     // The Show Measures label should be visible again after an undo
     cy.get("[data-testid=graph-adornments-grid]").should("exist")
     cy.get("[data-testid=graph-adornments-grid]")
       .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
     cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
     cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
     cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=mean]").should("exist")

     // The Show Measures label should be hidden after a redo
     toolbar.getRedoTool().click()
     cy.get("*[data-testid^=mean-measure-labels-tip]").should("not.exist")
      })
  it("adds movable line to graph when Movable Line checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-movable-line]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line]").should("exist")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
      .find("[data-testid=movable-line-equation-]").should("not.be.empty")
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are multiple lines)
    // TODO: Test dragging of line and equation value changes
    // TODO: Test unpinning equation box from line
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-movable-line]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // add tests for undo and redo for Moveable Line checkbox
     toolbar.getUndoTool().click()
     cy.wait(250)

     // The Show Measures label should be visible again after an undo
     cy.get("[data-testid=graph-adornments-grid]").should("exist")
     cy.get("[data-testid=graph-adornments-grid]")
       .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
     cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
     cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
     cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line]").should("exist")
     cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
       .find("[data-testid=movable-line-equation-]").should("not.be.empty")

     // The Show Measures label should be hidden after a redo
     toolbar.getRedoTool().click()
     cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
  })
  it.skip("locks intercept of LSRL and movable line when Lock Intercept checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()
    cy.get("[data-testid=adornment-checkbox-intercept-locked]").find("input")
      .should("not.be.checked").should("have.attr", "disabled")
    cy.get("[data-testid=adornment-checkbox-lsrl]").click()
    cy.get("[data-testid=adornment-show-confidence-bands-options]").click()
    cy.get("*[data-testid=lsrl-confidence-band]").should("have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-cover]").should("exist").should("have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-shading]").should("exist").should("have.attr", "d")
    cy.get("[data-testid=adornment-checkbox-movable-line]").click()
    cy.get("[data-testid=adornment-checkbox-intercept-locked]").find("input").should("not.have.attr", "disabled")
    cy.get("[data-testid=adornment-checkbox-intercept-locked]").click()
    cy.get("[data-testid=adornment-show-confidence-bands-options]").find("input").should("have.attr", "disabled")
    cy.get("*[data-testid=lsrl-confidence-band]").should("not.have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-cover]").should("exist").should("not.have.attr", "d")
    cy.get("*[data-testid=lsrl-confidence-band-shading]").should("exist").should("not.have.attr", "d")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl-equation-]").should("exist")
      .should("not.contain.html", "r<sup>2</sup> = ")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
      .find("[data-testid=movable-line-equation-]")
      .should("not.contain.html", "(<em>Sleep</em>) + ")
    cy.get("[data-testid=adornment-checkbox-intercept-locked]").click()
    cy.get("[data-testid=adornment-show-confidence-bands-options]").find("input").should("not.have.attr", "disabled")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid=lsrl-equation-]").should("exist")
      .should("contain.html", "r<sup>2</sup> = ")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
      .find("[data-testid=movable-line-equation-]")
      .should("contain.html", "(<em>Sleep</em>) + ")

      // TODO: add tests for undo and redo for LSRL

  })
  it("adds movable point to graph when Movable Point checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-movable-point]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=movable-point]").should("exist")
    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are multiple points)
    // TODO: Test dragging of point
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-movable-point]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")

    // Adds a test for undo and redo of Moveable point
    toolbar.getUndoTool().click()
    cy.wait(250)

    // The Moveable point should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=movable-point]").should("exist")
    cy.wait(250)

    // The Moveable point should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
  })
  it("adds plotted function UI to graph when Plotted Function checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Mass", "left")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-function]").should("be.visible").click()
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 22\)/)
    cy.get("[data-testid=graph-adornments-banners]").should("exist")
    cy.get("[data-testid=plotted-function-control]").should("exist")
    cy.get("[data-testid=plotted-function-control-label]").should("exist")
    cy.get("[data-testid=plotted-function-control-value]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-function-control-label]").should("exist").should("have.text", "f() =")
    cy.get("[data-testid=plotted-function-control-value]").should("exist").should("have.text", "")
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-function]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)

    // Adds a test for undo and redo for plotted function checkbox
    toolbar.getUndoTool().click()
    cy.wait(250)

    // The plotted function should be visible again after an undo
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 22\)/)
    cy.get("[data-testid=graph-adornments-banners]").should("exist")
    cy.get("[data-testid=plotted-function-control]").should("exist")
    cy.get("[data-testid=plotted-function-control-label]").should("exist")
    cy.get("[data-testid=plotted-function-control-value]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-function-control-label]").should("exist").should("have.text", "f() =")
    cy.get("[data-testid=plotted-function-control-value]").should("exist").should("have.text", "")
    cy.wait(250)

    // The plotted function should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)

  })
  it("allows adding a plotted function to the graph by entering a value into the plotted function UI", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Mass", "left")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-function]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-function-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]").type("10")
    cy.get("[data-testid=Apply-button]").click()
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=plotted-function]").should("exist")
    cy.get("*[data-testid^=plotted-function-path]").should("exist")
    // TODO: Also test the above after attributes are added to top and right axes
    // (i.e. when there are multiple plotted functions)

    // Adds a test for undo and redo for plotted function UI checkbox
    toolbar.getUndoTool().click()
    cy.wait(250)

    // The plotted function should be visible again after an undo
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.wait(250)

    // The plotted function should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=plotted-function]").should("exist")
    cy.get("*[data-testid^=plotted-function-path]").should("exist")
  })
  it("adds plotted value UI to graph when Plotted Value checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-value]").should("be.visible").click()
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 22\)/)
    cy.get("[data-testid=graph-adornments-banners]").should("exist")
    cy.get("[data-testid=plotted-value-control]").should("exist")
    cy.get("[data-testid=plotted-value-control-label]").should("exist")
    cy.get("[data-testid=plotted-value-control-value]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-value-control-label]").should("exist").should("have.text", "value =")
    cy.get("[data-testid=plotted-value-control-value]").should("exist").should("have.text", "")
    cy.wait(250)
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-value]").click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)

    // Adds a test for undo and redo for plotted value checkbox
    toolbar.getUndoTool().click()
    cy.wait(250)

    // The plotted value should be visible again after an undo
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 22\)/)
    cy.get("[data-testid=graph-adornments-banners]").should("exist")
    cy.get("[data-testid=plotted-value-control]").should("exist")
    cy.get("[data-testid=plotted-value-control-label]").should("exist")
    cy.get("[data-testid=plotted-value-control-value]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-value-control-label]").should("exist").should("have.text", "value =")
    cy.get("[data-testid=plotted-value-control-value]").should("exist").should("have.text", "")
    cy.wait(250)

    // The plotted function should be hidden after a redo
    toolbar.getRedoTool().click()
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
    cy.get("[data-testid=plot-cell-background]").should("have.attr", "transform").and("match", /translate\(.*, 0\)/)

  })
  it("allows adding a plotted value to the graph by entering a value into the plotted value UI", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-value]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-value-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]").type("10")
    cy.get("[data-testid=Apply-button]").click()
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=plotted-value]").should("exist")
    cy.get("*[data-testid^=plotted-value-line]").should("exist")
    cy.get("*[data-testid^=plotted-value-cover]").should("exist")
    cy.get("*[data-testid^=plotted-value-tip]").should("exist").should("have.text", "value=10")
    // TODO: Also test the above after attributes are added to top and right axes
    // (i.e. when there are multiple plotted values)
  })
  it("shows a plotted value error when incorrect formula is used", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-value]").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=plotted-value-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]").type("mean(Sl")
    cy.get("[data-testid=Apply-button]").click()
    cy.get("[data-testid=plotted-value-error]").should("exist").should("include.text", "Syntax error")
    // Error should be cleaned up after the formula is fixed
    cy.get("[data-testid=plotted-value-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]")
      .clear().type("mean(Sleep)")
    cy.get("[data-testid=Apply-button]").click()
    cy.get("[data-testid=plotted-value-error]").should("not.exist")
  })
  it("removes plotted value from the graph when both x and y axes are set to numeric attributes", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    graph.getInspectorPalette().find("[data-testid=adornment-checkbox-plotted-value]").click()
    cy.get("[data-testid=plotted-value-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]").type("10")
    cy.get("[data-testid=Apply-button]").click()
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=plotted-value]").should("exist")
    cy.get("*[data-testid^=plotted-value-line]").should("exist")
    cy.get("*[data-testid^=plotted-value-cover]").should("exist")
    cy.get("*[data-testid^=plotted-value-tip]").should("exist").should("have.text", "value=10")
    cy.get("[data-testid=plotted-value-control-value]").click()
    cy.get("[data-testid=edit-formula-value-form]").find("[data-testid=formula-value-input]").clear()
    cy.get("[data-testid=Apply-button]").click()
    cy.get("*[data-testid^=plotted-value-line]").should("not.exist")
    cy.get("*[data-testid^=plotted-value-cover]").should("not.exist")
    cy.get("*[data-testid^=plotted-value-tip]").should("not.exist")
  })
  it("adds movable value to graph when Movable Value button is clicked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    cy.get("[data-testid=adornment-button-movable-value--add]").should("be.visible").click()
    cy.get("[data-testid=graph-adornments-grid]").should("exist")
    cy.get("[data-testid=graph-adornments-grid]")
      .find("[data-testid=graph-adornments-grid__cell]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.length", 1)
    cy.get("[data-testid=adornment-wrapper]").should("have.class", "visible")
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=movable-value]").should("exist")
    cy.get(".movable-value-label").should("have.length", 1)
    cy.get(".movable-value-fill").should("have.length", 0)
    // Commenting below 6 lines as they're flaky and cause random test failures
    // cy.log("clicking movable value button -- 1")
    // movableValueButton.click()
    // cy.log("clicking movable value add button")
    // cy.get("[data-testid=adornment-button-movable-value--add]").click()
    // cy.get(".movable-value-label").should("have.length", 2)
    // cy.get(".movable-value-fill").should("have.length", 1)

    // TODO: Also test the above after attributes are added to top and right axes (i.e. when there are multiple values)
    // TODO: Test dragging of value
    // cy.wait(250)
    // cy.log("clicking movable value button -- 2")
    // movableValueButton.click()
    // cy.log("clicking movable value remove button")
    // cy.get("[data-testid=adornment-button-movable-value--remove]").click()
    // cy.get(".movable-value-label").should("have.length", 1)
    // cy.get(".movable-value-fill").should("have.length", 0)
    // cy.wait(250)
    // cy.log("clicking movable value button -- 3")
    // movableValueButton.click()
    // cy.log("clicking movable value remove button")
    // cy.get("[data-testid=adornment-button-movable-value--remove]").click()
    // cy.get("[data-testid=adornment-wrapper]").should("have.class", "hidden")
    // cy.get(".movable-value-label").should("have.length", 0)
    // cy.get(".movable-value-fill").should("have.length", 0)

        // TODO: Add a test for undo and redo for moveable value checkbox
  })

  it("renders Count adornment count per region defined by Movable Values", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    graph.getDisplayValuesButton().click()
    cy.get("[data-testid=adornment-checkbox-count-count]").click()
    cy.get("[data-testid=graph-adornments-grid]").find("*[data-testid^=graph-count]").should("exist")
    cy.get(".sub-count").should("have.length", 0)
    graph.getInspectorPalette().find("[data-testid=adornment-toggle-otherValues]").click()
    cy.get("[data-testid=adornment-button-movable-value--add]").click()
    cy.get(".sub-count").should("have.length", 2)
    cy.get("[data-testid=adornment-button-movable-value--add]").click()
    cy.get(".sub-count").should("have.length", 3)
  })
  it("adds squares of residuals squares to the plot when the Squares of Residuals checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").should("be.visible")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").find("input").should("have.attr", "disabled")
    cy.get("*[data-testid^=movable-line-squares]").should("not.exist")
    cy.get("[data-testid=adornment-checkbox-movable-line]").click()
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
      .find("[data-testid=movable-line-equation-]")
      .should("not.contain.html", "Sum of squares = ")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").find("input").should("not.have.attr", "disabled")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").click()
    cy.get("*[data-testid^=movable-line-squares]").should("exist")
    cy.get("*[data-testid^=movable-line-squares]").find("rect").should("have.attr", "stroke", "#4682b4")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=movable-line-equation-container-]")
      .find("[data-testid=movable-line-equation-]")
      .should("contain.html", "Sum of squares = ")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").click()
    cy.get("*[data-testid^=movable-line-squares]").should("not.exist")
    cy.get("[data-testid=adornment-checkbox-lsrl]").click()
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=lsrl-equation-container-]")
      .find("[data-testid=lsrl-equation-]")
      .should("not.contain.html", "Sum of squares = ")
    cy.get("*[data-testid^=lsrl-squares]").should("not.exist")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").click()
    cy.get("*[data-testid^=lsrl-squares]").should("exist")
    cy.get("*[data-testid^=lsrl-squares]").find("rect").should("have.attr", "stroke", "#008000")
    cy.get("[data-testid=adornment-wrapper]").find("*[data-testid^=lsrl-equation-container-]")
      .find("[data-testid=lsrl-equation-]")
      .should("contain.html", "Sum of squares = ")
    cy.get("[data-testid=adornment-checkbox-lsrl]").click()
    cy.get("*[data-testid^=lsrl-squares]").should("not.exist")
    cy.get("[data-testid=adornment-checkbox-movable-line]").click()
    cy.get("*[data-testid^=movable-line-squares]").should("not.exist")
    cy.get("[data-testid=adornment-checkbox-squares-of-residuals]").find("input").should("have.attr", "disabled")
  })

  it("adds connecting lines to the plot when the Connecting Lines checkbox is checked", () => {
    c.selectTile("graph", 0)
    cy.dragAttributeToTarget("table", "Sleep", "bottom")
    cy.dragAttributeToTarget("table", "Speed", "left")
    graph.getDisplayValuesButton().click()

    graph.getInspectorPalette().should("be.visible")
    cy.get("[data-testid=adornment-checkbox-connecting-lines]").should("be.visible")
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("not.exist")
    // TODO: Update the below once the connecting lines and related dot animation is re-instated
    // cy.get(".graph-dot").each((dot: SVGCircleElement) => {
    //   cy.wrap(dot).should("have.attr", "r", 6)
    // })
    cy.get("[data-testid=adornment-checkbox-connecting-lines]").click()
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("exist")
    // TODO: Update the below once the connecting lines and related dot animation is re-instated
    // cy.get(".graph-dot").each((dot: SVGCircleElement) => {
    //   cy.wrap(dot).should("have.attr", "r", 3)
    // })
    // Since the circle elements for the graph's case dots overlay the lines' path element in various places, we
    // use force: true so we don't need to figure out exactly where to click.
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").click({force: true})
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("have.attr", "stroke-width", "4")
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").click({force: true})
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("have.attr", "stroke-width", "2")
    graph.getDisplayValuesButton().click()
    cy.get("[data-testid=adornment-checkbox-connecting-lines]").click()
    cy.get("*[data-testid^=adornment-checkbox-connecting-lines]").find("path").should("not.exist")
    // TODO: Update the below once the connecting lines and related dot animation is re-instated
    // cy.get(".graph-dot").each((dot: SVGCircleElement) => {
    //   cy.wrap(dot).should("have.attr", "r", 6)
    // })

    // Adds a test for undo and redo for connecting lines checkbox
    toolbar.getUndoTool().click()
    cy.wait(250)

    // Connecting lines should be visible again after an undo
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("exist")
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").click({force: true})
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("have.attr", "stroke-width", "4")
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").click({force: true})
    cy.get("*[data-testid^=connecting-lines-graph]").find("path").should("have.attr", "stroke-width", "2")
    cy.wait(250)

    // Connecting lines should be hidden after a redo. this piece is a bit flaky so commented out for now.
    //toolbar.getRedoTool().click()
    //cy.get("*[data-testid^=adornment-checkbox-connecting-lines]").find("path").should("not.exist")
  })
})
