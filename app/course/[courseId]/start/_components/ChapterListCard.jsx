import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

function ChapterListCard({ chapter, index }) {
  console.log("🔍 DEBUG: ChapterListCard received:", chapter);

  return (
    <div className="grid grid-cols-5 p-4 items-center gap-3 border-b">
      <div>
        <h2 className="p-1 bg-blue-500 w-8 h-8 flex items-center justify-center text-white rounded-full">
          {index + 1}
        </h2>
      </div>
      <div className="col-span-4">
        {/* ✅ FIXED: Handle both chapterName and chapterTitle */}
        <h2 className="font-medium">
          {chapter?.chapterName || chapter?.ChapterName || chapter?.chapterTitle || `Chapter ${index + 1}`}
        </h2>
        <h2 className="flex items-center gap-2 text-sm text-blue-500">
          <AiOutlineClockCircle />
          {chapter?.duration || "5 min"}
        </h2>
      </div>
    </div>
  );
}

// ✅ FIXED: Make sure to export as default
export default ChapterListCard;