"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileJson, FileIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportJson: (file: File) => void
  onImportPptx: (file: File) => void
}

export default function ImportDialog({ isOpen, onClose, onImportJson, onImportPptx }: ImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"json" | "pptx" | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file: File) => {
    setSelectedFile(file)

    // Auto-detect file type
    if (file.name.endsWith(".json")) {
      setImportType("json")
    } else if (file.name.endsWith(".pptx")) {
      setImportType("pptx")
    } else {
      setImportType(null)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!selectedFile || !importType) return

    if (importType === "json") {
      onImportJson(selectedFile)
    } else {
      onImportPptx(selectedFile)
    }
  }

  const resetState = () => {
    setSelectedFile(null)
    setImportType(null)
    setIsDragging(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetState()
        onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Import Presentation</DialogTitle>
          <DialogDescription>Import a presentation from JSON or PowerPoint file</DialogDescription>
        </DialogHeader>

        {!selectedFile ? (
          <div
            className={cn(
              "mt-4 border-2 border-dashed rounded-lg p-8 text-center",
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your file here, or{" "}
              <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                browse
                <input type="file" className="hidden" accept=".json,.pptx" onChange={handleFileInputChange} />
              </label>
            </p>
            <p className="text-xs text-gray-500">Supports JSON and PowerPoint (.pptx) files</p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              {importType === "json" ? (
                <FileJson className="h-8 w-8 text-blue-600 mr-3" />
              ) : (
                <FileIcon className="h-8 w-8 text-red-600 mr-3" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetState} className="text-gray-500 hover:text-gray-700">
                Change
              </Button>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="space-x-2">
                <Button
                  type="button"
                  variant={importType === "json" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImportType("json")}
                  className={importType === "json" ? "bg-blue-600" : ""}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button
                  type="button"
                  variant={importType === "pptx" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImportType("pptx")}
                  className={importType === "pptx" ? "bg-blue-600" : ""}
                >
                  <FileIcon className="h-4 w-4 mr-2" />
                  PowerPoint
                </Button>
              </div>
              <Button type="button" onClick={handleImport} disabled={!importType} className="bg-blue-600">
                Import
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
