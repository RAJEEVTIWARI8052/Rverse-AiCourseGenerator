import React, { useContext } from 'react'
import { Input } from '../../../components/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/select"
import UserInputContext from '../../_context/UserInputContext'

function SelectOptions() {
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext)

    const handleInputChange = (fieldName, value) => {
        setUserCourseInput((prev) => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (
        <div className="px-6 md:px-20 lg:px-44 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Level */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <Select
                        onValueChange={(value) => handleInputChange('Level', value)}
                        defaultValue={userCourseInput?.Level}
                    >
                        <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Course Duration */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Course Duration</label>
                    <Select
                        onValueChange={(value) => handleInputChange('Duration', value)}
                        defaultValue={userCourseInput?.Duration}
                    >
                        <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1 Hour">1 Hour</SelectItem>
                            <SelectItem value="2 Hours">2 Hours</SelectItem>
                            <SelectItem value="More than 3 Hours">More than 3 Hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Add Video */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Add Video</label>
                    <Select
                        onValueChange={(value) => handleInputChange('DisplayVideo', value)}
                        defaultValue={userCourseInput?.DisplayVideo}
                    >
                        <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select Option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* No of Chapters */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">No of Chapters</label>
                    <Input
                        type="number"
                        className="h-12 text-base"
                        defaultValue={userCourseInput?.noOfChapters}
                        onChange={(event) => handleInputChange('noOfChapters', event.target.value)}
                        placeholder="Enter number"
                    />
                </div>
            </div>
        </div>
    )
}

export default SelectOptions
