import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Plus, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle2, 
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { TEST_REPORT_CATEGORIES, type MedicalTestReport, type TestReportCategory } from '../types/biodata';

interface MedicalReportsSectionProps {
  reports: MedicalTestReport[];
  onAddReport?: (report: MedicalTestReport) => void;
  onDeleteReport?: (id: string) => void;
  readOnly?: boolean;
}

export const MedicalReportsSection: React.FC<MedicalReportsSectionProps> = ({
  reports,
  onAddReport,
  onDeleteReport,
  readOnly = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<MedicalTestReport | null>(null);

  // Form state
  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState<TestReportCategory>('Blood Test');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [labOrHospital, setLabOrHospital] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [notes, setNotes] = useState('');
  
  // File state
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileData, setFileData] = useState('');
  const [fileError, setFileError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB for browser local storage
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller scan or PDF.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type || 'application/octet-stream');
    
    // Format file size
    if (file.size < 1024) {
      setFileSize(`${file.size} B`);
    } else if (file.size < 1024 * 1024) {
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }

    // Auto set test name if empty
    if (!testName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTestName(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Result = uploadEvent.target?.result as string;
      setFileData(base64Result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) {
      alert('Please enter a test report title.');
      return;
    }
    if (!fileData) {
      setFileError('Please select a medical report file to attach.');
      return;
    }

    const newReport: MedicalTestReport = {
      id: `rep-${Date.now()}`,
      testName: testName.trim(),
      category,
      testDate: testDate || new Date().toISOString().split('T')[0],
      labOrHospital: labOrHospital.trim() || undefined,
      doctorName: doctorName.trim() || undefined,
      fileName: fileName || 'medical_report.pdf',
      fileSize: fileSize || 'Unknown size',
      fileType: fileType || 'application/pdf',
      fileData,
      summaryResult: summaryResult.trim() || undefined,
      notes: notes.trim() || undefined,
      uploadedAt: new Date().toISOString(),
    };

    if (onAddReport) {
      onAddReport(newReport);
    }

    // Reset & close
    setModalOpen(false);
    setTestName('');
    setCategory('Blood Test');
    setTestDate(new Date().toISOString().split('T')[0]);
    setLabOrHospital('');
    setDoctorName('');
    setSummaryResult('');
    setNotes('');
    setFileName('');
    setFileSize('');
    setFileType('');
    setFileData('');
    setFileError('');
  };

  const handleDownload = (report: MedicalTestReport) => {
    if (!report.fileData) {
      alert('File content is not available for download.');
      return;
    }

    const link = document.createElement('a');
    link.href = report.fileData;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Previous Medical Tests & Diagnostic Reports</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Store, view, and download laboratory test results, radiology scans, and prescriptions.
          </p>
        </div>

        {!readOnly && onAddReport && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Medical Report</span>
          </button>
        )}
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">No Previous Medical Tests Attached</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload blood test results, radiology scans, or prescription documents to maintain a complete clinical paper trail.
          </p>
          {!readOnly && onAddReport && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach First Test Report</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header: Category + Date */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {report.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{report.testDate}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1" title={report.testName}>
                  {report.testName}
                </h4>

                {/* Lab & Doctor */}
                {(report.labOrHospital || report.doctorName) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                    {report.labOrHospital && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{report.labOrHospital}</span>
                      </span>
                    )}
                    {report.doctorName && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{report.doctorName}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Summary / Result findings */}
                {report.summaryResult && (
                  <div className="mt-2.5 p-2 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                    <span className="font-semibold text-slate-900 block text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                      Findings / Result:
                    </span>
                    <span>{report.summaryResult}</span>
                  </div>
                )}

                {/* Filename & size */}
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono truncate">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{report.fileName}</span>
                  <span>({report.fileSize})</span>
                </div>
              </div>

              {/* Bottom Actions: Download, Preview, Delete */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDownload(report)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Download medical test document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Test</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewReport(report)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="View Test Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {!readOnly && onDeleteReport && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete report "${report.testName}"?`)) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Attach Previous Medical Test Report</h3>
                  <p className="text-xs text-slate-500">Add lab report, scan, or prescription to profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-5 sm:p-6 space-y-4">
              
              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Document / Report File <span className="text-rose-500">*</span>
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    fileName 
                      ? 'border-emerald-300 bg-emerald-50/50' 
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50'
                  }`}
                >
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div className="text-left">
                        <span className="font-bold block truncate max-w-sm">{fileName}</span>
                        <span className="text-[11px] text-emerald-600">{fileSize} • Click to replace file</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">Click to browse or drop medical report file</p>
                      <p className="text-[10px] text-slate-400">PDF, PNG, JPG, or TXT up to 5MB</p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>

              {/* Test Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Test Report Name / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC) or HbA1c Lab Report"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TestReportCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-indigo-500"
                  >
                    {TEST_REPORT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Test Date</label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Lab & Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Laboratory / Hospital Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Diagnostics / Metropolis"
                    value={labOrHospital}
                    onChange={(e) => setLabOrHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Consulting Physician / Doctor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Gupta"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Summary / Result findings */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Key Findings / Summary Values (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fasting Sugar 95 mg/dL, HbA1c 5.8%, Platelets 2.8 Lakhs (Normal)"
                  value={summaryResult}
                  onChange={(e) => setSummaryResult(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor's Notes / Treatment Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Continue same dosage, repeat lipid panel in 6 months"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Test Report
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Document Detail Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{previewReport.testName}</h3>
                  <p className="text-xs text-slate-500">
                    {previewReport.category} • Performed on {previewReport.testDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <dl className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <dt className="text-slate-400">Laboratory / Clinic</dt>
                  <dd className="font-bold text-slate-800">{previewReport.labOrHospital || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Consultant Doctor</dt>
                  <dd className="font-bold text-slate-800">{previewReport.doctorName || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Attached File</dt>
                  <dd className="font-mono text-slate-700">{previewReport.fileName} ({previewReport.fileSize})</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Uploaded On</dt>
                  <dd className="font-mono text-slate-700">{previewReport.uploadedAt.split('T')[0]}</dd>
                </div>
              </dl>

              {previewReport.summaryResult && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">Key Diagnostic Findings:</span>
                  <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                    {previewReport.summaryResult}
                  </div>
                </div>
              )}

              {previewReport.notes && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">Clinical Notes & Follow-up:</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    {previewReport.notes}
                  </div>
                </div>
              )}

              {/* Inline preview if image or text */}
              {previewReport.fileData && previewReport.fileType.startsWith('image/') && (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 flex items-center justify-center bg-slate-100">
                  <img src={previewReport.fileData} alt="Test Scan" className="max-h-72 object-contain" />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleDownload(previewReport)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report ({previewReport.fileName})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
