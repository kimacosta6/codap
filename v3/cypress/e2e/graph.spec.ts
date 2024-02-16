import { GraphTileElements as graph } from "../support/elements/graph-tile"
import { ComponentElements as c } from "../support/elements/component-elements"
import { ToolbarElements as toolbar } from "../support/elements/toolbar-elements"

const collectionName = "Mammals"
const newCollectionName = "Animals"
// const newGraphName = "New Dataset"
const arrayOfPlots = [
  { attribute: "Mammal", axis: "x", collection: "mammals" },
  { attribute: "Order", axis: "y", collection: "mammals" },
  { attribute: "LifeSpan", axis: "x1", collection: "mammals" },
  { attribute: "Height", axis: "y1", collection: "mammals" },
  { attribute: "Mass", axis: "x", collection: "mammals" },
  { attribute: "Sleep", axis: "y", collection: "mammals" },
  { attribute: "Speed", axis: "x1", collection: "mammals" },
  { attribute: "Habitat", axis: "graph_plot", collection: "mammals" },
  { attribute: "Diet", axis: "graph_plot", collection: "mammals" }
]

context("Test graph plot transitions", () => {
  beforeEach(function () {
    const queryParams = "?sample=mammals&dashboard&mouseSensor"
    const url = `${Cypress.config("index")}${queryParams}`
    cy.visit(url)
    cy.wait(2500)
  })
  it("populates title bar from sample data", () => {
    c.getComponentTitle("graph").should("contain", collectionName)
  })
  it("will add attributes to a graph and verify plot transitions are correct", () => {
    cy.wrap(arrayOfPlots).each((hash, index, list) => {
      cy.dragAttributeToTarget("table", hash.attribute, hash.axis)
      cy.wait(2000)
    })
  })
})

context("Graph UI", () => {
  beforeEach(function () {
    const queryParams = "?sample=mammals&dashboard&mouseSensor"
    const url = `${Cypress.config("index")}${queryParams}`
    cy.visit(url)
    cy.wait(2500)
  })

  it("updates graph title", () => {
    c.getComponentTitle("graph").should("have.text", collectionName)
    c.changeComponentTitle("graph", newCollectionName)
    c.getComponentTitle("graph").should("have.text", newCollectionName)

    // test for undo/redo when updating graph title
    toolbar.getUndoTool().click()
    c.changeComponentTitle("graph", newCollectionName)
    c.getComponentTitle("graph").should("have.text", newCollectionName)
    // TODO: add a check after undo to make sure the title has reverted to
    // the Collection Name. Blocker: PT #187033159

    // use force:true so we don't have to worry about redo disabling
    toolbar.getRedoTool().click({force: true})
    c.changeComponentTitle("graph", newCollectionName)
    c.getComponentTitle("graph").should("have.text", newCollectionName)
    // TODO: add a check after undo to make sure the title has reverted to
    // the Collection Name. Blocker: PT #187033159

  })
  it("creates graphs with new collection name", () => {

    // Function to count CODAP graphs and return the count
   const countCodapGraphs = () => {
    return cy.get('.codap-graph').its('length')
   }
   countCodapGraphs().then(initialCount => {
    cy.log(`Initial CODAP Graph Count: ${initialCount}`);

    // perform an action that gets a new graph
    c.getIconFromToolshelf("graph").click()
    c.getComponentTitle("graph").should("contain", collectionName)
    c.getComponentTitle("graph", 1).should("contain", collectionName)
    // Assert the count increased by 1
    countCodapGraphs().should('eq', initialCount + 1)

    c.getIconFromToolshelf("graph").click()
    c.getComponentTitle("graph", 2).should("contain", collectionName)
    // Assert the count increased by 1
    countCodapGraphs().should('eq', initialCount + 2)

    // tests for undo/redo after creating a second graph

    toolbar.getUndoTool().click()
    cy.wait(2500)
    // Assert the count decreased by 1
    countCodapGraphs().should('eq', initialCount + 1)

   })
  })
  it("creates graphs with new collection names when existing ones are closed", () => {
    c.closeComponent("graph")
    c.checkComponentDoesNotExist("graph")
    c.getIconFromToolshelf("graph").click()
    c.getComponentTitle("graph").should("contain", collectionName)

    c.closeComponent("graph")
    c.checkComponentDoesNotExist("graph")
    c.getIconFromToolshelf("graph").click()
    c.getComponentTitle("graph").should("contain", collectionName)
  })
  it("checks all graph tooltips", () => {
    c.selectTile("graph", 0)
    toolbar.getToolShelfIcon("graph").then($element => {
      c.checkToolTip($element, c.tooltips.graphToolShelfIcon)
    })
    c.getMinimizeButton("graph").then($element => {
      c.checkToolTip($element, c.tooltips.minimizeComponent)
    })
    c.getCloseButton("graph").then($element => {
      c.checkToolTip($element, c.tooltips.closeComponent)
    })
    graph.getResizeIcon().then($element => {
      c.checkToolTip($element, c.tooltips.graphResizeButton)
    })
    graph.getHideShowButton().then($element => {
      c.checkToolTip($element, c.tooltips.graphHideShowButton)
    })
    graph.getDisplayValuesButton().then($element => {
      c.checkToolTip($element, c.tooltips.graphDisplayValuesButton)
    })
    graph.getDisplayConfigButton().then($element => {
      c.checkToolTip($element, c.tooltips.graphDisplayConfigButton)
    })
    graph.getDisplayStylesButton().then($element => {
      c.checkToolTip($element, c.tooltips.graphDisplayStylesButton)
    })
    graph.getCameraButton().then($element => {
      c.checkToolTip($element, c.tooltips.graphCameraButton)
    })
  })
})
