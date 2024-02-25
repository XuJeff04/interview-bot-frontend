import "./App.css";
import {useState, useRef, useEffect} from "react";
import VideoRecorder from "./components/videoRecorder";
import AudioRecorder from "./components/audioRecorder";
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';
import {Ticker} from "pixi.js";


const cubism4Model =
    "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";

const App = () => {
    let [recordOption, setRecordOption] = useState("video");
    const toggleRecordOption = (type) => {
        return () => {
            setRecordOption(type);
        };
    };
    useEffect(() => {
        const app = new PIXI.Application({
            view: document.getElementById("canvas"),
            autoStart: true,
            resizeTo: window,
            transparent: true,
            backgroundAlpha: 0
        });

        const model4 = Live2DModel.fromSync("https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json");

        // register Ticker for Live2DModel
        Live2DModel.registerTicker(Ticker);

        model4.once('load', () => {
            app.stage.addChild(model4);
            model4.scale.set(0.25);
            model4.x = 300;
        });
        model4.on('hit', (hitAreas) => {
            if (hitAreas.includes('body')) {
                model4.motion('tap_body');
            }
        });

    })
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
                <div className="h-screen">
                    <div className="px-8 py-8">
                    {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
                    </div>
                    <canvas id="canvas"></canvas>
                </div>
            </div>
        </div>
    );
};
export default App;