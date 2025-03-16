"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Event } from "@/types/types"
import EventCard from "@/components/admin/EventCard"
import { cn } from "@/lib/utils"

interface EventsGridProps {
  events?: Event[]
  onDelete?: (id: string) => void
  deleteMode?: boolean
  className?: string
  emptyMessage?: string
  isLoading?: boolean
}

const EventsGrid: React.FC<EventsGridProps> = ({
  events,
  onDelete = () => {},
  deleteMode = false,
  className,
  emptyMessage = "No events found",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-center py-12">
        {emptyMessage}
      </motion.div>
    )
  }

  return (
    <motion.div layout className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.05, duration: 0.3 },
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <EventCard event={event} onDelete={onDelete} deleteMode={deleteMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default EventsGrid

