import "./App.css";
import { useState, useRef } from "react";
import VideoRecorder from "./components/videoRecorder";
import AudioRecorder from "./components/audioRecorder";

const App = () => {
    let [recordOption, setRecordOption] = useState("video");
    const toggleRecordOption = (type) => {
        return () => {
            setRecordOption(type);
        };
    };
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between px-16 bg-zinc-800 drop-shadow-2xl items-center">
                <div className="text-6xl pt-4 pb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    so·lil·o·quy</div>
                <div className="text-3xl text-white font-bold">speak your voice</div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div className="py-8 px-4 flex flex-row">
                        <button className="bg-zinc-800 mx-4 text-white rounded-xl py-4 font-bold text-lg hover:bg-zinc-700 px-8" onClick={toggleRecordOption("video")}>
                          TEST: Record Video
                        </button>
                        {recordOption === "video" ?
                            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mx-4 text-white rounded-xl py-4 font-bold text-lg hover:bg-zinc-700 px-8" onClick={toggleRecordOption("audio")}>
                                Begin Interview
                            </button> :
                            <div className="border-2 border-black mx-4 text-black rounded-xl py-4 font-bold text-lg px-8" onClick={toggleRecordOption("audio")}>
                                Interview in progress
                            </div>
                        }

                    </div>
                </div>
                <div className="px-8 py-8 border-r h-screen">
                    {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
                </div>
            </div>
        </div>
    );
};
export default App;