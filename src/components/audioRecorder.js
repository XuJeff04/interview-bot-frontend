import { useState, useRef } from "react";
import { AudioVisualizer } from 'react-audio-visualize';

const mimeType = "audio/mp3";
const apiAddress = "http://localhost:5000";
const visualizerRef = useRef<HTMLCanvasElement>(null)

const AudioRecorder = () => {
    const [questionAudio, setQuestionAudio] = useState(null);
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    //start the interview.
    const getQuestion = async () => {
        await fetch(`${apiAddress}/questions`, {
            method: 'GET',
        }).then(
            response => response.blob()
        ).then(
            blob => setQuestionAudio(blob)
        ).catch((e) => console.log(e));
      };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        await getQuestion();
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: mimeType });
           setAudioFile(audioBlob);
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
        };
      };
    const submitAudio = async () => {
        setQuestionAudio(null);
        const formData = new FormData();
        var fileOfBlob = new File([audioFile], 'interviewAudio.mp3');
        formData.append('file', fileOfBlob);
        await fetch(`${apiAddress}/uploadAudio`, {
          method: "POST",
          body: formData
        }).then(
            response => response.blob()
        ).then(
                blob => setQuestionAudio(blob)
        ).catch((e) => {console.log(e)})
      };

    
    return (
        <div>    
            <h2>Audio Player</h2> 
            {questionAudio ? 
                <div>
                    <AudioVisualizer
                        ref={visualizerRef}
                        blob={questionAudio}
                        width={500}
                        height={75}
                        barWidth={1}
                        gap={0}
                        barColor={'#f76565'}
                    />
                <audio controls autoPlay>
                    <source src={questionAudio} type="audio/mp3"/>
                    Your browser does not support the video tag.
                </audio>
                </div> : null
            }
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                {!permission ? (
                <button onClick={getMicrophonePermission} type="button">
                    Get Microphone
                </button>
                ) : null}
                {permission && recordingStatus === "inactive" ? (
                <button onClick={startRecording} type="button">
                    Start Recording
                </button>
                ) : null}
                {recordingStatus === "recording" ? (
                <button onClick={stopRecording} type="button">
                    Stop Recording
                </button>
                ) : null}
                </div>
                {audio ? (
                <div className="audio-container">
                    <audio src={audio} controls></audio>
                    <button onClick={submitAudio} type="button">
                        analyze input
                    </button>
                    <a download href={audio}>
                        Download Recording
                    </a>
                </div>
                ) : null}
            </main>
        </div>
    );
};
export default AudioRecorder;