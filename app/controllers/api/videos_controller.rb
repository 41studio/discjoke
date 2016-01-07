class Api::VideosController < BaseApiController
  def create
    video = Video.new(video_params)

    video.user_id = current_user_id

    if video.save
      render json: video, status: :ok
    else
      render json: { errors: video.errors.full_messages }, status: 400
    end
  end

  def index
    videos = Video.all
    render json: videos, status: :ok
  end

  def show
    render json: Video.find(params[:id]), status: :ok
  end

  def played
    played_video = Video.find(params[:id])
    played_video.mark_as(:played)

    next_video = Video.play_now
    next_video.mark_as(:playing)

    render json: video, status: :ok
  end

  def play
    video = Video.play_now
    if video.present?
      video.playing = true
      video.save
    end
    render json: video, status: :ok
  end

  private
    def video_params
      params.require(:video).permit(:url)
    end
end
