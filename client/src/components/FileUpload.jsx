import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

const FileUpload = () => {
  const [files, setFiles] = useState({
    questionPaper: null,
    syllabus: null,
    textbook: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.questionPaper || !files.syllabus || !files.textbook) {
      alert("Please upload all three required documents.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('questionPaper', files.questionPaper);
    formData.append('syllabus', files.syllabus);
    formData.append('textbook', files.textbook);

    try {
      // Points to your Express server (Week 1 Step 4)
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setStatus('Upload successful! Text extracted.');
      console.log(res.data);
    } catch (err) {
      setStatus('Error uploading files.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Exam Analysis Setup</h2>
      
      <form onSubmit={handleUpload} className="space-y-6">
        {[
          { label: 'Question Paper', name: 'questionPaper' },
          { label: 'Syllabus Document', name: 'syllabus' },
          { label: 'Textbook(s)', name: 'textbook' },
        ].map((item) => (
          <div key={item.name} className="flex flex-col">
            <label className="text-sm font-medium text-slate-600 mb-2">{item.label}</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {files[item.name] ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      <span className="text-sm font-semibold">{files[item.name].name}</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="text-xs text-slate-500">PDF ONLY</p>
                    </>
                  )}
                </div>
                <input type="file" name={item.name} className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-blue-300"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
          {loading ? 'Processing PDFs...' : 'Start Analysis'}
        </button>
      </form>
      
      {status && <p className="mt-4 text-center font-medium text-slate-700">{status}</p>}
    </div>
  );
};

export default FileUpload;