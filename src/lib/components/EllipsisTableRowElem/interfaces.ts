import { RefObject } from "react";

export type ModifyTableRowElementProps = {
    showModify: boolean,
    showModifyRef: RefObject<HTMLDivElement>,
    setShowDelete: () => void,
    /** Defines if the add button should be shown. Not shown for when a vendor is a tab element. */
    addButton?: boolean
};