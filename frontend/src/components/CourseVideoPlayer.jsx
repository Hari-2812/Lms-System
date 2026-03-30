const CourseVideoPlayer = ({ title, videoUrl }) => {
  const isYouTubeVideo = videoUrl.includes('youtube.com/embed/');

  if (isYouTubeVideo) {
    return (
      <iframe
        title={`${title} video`}
        src={videoUrl}
        className="w-full aspect-video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video controls className="w-full aspect-video" preload="metadata" src={videoUrl}>
      Your browser does not support the video tag.
    </video>
  );
};

export default CourseVideoPlayer;
