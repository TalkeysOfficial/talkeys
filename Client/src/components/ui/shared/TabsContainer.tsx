"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

interface TabsContainerProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  tabsListClassName?: string
  tabsTriggerClassName?: string
  animation?: boolean
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  tabs,
  defaultValue,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  animation = true,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={animation ? "hidden" : false}
      animate={animation ? "visible" : false}
      variants={containerVariants}
    >
      <Tabs defaultValue={defaultValue || tabs[0].value} className="w-full">
        <TabsList className={cn("bg-gray-800 w-full mb-6", tabsListClassName)}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn("data-[state=active]:bg-purple-600", tabsTriggerClassName)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  )
}

export default TabsContainer

