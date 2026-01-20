import { useContext } from "react";
import CategoryList from "../../_shared/CategoryList";
import UserInputContext from "../../_context/UserInputContext";


function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({ ...prev, category }));
  };

  return (
    <div className="px-5 md:px-20">
      <h2 className="my-5">Select the course Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
        {CategoryList.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border
                ${userCourseInput?.category === item.name
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
              }`}
            onClick={() => handleCategoryChange(item.name)}
          >
            <img
              src={item.icon}
              alt={item.name}
              width={50}
              height={50}
              className="w-10 h-10 mb-2"
            />
            <span className="font-medium text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectCategory;
