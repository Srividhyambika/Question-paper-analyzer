
import './App.css'
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900">Exam PYQ Analyzer</h1>
        <p className="text-slate-500 mt-2">Upload your materials to check syllabus coverage and complexity.</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
