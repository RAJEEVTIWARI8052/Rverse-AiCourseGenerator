import React, { useContext } from 'react'
import { Input } from '../../../components/input'
import {Textarea} from '../../../components/textarea'
import UserInputContext from '../../_context/UserInputContext'
function TopicDescription() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext)
  const handleInputChange=(fieldName,value)=>{
    setUserCourseInput((prev)=>({
      ...prev,
      [fieldName]:value
    }))
    // Handle input change if needed
  }
  return (
    <div className="mx-20 lg:mx-44">
        {/* topic */}
        <div className="mt-5">
            <label>Write the topic for which you want to generate a course</label>
            <Input placeholder={'Topic'}
            className="h-14 text-xl"
            defaultValue={userCourseInput?.topic}
            onChange={(e)=>handleInputChange('topic',e.target.value)}/>
        </div>

        {/* txt area */}
        <div className="mt-5">
            <label>Tell us more about the course that user want to give you(Options)</label>
            <Textarea placeholder='About your course'
             className="h-40 text-xl"
             defaultValue={userCourseInput?.Description}
            onChange={(e)=>handleInputChange('Description',e.target.value)}/>
        </div>
    </div>
  )
}

export default TopicDescription
