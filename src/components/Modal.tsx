import { ReactNode } from "react"
import { createPortal } from "react-dom"
import "../css/modal.css"

interface ModalProps {
  modalId: string
  activeModalId: string
  children: ReactNode
}

export function Modal({ modalId, activeModalId, children }: ModalProps) {
  return createPortal(
    <div className={`modal-overlay ${modalId === activeModalId ? "show" : ""}`}>
      <div className="modal">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  )
}
