import type React from "react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="w-full sm:w-64">
      <Input
        type="text"
        placeholder="Search events..."
        onChange={(e) => onSearch(e.target.value)}
        className="bg-gray-800 text-white"
      />
    </div>
  )
}

export default SearchBar

