import { HiMenuAlt2 } from "react-icons/hi";
import { UserButton } from "@clerk/nextjs";

function Header({ setOpenSidebar }) {
  return (
    <div className="flex justify-between p-5 shadow-sm border-b items-center bg-white dark:bg-black">
      <div className="flex items-center gap-2">
        <HiMenuAlt2
          className="md:hidden h-7 w-7 cursor-pointer text-gray-500 hover:text-purple-600 transition-colors"
          onClick={() => setOpenSidebar && setOpenSidebar(true)}
        />
        {/* Placeholder for Breadcrumbs or Welcome text */}
      </div>
      <UserButton />
    </div>
  )
}

export default Header