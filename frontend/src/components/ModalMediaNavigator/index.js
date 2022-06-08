import React, {useState} from "react";

import {makeStyles} from "@material-ui/core";
import {Close, ArrowBack, ArrowForward} from "@material-ui/icons";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const useStyles = makeStyles(theme => ({
	modalWrapper: {
		position:"fixed",
        width:"100%",
        height:"100%",
        top: 0,
        left:0,
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000000
	},
    modalClose: {
        position:"absolute",
        top: "10px",
        right: "10px",
        fontWeight: "bold",
        padding: "5px",
        cursor: "pointer",
        color: "#FFF",
        fontSize: "1.5em",
        zIndex:999999999
    },
    modalCurrent: {
        position:"absolute",
        top: 0,
        left: 0,
        display:"flex",
        transition: "1s"
    },
    mediaItem: {
        position:"relative",
        "& img": {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "translate(-50%, -50%)"
        },
        "& video": {
            position: "absolute",
            top: "50%",
            left: "50%",
            objectFit: "contain",
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)"
        }
    },
    modalFooter: {
        width: "100%",
        position:"absolute",
        color:"#CCC",
        bottom: "20px",
        textAlign: "center"
    },
    navLeft: {
        position:"absolute",
        top: "50%",
        left:"10px",
        transform: "translateY(-50%)",
        color: "#FFF",
        cursor:"pointer",
        fontWeight: "bold",
        zIndex: 9999999999
    },
    navRight: {
        position:"absolute",
        top: "50%",
        right:"10px",
        transform: "translateY(-50%)",
        color: "#FFF",
        cursor:"pointer",
        fontWeight: "bold",
        zIndex: 9999999999
    }
}));


const ModalMediaNavigator = ({medias, onClose}) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentLeft, setCurrentLeft] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const stopVideos = () => {
        document.querySelectorAll('video').forEach(vid => vid.pause());
    }

    const handleTouchStart = e => {
        setTouchStart(e.targetTouches[0].clientX);
    }

    const handleTouchMove = e => {
        setTouchEnd(e.targetTouches[0].clientX);
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 150) {
            // do your stuff here for left swipe
            navToRight();
        }

        if (touchStart - touchEnd < -150) {
            // do your stuff here for right swipe
            navToLeft();
        }
    }

    const { height, width } = useWindowDimensions();

    const navToLeft = () => {
        if (currentIndex > 0) {
            stopVideos();
            setCurrentIndex(currentIndex-1);
            setCurrentLeft((currentIndex - 1) * width * -1);
        }
    }

    const navToRight = () => {
        if (currentIndex < (medias.length - 1)) {
            stopVideos();
            setCurrentIndex(currentIndex+1);
            setCurrentLeft((currentIndex + 1) * width * -1);
        }
    }

    return (
        <div className={classes.modalWrapper}>
            <div className={classes.modalClose} onClick={onClose}><Close /></div>
            <div className={classes.navLeft} onClick={navToLeft}><ArrowBack /></div>
            <div className={classes.modalCurrent} style={{left: currentLeft}} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                {medias.map((media, index) => {
                    return (
                        <div className={classes.mediaItem} key={index} alt="" style={{width: width, height: height}}  >
                            {media.type === 'photo' ? <img src={media.url} /> : <video controls><source src={media.url} type='video/mp4' /></video>}
                        </div>
                    )
                })}
            </div>
            <div className={classes.modalFooter}>{currentIndex + 1} de {medias.length} imagens<br />{medias[currentIndex].title}</div>
            <div className={classes.navRight} onClick={navToRight}><ArrowForward /></div>
        </div>
    )
}

export default ModalMediaNavigator;