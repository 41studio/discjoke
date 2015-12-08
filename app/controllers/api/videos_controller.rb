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
    videos = Video.order(created_at: :asc)
    render json: videos, status: :ok
  end

  def show
    render json: Video.find(params[:id]), status: :ok
  end

  def played
    video = Video.find(params[:id])
    video.status = true
    video.playing = false
    video.save

    video = Video.play_now
    video.playing = true
    video.save

    render json: video, status: :ok
  end

  def play
    video = Video.play_now
    video.playing = true
    video.save

    render json: video, status: :ok
  end

  private
    def video_params
      params.require(:video).permit(:url)
    end
end
