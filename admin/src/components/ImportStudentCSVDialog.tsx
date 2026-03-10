import React, { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createStudent } from '@/api/helpers/student'
import { toast } from "sonner"
import { Upload, AlertCircle, CheckCircle2, XCircle, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import Papa from 'papaparse'
import { cn } from '@/lib/utils'

// Maps the human-readable CSV export headers → internal field names
// Matches exactly what the Download CSV button produces
const COLUMN_MAP: Record<string, string> = {
  'student id':             'student_id',
  'first name':             'firstname',
  'last name':              'lastname',
  'middle name':            'middle_name',
  'section':                'section',
  'grade level':            'grade_level',
  'parent full name':       'parent_fullname',
  'parent phone number':    'guardian_phone_number',
  'rfid code':              'rfid_code',
  'address':                'address',
  // optional extended guardian columns (if present)
  'guardian first name':    'guardian_firstname',
  'guardian last name':     'guardian_lastname',
  'guardian middle name':   'guardian_middle_name',
  'guardian rfid code':     'guardian_rfid_code',
  'relationship':           'relationship',
}

const REQUIRED_EXPORT_FIELDS = [
  'student_id', 'firstname', 'lastname',
  'grade_level', 'section', 'address', 'rfid_code',
]

interface ParsedStudent {
  firstname: string
  lastname: string
  middle_name?: string
  rfid_code: string
  student_id: string
  grade_level: string
  section: string
  address: string
  // From "Parent Full Name" export column — split on first space
  guardian_firstname: string
  guardian_lastname: string
  guardian_middle_name?: string
  guardian_rfid_code: string
  guardian_phone_number: string
  relationship: string
}

interface RowStatus {
  index: number
  status: 'pending' | 'success' | 'error'
  message?: string
}

function normalizeHeader(key: string): string {
  // Strip UTF-8 BOM (\uFEFF) that Excel adds to the first column header
  const stripped = key.replace(/^\uFEFF/, '').trim().toLowerCase()
  return COLUMN_MAP[stripped] ?? stripped
}

function splitFullName(full: string): { firstname: string; lastname: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 1) return { firstname: parts[0], lastname: '' }
  const firstname = parts[0]
  const lastname = parts.slice(1).join(' ')
  return { firstname, lastname }
}

function validateRow(row: Record<string, string>): string[] {
  const errors: string[] = []
  for (const field of REQUIRED_EXPORT_FIELDS) {
    const val = (row[field] ?? '').trim()
    if (!val) errors.push(`Missing required field: ${field}`)
  }
  return errors
}

function parseCSV(file: File): Promise<{ data: ParsedStudent[], errors: string[] }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => {
        const errors: string[] = []
        const data: ParsedStudent[] = []

        const headers = Object.keys(results.data[0] ?? {})
        const missingCols = REQUIRED_EXPORT_FIELDS.filter(f => !headers.includes(f))
        if (missingCols.length > 0) {
          errors.push(`Missing columns: ${missingCols.join(', ')}`)
          return resolve({ data: [], errors })
        }

        for (const row of results.data as Record<string, string>[]) {
          const rowErrors = validateRow(row)
          if (rowErrors.length > 0) continue

          // If the CSV has split guardian columns use them, otherwise split parent_fullname
          let guardian_firstname = (row.guardian_firstname ?? '').trim()
          let guardian_lastname = (row.guardian_lastname ?? '').trim()
          if (!guardian_firstname && row.parent_fullname) {
            const split = splitFullName(row.parent_fullname)
            guardian_firstname = split.firstname
            guardian_lastname = split.lastname
          }

          data.push({
            firstname: row.firstname.trim(),
            lastname: row.lastname.trim(),
            middle_name: row.middle_name?.trim() || undefined,
            rfid_code: row.rfid_code.trim(),
            student_id: row.student_id.trim(),
            grade_level: row.grade_level.trim(),
            section: row.section.trim(),
            address: row.address.trim(),
            guardian_firstname,
            guardian_lastname,
            guardian_middle_name: row.guardian_middle_name?.trim() || undefined,
            guardian_rfid_code: (row.guardian_rfid_code ?? '').trim(),
            guardian_phone_number: row.guardian_phone_number.trim(),
            relationship: (row.relationship ?? 'legal_guardian').trim(),
          })
        }

        resolve({ data, errors })
      },
      error: (err) => resolve({ data: [], errors: [err.message] })
    })
  })
}

function StatusIcon({ status }: { status: RowStatus['status'] }) {
  if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
  if (status === 'error') return <XCircle className="w-4 h-4 text-red-500 shrink-0" />
  return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
}

