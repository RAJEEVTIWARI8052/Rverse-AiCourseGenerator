import { CiClock2 } from "react-icons/ci";
import EditChapters from "./EditChapters";

function ChapterList({ course, refreshData }) {
  let output = {};
  try {
    output = course?.courseOutput ? JSON.parse(course.courseOutput) : {};
  } catch {
    output = {};
  }

  const chapters = output?.chapters || [];

  if (!chapters.length)
    return <p className="mt-3 text-gray-500">No chapters available.</p>;

  return (
    <div className="mt-3">
      <h2 className="text-2xl font-bold">Chapters</h2>
      <div className="mt-2 space-y-3">
        {chapters.map((chapter, index) => (
          <div key={index} className="border p-5 rounded-lg flex gap-4">
            <h2 className="bg-blue-500 h-10 w-10 text-white text-center p-2 rounded-full flex items-center justify-center">
              {index + 1}
            </h2>
            <div>
              <h2 className="font-medium text-lg flex items-center gap-2">
                {chapter?.chapterName}
                <EditChapters
                  course={course}
                  index={index}
                  refreshData={refreshData}
                />
              </h2>
              <p className="text-sm text-gray-500">{chapter?.about}</p>
              <p className="flex gap-2 text-blue-500 items-center">
                <CiClock2 /> {chapter?.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
