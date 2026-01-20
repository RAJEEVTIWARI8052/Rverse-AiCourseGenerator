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
              <h2 className="mt-4 text-gray-700 font-medium text-center">
                Generating your course content... <br />
                <span className="text-sm text-gray-500">This might take a moment if AI servers are busy.</span>
              </h2>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LoadingDialog
