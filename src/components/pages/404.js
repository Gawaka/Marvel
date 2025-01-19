import Marvel404 from '../pages/Marvel404.mp4';

const Page404 = ()=> {
    return (
        <div className='video-container'>
            <video
                className='background-video'
                src={Marvel404}
                autoPlay
                loop
                muted
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    margin: '0 auto' 
                }}
            />
        </div>
    )
}

export default Page404;