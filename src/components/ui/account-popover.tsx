import * as Popover from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"

export const AccountPopover = Popover.Root
export const AccountPopoverTrigger = Popover.Trigger

export const AccountPopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: Popover.PopoverContentProps) => {
  const { isDesktop } = useDeviceDetection()

  return (
  <Popover.Portal>
    <>
      {!isDesktop && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />
      )}
      <Popover.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md border bg-white p-0 shadow-md outline-none",
        isDesktop ? "w-80" : "w-[90vw]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
      />
    </>
  </Popover.Portal>
  )
}
