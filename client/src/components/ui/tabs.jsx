import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext({})

function Tabs({ defaultValue, children, className, ...props }) {
  const [active, setActive] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />
  )
}

function TabsTrigger({ className, value, ...props }) {
  const { active, setActive } = React.useContext(TabsContext)
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        active === value ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, value, ...props }) {
  const { active } = React.useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn("mt-2", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }