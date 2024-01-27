import React, { useState, useEffect } from 'react';


const App = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [clientDetails, setClientDetails] = useState(Array.from({ length: 50 }, () => []));
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [showClientsBox, setShowClientsBox] = useState(false);


  const handleAddQuestion = () => {
    if (newQuestion.trim() !== '') {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
      setClientDetails([...clientDetails, []]);
    }
  };


  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    const updatedClientDetails = [...clientDetails];
    updatedQuestions.splice(index, 1);
    updatedClientDetails.splice(index, 1);
    setQuestions(updatedQuestions);
    setClientDetails(updatedClientDetails);
  };


  const handleShowDetailsModal = (index) => {
    setCurrentQuestionIndex(index);
    setShowDetailsModal(true);
  };


  const handleDetailsSave = (details) => {
    const updatedClientDetails = [...clientDetails];
    updatedClientDetails[currentQuestionIndex] = [...updatedClientDetails[currentQuestionIndex], details];
    setClientDetails(updatedClientDetails);
    setShowDetailsModal(false);
  };


  const handleViewClientDetails = () => {
    if (clientDetails.some((details) => details.length > 0)) {
      setShowClientsBox(true);
    }
  };


  const handleViewClientButton = (index) => {
    setSelectedClientIndex(index);
  };


  const handleAddClient = (index) => {
    setCurrentQuestionIndex(index);
    setShowDetailsModal(true);
  };


  const ClientsBox = () => {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
          <h3>Client Details</h3>
          {clientDetails.map((details, questionIndex) =>
            details.length > 0 ? (
              details.map((client, clientIndex) => (
                <button
                  key={clientIndex}
                  onClick={() => handleViewClientButton({ questionIndex, clientIndex })}
                >
                  {`Client ${clientIndex + 1}`}
                </button>
              ))
            ) : (
              <span key={questionIndex}>No clients for Question {questionIndex + 1}</span>
            )
          )}
          <button onClick={() => setShowClientsBox(false)}>Close</button>
        </div>
      </div>
    );
  };


  const DetailsBox = ({ questionIndex, clientIndex }) => {
    const details = clientDetails[questionIndex][clientIndex];
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ background: 'white', padding: '20px', borderRadius: '5px', textAlign: 'left' }}>
          <h3>Client Details</h3>
          <p>
            <strong>Full Name:</strong> {details.fullName}
          </p>
          <p>
            <strong>Age:</strong> {details.age}
          </p>
          <p>
            <strong>Files added:</strong>{' '}
            {details.fileUpload ? (
              <a href={URL.createObjectURL(details.fileUpload)} download>
                Download File
              </a>
            ) : (
              'No Files Uploaded'
            )}
          </p>
          <p>
            <strong>Video Recording:</strong>{' '}
            {details.videoRecording ? (
              <a href={URL.createObjectURL(details.videoRecording)} download>
                Download Video
              </a>
            ) : (
              'No Video Uploaded'
            )}
          </p>
          <p>
            <strong>Score:</strong> {details.evaluationScore}
          </p>
          <button onClick={() => setSelectedClientIndex(null)}>Close</button>
        </div>
      </div>
    );
  };


  const DetailsModal = () => {
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [fileUpload, setFileUpload] = useState(null);
    const [videoRecording, setVideoRecording] = useState(null);
    const [evaluationScore, setEvaluationScore] = useState('');


    const handleSave = () => {
      const details = {
        fullName,
        age,
        fileUpload,
        videoRecording,
        evaluationScore,
      };
      handleDetailsSave(details);
      setFullName('');
      setAge('');
      setFileUpload(null);
      setVideoRecording(null);
      setEvaluationScore('');
    };


    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
          <h3>Enter Client Details:</h3>
          <label>
            Full Name:
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <br />
          <label>
            Age:
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <br />
          <label>
            File Upload:
            <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
          </label>
          <br />
          <label>
            Video Recording:
            <input type="file" accept="video/mp4" onChange={(e) => setVideoRecording(e.target.files[0])} />
          </label>
          <br />
          <label>
            Evaluation Score:
            <input type="number" value={evaluationScore} onChange={(e) => setEvaluationScore(e.target.value)} />
          </label>
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setShowDetailsModal(false)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </div>
      </div>
    );
  };


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        setSelectedClientIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  return (
    <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'monospace', fontSize: '15px' }}>
      <div>
        <h1>Title:</h1>
        <hr />
        <label>
          Enter Question:
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <button onClick={handleAddQuestion} style={{ marginLeft: '10px' }}>
          Add
        </button>
      </div>


      <h2>Questions:</h2>
      <table style={{ margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>Q Number</th>
            <th style={{ border: '1px solid black', minWidth: '150px', padding: '5px' }}>Question</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Client Details</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, questionIndex) => (
            <tr key={questionIndex}>
              <td style={{ border: '1px solid black', padding: '5px' }}>Q{questionIndex + 1}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{question}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                <button onClick={() => handleAddClient(questionIndex)}>Add client</button>
                {clientDetails[questionIndex].map((_, clientIndex) => (
                  <button
                    key={clientIndex}
                    onClick={() => handleViewClientButton({ questionIndex, clientIndex })}
                  >
                    {`Client ${clientIndex + 1}`}
                  </button>
                ))}
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                <button onClick={() => handleDeleteQuestion(questionIndex)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {showDetailsModal && <DetailsModal />}
      {selectedClientIndex !== null && (
        <DetailsBox
          questionIndex={selectedClientIndex.questionIndex}
          clientIndex={selectedClientIndex.clientIndex}
        />
      )}
      {showClientsBox && (
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <button onClick={() => setShowClientsBox(false)}>Close</button>
          {clientDetails.map((details, questionIndex) =>
            details.length > 0 ? (
              details.map((_, clientIndex) => (
                <button
                  key={clientIndex}
                  onClick={() => handleViewClientButton({ questionIndex, clientIndex })}
                >
                  {`Client ${clientIndex + 1}`}
                </button>
              ))
            ) : null
          )}
        </div>
      )}
    </div>
  );
};


export default App;



