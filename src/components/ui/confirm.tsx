
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface ConfirmDialogOptions {
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
}

let showConfirmDialog: (options?: ConfirmDialogOptions) => Promise<boolean> = () => Promise.resolve(false)

export function ConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmDialogOptions>({})
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => () => {})

  showConfirmDialog = (options = {}) => {
    setOptions({
      title: options.title || "Are you sure?",
      description: options.description || "This action cannot be undone.",
      cancelText: options.cancelText || "Cancel",
      confirmText: options.confirmText || "Confirm",
    })
    setOpen(true)
    return new Promise<boolean>((res) => {
      setResolve(() => res)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          <AlertDialogDescription>{options.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              resolve(false)
            }}
          >
            {options.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              resolve(true)
            }}
          >
            {options.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const confirm = showConfirmDialog
