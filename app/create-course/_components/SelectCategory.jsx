import { useContext } from "react";
import CategoryList from "../../_shared/CategoryList";
import UserInputContext from "../../_context/UserInputContext";


function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({ ...prev, category }));
  };

  return (
    <div className="px-10 md:px-20">
      <h2 className="my-5">Select the course Category</h2>
      <div className="grid grid-cols-3 gap-10 px-10 md:px-20">
        {CategoryList.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center p-5 rounded-xl hover:border-purple-500
                hover:bg-blue-50 border-b border-gray-200 ${
                  userCourseInput?.category === item.name
                    ? 'border-purple-400 bg-blue-100'
                    : ''
                }`}
            onClick={() => handleCategoryChange(item.name)}
          >
            <img
              src={item.icon}
              alt={item.name}
              width={50}
              height={50}
              className="w-6 h-6 mr-2"
            />
            <span className="text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectCategory;
