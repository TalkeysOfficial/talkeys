"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
  initialValue?: string
  debounceTime?: number
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search...",
  className,
  initialValue = "",
  debounceTime = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm)
    }, debounceTime)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, onSearch, debounceTime])

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <motion.div
      className={cn("relative w-full sm:w-64", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-purple-400" : "text-gray-400",
        )}
      />

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "bg-gray-800 text-white pl-10 pr-8 border-gray-700 transition-all duration-200",
          isFocused ? "border-purple-500 ring-1 ring-purple-500/20" : "",
          searchTerm ? "pr-8" : "pr-3",
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  )
}

export default SearchInput

