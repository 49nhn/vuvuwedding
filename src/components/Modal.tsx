import React, { type ReactElement, useMemo } from "react";
import { ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Modal } from "@nextui-org/react";

export const MyModal = ({ Content, callBack, title }: {
    Content: ReactElement,
    callBack?: () => Promise<void>,
    title?: string
}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const RenderModal = useMemo(() =>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    scrollBehavior={"inside"}
                >
                    <ModalContent>
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {title ? title : "Modal"}
                            </ModalHeader>
                            <ModalBody>
                                {Content}
                            </ModalBody>
                        </>
                    </ModalContent>
                </Modal>
            </div>
        , [isOpen, Content, title]);
    return {
        RenderModal,
        onOpen,
        isOpen,
        onClose
    }
}
/*
 * Copyright (c) 2024. 
 * @49nhn 
 */


