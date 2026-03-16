import React, { useState, useMemo } from "react";
import { emojis } from "@/lib/emojis";
import { Search, Smile, Star } from "lucide-react";

const EmojiPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. map the categories to an array of objects
  const categories = useMemo(() => {
    const cats = emojis.map((c) => ({ name: c.category, icon: c.icon }));
    return [{ name: "All", icon: Star}, ...cats];
  }, []);

  // 2. Filter Logic: Handles the "All" case vs specific category
  const filteredData = useMemo(() => {
    return emojis
      .filter((cat) => activeCategory === "All" || cat.category === activeCategory)
      .map((cat) => ({
        ...cat,
        emojis: cat.emojis.filter(
          (e) =>
            e.id.toLowerCase().includes(search.toLowerCase()) || 
            e.emoji.includes(search)
        ),
      }))
      .filter((cat) => cat.emojis.length > 0);
  }, [search, activeCategory]);

  return (
    <div className="absolute top-10 z-12 flex flex-col w-[280px] max-h-[350px] bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
      
      {/* Header: Search & Filters */}
      <div className="p-3 space-y-3 border-b border-border">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border outline-none rounded-md focus:border-primary transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {categories.map(({name , icon : Icon}) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`px-2.5 cursor-pointer py-1 text-[11px] font-medium rounded-full whitespace-nowrap border transition-all ${
                activeCategory === name
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-accent"
              }`}
            >
              <Icon size={14}/>
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Grid Area */}
      <div className="flex-1 overflow-y-auto p-3 scroll-smooth">
        {filteredData.length > 0 ? (
          filteredData.map((cat) => (
            <div key={cat.category} className="mb-4">
              <h4 className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-2 px-1">
                {cat.category}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {cat.emojis.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e)}
                    title={e.id.replace(/_/g, " ")}
                    className="h-8 w-8 flex items-center justify-center text-xl rounded-md hover:bg-accent hover:scale-125 transition-transform active:scale-95"
                  >
                    {e.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
            <Smile className="w-8 h-8 mb-2 stroke-[1px]" />
            <p className="text-xs">No matches found</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmojiPicker;