import { useToast as useToastOriginal } from "@/components/ui/toast"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export const useToast = useToastOriginal; 