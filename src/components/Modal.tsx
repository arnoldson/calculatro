import { useEffect, ReactNode } from "react"
import { createPortal } from "react-dom"
import "../css/modal.css"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handler)

    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [onClose])

  return createPortal(
    <div className={`modal-overlay ${isOpen ? "show" : ""}`}>
      <div className="modal">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  )
}
