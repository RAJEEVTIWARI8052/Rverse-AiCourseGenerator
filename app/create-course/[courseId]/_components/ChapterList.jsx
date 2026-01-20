import { CiClock2 } from "react-icons/ci";
import EditChapters from "./EditChapters";

function ChapterList({ course, refreshData }) {
  let output = {};
  try {
    output = course?.courseOutput ? JSON.parse(course.courseOutput) : {};
  } catch {
    output = {};
  }

  const chapters = output?.chapters || output?.Chapters || [];

  if (!chapters.length)
    return <p className="mt-3 text-gray-500">No chapters available.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold gradient-text mb-6">Course Content</h2>
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div key={index} className="group p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 flex gap-5 items-start">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-10 w-10 text-white rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-foreground flex items-center justify-between gap-2">
                {chapter?.chapterName || chapter?.ChapterName}
                <EditChapters
                  course={course}
                  index={index}
                  refreshData={refreshData}
                />
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{chapter?.about}</p>
              <div className="flex gap-2 items-center mt-3 text-purple-600 dark:text-purple-400 text-sm font-medium">
                <CiClock2 className="text-lg" />
                {chapter?.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
