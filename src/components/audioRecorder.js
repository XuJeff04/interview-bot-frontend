import {useState, useRef, useEffect} from "react";
import { AudioVisualizer } from 'react-audio-visualize';
import {ScaleLoader} from "react-spinners";

const mimeType = "audio/mp3";
const apiAddress = "http://localhost:5000";

const AudioRecorder = () => {
    const [questionAudio, setQuestionAudio] = useState(null);
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [questionLink, setQuestionLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const visualizerRef = useRef<HTMLCanvasElement>(null);

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
        //await getQuestion();
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


    const stopRecording = async () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = async () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            setAudioFile(audioBlob);
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
            const formData = new FormData();
            // var fileOfBlob = new File([audioFile], 'interviewAudio.mp3');
            setLoading(true);
            console.log(audioBlob)
            formData.append('file', audioBlob, 'audio.mp3');
            console.log(formData)
            await fetch(`${apiAddress}/uploadAudio`, {
                method: "POST",
                body: formData
            }).then(
                (response) => {
                    setLoading(false);
                    response.json().then(async (json) => {
                        console.log("http://localhost:5000/media2/" + json['file']);
                        await fetch("http://localhost:5000/media2/" + json['file']).then((r) =>
                        {
                            r.blob().then((blob) => {
                                console.log(blob);
                                setQuestionAudio(blob);
                                setQuestionLink("http://localhost:5000/media2/" + json['file']);
                            })
                        }
                        );
                    })
                }
            ).catch((e) => {
                console.log(e)
            })
        };
      };
    const submitAudio = async () => {
        const formData = new FormData();
        // var fileOfBlob = new File([audioFile], 'interviewAudio.mp3');
        console.log(audioFile)
        formData.append('file', audioFile, 'audio.mp3');
        console.log(formData)
        await fetch(`${apiAddress}/uploadAudio`, {
          method: "POST",
          body: formData
        }).then(
            response => response.blob()
        ).then(
                blob => setQuestionAudio(blob)

        ).catch((e) => {console.log(e)})
      };

    console.log(questionAudio);
    return (
        <div>
            {questionAudio ?
            <div>
            <div className="text-3xl">Interviewer Response</div>
                <div>
                    <AudioVisualizer
                        blob={questionAudio}
                        width={500}
                        height={75}
                        barWidth={1}
                        gap={0}
                        barColor={'#9333ea'}
                    />
                <audio controls autoPlay>
                    <source src={questionLink} type="audio/mp3"/>
                    Your browser does not support the video tag.
                </audio>
                </div>
            </div>: <div></div>
            }
            <div className="text-3xl">Interview Panel</div>

            <main>
                <div className="audio-controls">
                {!permission ? (
                    <div>
                        <div className="text-gray-500 py-2 pb-4">Please enable the following permissions to begin the interview</div>
                <button className="border-2 border-zinc-900 text-black px-8 py-2 rounded-xl hover:bg-zinc-900 hover:text-white transition-all" onClick={getMicrophonePermission} type="button">
                    Allow Microphone Recording
                </button>
                    </div>
                ) : <></>}
                {permission && recordingStatus === "inactive" ? (
                    <div>
                        <div className="text-gray-500 py-2 pb-4">Please click begin when you are ready to start the interview process. Start speaking and introduce yourself!</div>
                        {loading ? <ScaleLoader className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500" /> :
                            <button  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl py-2 px-8 "  onClick={startRecording} type="button">
                            Begin
                        </button>}
                    </div>
                ) : <></>}
                {recordingStatus === "recording" ? (
                    <div>
                        <div className="text-gray-500 py-2 pb-4">Click stop when done. </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl py-2 px-8 " onClick={stopRecording} type="button">
                    Stop Recording
                </button>
                    </div>
                ) : <></>}
                </div>
                {audio ? (
                <div className="py-8 px-8 bg-zinc-900 rounded-xl my-4 text-white">
                    <div className="text-2xl font-bold">Developer Panel</div>
                    <div className="pb-4">Clients will not be able to see this panel. For debugging only. The Client Audio file is below:</div>
                    <audio src={audio} controls></audio>
                    <button className="border-2 border-white hover:bg-white hover:text-black transition-all rounded-xl py-2 px-4 my-8 mx-4 " onClick={submitAudio} type="button">
                        Analyze Input
                    </button>
                    <a className="border-2 border-white hover:bg-white hover:text-black transition-all rounded-xl py-2 px-4 my-4 mx-4 " download href={audio}>
                        Download Recording
                    </a>
                </div>
                ) : null}
            </main>
        </div>
    );
};
export default AudioRecorder;