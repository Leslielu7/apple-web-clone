import { highlightsSlides } from "../constants";
import { useRef, useState, useEffect } from "react";
import { replayImg, playImg, pauseImg } from "../utils";

import { useGSAP } from "@gsap/react";
import gsap from 'gsap';

import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const [loadedData, setLoadedData] = useState([]);

    // destruction
    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

    useGSAP( () => {
        gsap.to('#slider',{
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut'
        });
  
        gsap.to('#video',{
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((prevVideo) => (
                    {...prevVideo, startPlay: true, isPlaying: true}
                ));
            },
        });
    } ,[isEnd, videoId]);

    // playing of the video
    useEffect(() => {
        if(loadedData.length > 3){
            if(!isPlaying){
                videoRef.current[videoId].pause();
            }else{
                startPlay && videoRef.current[videoId].play();
            }
        }

    },[startPlay, videoId, isPlaying, loadedData]);

    const handleLoadedMetadata = (index, event) => setLoadedData(
        (pre) => [...pre, event]);

    // progress bar of the video
    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]){
            // animate the progress of the video
            let anim = gsap.to(span[videoId],{
                // actions when animation updates
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    
                    if (progress != currentProgress){
                        currentProgress = progress;
                    }

                    gsap.to(videoDivRef.current[videoId],{
                        width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
                    });

                    gsap.to(span[videoId], {
                        width: `${currentProgress}%`,
                        backgroundColor: 'white'
                    });
                    
                },
                 // actions when animation completes
                onComplete: () => {
                    if(isPlaying) {
                        gsap.to(videoDivRef.current[videoId],{
                            width: '12px'
                        });
                        gsap.to(span[videoId],{
                            backgroundColor: '#afafaf'
                        });
                    }
                },
            });

            if(videoId === 0){
                anim.restart();
            }

            // calculate how long does the animation last in order to update the progress bar
            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime/highlightsSlides[videoId].videoDuration);
            };

            if(isPlaying){
                // use ticker to update the progress bar
                gsap.ticker.add(animUpdate);
            }else{
                gsap.ticker.remove(animUpdate);
            }
        }

    }, [videoId, startPlay]);

    const handleProcess = (type, index) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => ({...prevVideo, isEnd: true, videoId: index+1}));
                break;
            case 'video-last':
                setVideo((prevVideo) => ({...prevVideo, isLastVideo: true}));
                break;
            case 'video-reset':
                setVideo((prevVideo) => ({...prevVideo, isLastVideo: false, videoId: 0}));
                break;
            case 'play':
                setVideo((prevVideo) => ({...prevVideo,  isPlaying: !prevVideo.isPlaying}));
                break;
            case 'pause':
                setVideo((prevVideo) => ({...prevVideo,  isPlaying: !prevVideo.isPlaying}));
                break;
            default:
                return video;

        }
    };

    return (
        <>
            <div className='flex items-center'>
                {highlightsSlides.map((list, index) => (

                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel-container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video id="video" playsInline={true} preload='auto' muted
                                className={`${list.id === 2 && 'translate-x-44'} pointer-events-none`}
                                ref={(el) => (videoRef.current[index] = el)} 
                                onEnded={() => 
                                    index !== 3
                                    ? handleProcess('video-end', index) 
                                    : handleProcess('video-last')
                                }
                                onPlay={() => { setVideo((prevVideo) => ({ ...prevVideo, isPlaying: true}))}}
                                onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                                >
                                    <source src={list.video} type="video/mp4"></source>
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10" >
                                {list.textLists.map((text, index)=>(
                                    <p key={index} className="md:text-2xl text-xl font-medium"> {text} </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                
            <div className="relative flex-center mt-10">
                    <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                        {videoRef.current.map((_, index) => (
                            <span
                            key={index}
                            ref={(el) => (videoDivRef.current[index] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            >
                                <span className="absolute h-full w-full rounded-full" 
                                ref={(el) => (videoSpanRef.current[index] = el)}></span>
                            </span>
                        ))}
                    </div>
                    <button className="control-btn">
                        <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? 'replayImg' : !isPlaying ? 'playImg' : 'pauseImg'}
                        onClick={isLastVideo ? () => handleProcess('video-reset') :
                                isPlaying ? () => handleProcess('play') :  () => handleProcess('pause')}
                        ></img>
                    </button>
                    
                
            </div>
        </>
    );
};

export default VideoCarousel;