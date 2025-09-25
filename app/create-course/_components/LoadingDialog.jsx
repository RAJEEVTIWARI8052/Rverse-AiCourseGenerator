import React from 'react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/alert-dialog"

function LoadingDialog({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generating Course</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col items-center py-10">
              {/* Loader.gif must be in public/ folder */}
              <Image 
                src="/Loader.gif" 
                alt="Loading..." 
                width={100} 
                height={100} 
                priority 
              />
              <h2 className="mt-4 text-gray-700">
                Plz wait, AI is working on your course...
              </h2>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LoadingDialog
