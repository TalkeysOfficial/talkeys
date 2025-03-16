"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon?: React.ReactNode
  className?: string
  iconClassName?: string
  index?: number
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  iconClassName,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={cn("border-opacity-30 text-white", className)}>
        <CardHeader className="pb-2">
          <CardDescription className="text-opacity-80">{title}</CardDescription>
          <CardTitle className="text-3xl flex items-center">
            {value}
            {icon && <div className={cn("ml-auto", iconClassName)}>{icon}</div>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-opacity-80">{description}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatsCard

