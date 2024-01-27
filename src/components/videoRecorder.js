import { useState, useRef } from "react";

const mimeType = "video/webm";

const apiAddress = "http://localhost:8081";


const VideoRecorder = () => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null);

    const getCameraPermission = async () => {
        setRecordedVideo(null);
        if ("MediaRecorder" in window) {
            try {
                const videoConstraints = {
                    audio: false,
                    video: true,
                };
                const audioConstraints = { audio: true };
                // create audio and video streams separately
                const audioStream = await navigator.mediaDevices.getUserMedia(
                    audioConstraints
                );
                const videoStream = await navigator.mediaDevices.getUserMedia(
                    videoConstraints
                );
                setPermission(true);
                //combine both audio and video streams
                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ]);
                setStream(combinedStream);
                //set videostream to live feed player
                liveVideoFeed.current.srcObject = videoStream;
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localVideoChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localVideoChunks.push(event.data);
        };
        setVideoChunks(localVideoChunks);
    };

    const stopRecording = () => {
        setPermission(false);
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: mimeType });
            const videoUrl = URL.createObjectURL(videoBlob);
            setRecordedVideo(videoUrl);
            setVideoChunks([]);
        };
      };
    const submitVideo = async () => {
        const formData = new FormData();
        formData.append('file', recordedVideo);
        await fetch(`${apiAddress}/uploadFile`, {
          method: "POST",
          body: formData
        }).catch((e) => {console.log(e)})
      };


    return (
        <div >
        <div className="text-3xl">Permissions</div>
            <div className="text-gray-500 text-sm py-2 pb-8">Please enable the following permissions to run this app</div>
            <main>
                <div className="video-controls">
                {!permission ? (
                <button className="bg-zinc-900 p-2 px-4 rounded-xl text-white hover:bg-zinc-700" onClick={getCameraPermission} type="button">
                    Allow Video
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
                {recordedVideo ? (
                <div className="audio-player">
                    <audio src={recordedVideo} controls></audio>
                    <button onClick={submitVideo} type="button">
                        analyze input
                    </button>
                    <a download href={recordedVideo}>
                        Download Recording
                    </a>
                </div>
                ) : null}
            </main>
        </div>
    );
};
export default VideoRecorder;