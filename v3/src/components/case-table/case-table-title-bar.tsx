import React, { useRef, useState } from "react"
import { isCaseTableModel } from "./case-table-model"
import { ComponentTitleBar } from "../component-title-bar"
import { Box, useOutsideClick } from "@chakra-ui/react"
import { observer } from "mobx-react-lite"
import t from "../../utilities/translation/translate"
import TableIcon from "../../assets/icons/icon-table.svg"
import CardIcon from "../../assets/icons/icon-case-card.svg"
import { ITileTitleBarProps } from "../tiles/tile-base-props"

import "./case-table-title-bar.scss"

export const CaseTableTitleBar = observer(function CaseTableTitleBar({tile, onCloseTile}: ITileTitleBarProps) {
  const data = isCaseTableModel(tile?.content) ? tile?.content.data : undefined
  const getTitle = () => tile?.title || data?.name
  const [showSwitchMessage, setShowSwitchMessage] = useState(false)
  const [showCaseCard, setShowCaseCard] = useState(false)
  const cardTableToggleRef = useRef(null)

  useOutsideClick({
    ref: cardTableToggleRef,
    handler: () => setShowSwitchMessage(false)
  })

  const handleShowCardTableToggleMessage = () => {
    setShowSwitchMessage(true)
  }

  const handleToggleCardTable = (e:React.MouseEvent) => {
    e.stopPropagation()
    setShowSwitchMessage(false)
    setShowCaseCard(!showCaseCard)
  }

  const cardTableToggleString = showCaseCard
                                  ? t("DG.DocumentController.toggleToCaseTable")
                                  : t("DG.DocumentController.toggleToCaseCard")

  return (
    <ComponentTitleBar tile={tile} getTitle={getTitle} onCloseTile={onCloseTile}>
      <div className="header-left"
            title={cardTableToggleString}
            onClick={handleShowCardTableToggleMessage}>
        {showCaseCard
          ? <TableIcon className="table-icon" />
          : <CardIcon className="card-icon"/>
        }
        {showSwitchMessage &&
          <Box ref={cardTableToggleRef} className={`card-table-toggle-message`}
                onClick={handleToggleCardTable}>
            {cardTableToggleString}
          </Box>
        }
      </div>
    </ComponentTitleBar>
  )
})