export function ImportCSVDialog({ children, onImport }: { children: React.ReactNode; onImport: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload')
  const [dragging, setDragging] = useState(false)
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [students, setStudents] = useState<ParsedStudent[]>([])
  const [rowStatuses, setRowStatuses] = useState<RowStatus[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setStep('upload')
    setParseErrors([])
    setStudents([])
    setRowStatuses([])
    setExpandedRows(new Set())
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClose = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a .csv file')
      return
    }
    const { data, errors } = await parseCSV(file)
    setParseErrors(errors)
    setStudents(data)
    setStep('preview')
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleImport = async () => {
    setStep('importing')
    const statuses: RowStatus[] = students.map((_, i) => ({ index: i, status: 'pending' }))
    setRowStatuses([...statuses])

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < students.length; i++) {
      const result = await createStudent(students[i])
      if (result.success) {
        successCount++
        statuses[i] = { index: i, status: 'success', message: result.message }
      } else {
        errorCount++
        statuses[i] = { index: i, status: 'error', message: result.message }
      }
      setRowStatuses([...statuses])
    }

    setStep('done')

    if (successCount > 0) {
      toast.success(`Imported ${successCount} student${successCount > 1 ? 's' : ''} successfully.`)
      onImport()
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} student${errorCount > 1 ? 's' : ''} failed to import.`)
    }
  }

  const toggleRow = (i: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const successCount = rowStatuses.filter(r => r.status === 'success').length
  const errorCount = rowStatuses.filter(r => r.status === 'error').length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[680px] max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>Import Students via CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV exported from this system. Required columns:{' '}
            <span className="font-mono text-xs">Student ID, First Name, Last Name, Section, Grade Level, RFID Code, Address, Parent Phone Number</span>
          </DialogDescription>
        </DialogHeader>

        {/* STEP: Upload */}
        {step === 'upload' && (
          <div
            className={cn(
              "mt-4 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Drag & drop your CSV here or <span className="text-primary underline underline-offset-2">browse</span></p>
            <p className="text-xs text-muted-foreground">Only .csv files are supported</p>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
          </div>
        )}

        {/* STEP: Preview */}
        {step === 'preview' && (
          <div className="mt-2 flex flex-col gap-3 overflow-hidden">
            {parseErrors.length > 0 && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive space-y-1">
                  {parseErrors.map((e, i) => <p key={i}>{e}</p>)}
                </div>
              </div>
            )}

            {students.length === 0 && parseErrors.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No valid rows found in the CSV.</p>
            )}

            {students.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{students.length} student{students.length > 1 ? 's' : ''} ready to import</p>
                  <Badge variant="secondary">{students.length} rows</Badge>
                </div>
                <div className="overflow-y-auto max-h-[340px] rounded-lg border divide-y">
                  {students.map((s, i) => (
                    <div key={i} className="text-sm">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                        onClick={() => toggleRow(i)}
                      >
                        <span className="font-medium">{s.firstname} {s.lastname} <span className="text-muted-foreground font-normal">— {s.student_id}</span></span>
                        <span className="flex items-center gap-2 text-muted-foreground text-xs">
                          {s.grade_level}
                          {expandedRows.has(i) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </button>
                      {expandedRows.has(i) && (
                        <div className="px-4 pb-3 pt-1 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground bg-muted/20">
                          <span><strong>Section:</strong> {s.section}</span>
                          <span><strong>RFID:</strong> {s.rfid_code}</span>
                          <span><strong>Address:</strong> {s.address}</span>
                          <span><strong>Guardian:</strong> {s.guardian_firstname} {s.guardian_lastname}</span>
                          <span><strong>Relationship:</strong> {s.relationship}</span>
                          <span><strong>Guardian RFID:</strong> {s.guardian_rfid_code}</span>
                          <span><strong>Phone:</strong> {s.guardian_phone_number}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1 shrink-0">
              <Button variant="outline" onClick={reset}><X className="w-4 h-4 mr-1" />Cancel</Button>
              <Button onClick={handleImport} disabled={students.length === 0}>
                <Upload className="w-4 h-4 mr-1" />
                Import {students.length} Student{students.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Importing / Done */}
        {(step === 'importing' || step === 'done') && (
          <div className="mt-2 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {step === 'importing' ? 'Importing students...' : 'Import complete'}
              </p>
              {step === 'done' && (
                <div className="flex gap-2">
                  {successCount > 0 && <Badge className="bg-green-500/15 text-green-600 border-green-200">{successCount} succeeded</Badge>}
                  {errorCount > 0 && <Badge className="bg-red-500/15 text-red-600 border-red-200">{errorCount} failed</Badge>}
                </div>
              )}
            </div>

            <div className="overflow-y-auto max-h-[340px] rounded-lg border divide-y">
              {students.map((s, i) => {
                const status = rowStatuses[i]
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 text-sm gap-3",
                      status?.status === 'success' && 'bg-green-50 dark:bg-green-950/20',
                      status?.status === 'error' && 'bg-red-50 dark:bg-red-950/20',
                    )}
                  >
                    <span className="font-medium truncate">
                      {s.firstname} {s.lastname}
                      <span className="text-muted-foreground font-normal ml-2">— {s.student_id}</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {status?.status === 'error' && (
                        <span className="text-xs text-red-500 max-w-[160px] truncate">{status.message}</span>
                      )}
                      {status ? <StatusIcon status={status.status} /> : <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {step === 'done' && (
              <div className="flex gap-2 pt-1 shrink-0">
                <Button variant="outline" onClick={reset}>Import Another File</Button>
                <Button onClick={() => handleClose(false)}>Done</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}