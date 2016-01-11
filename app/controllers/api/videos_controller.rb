class Api::VideosController < BaseApiController
  before_action :set_channel, only: [:create, :index, :get_page_count]
  def create

    video = @channel.videos.create( url: params[:video][:url], user_id: current_user_id )

    save_and_response_to(video.id.present?, video)
  end

  def index
    videos  = @channel.present? ? @channel.videos.order_by_playlist.page(params[:page]).per(1) : Video.all
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

  def get_page_count
    render json: {page_count: @channel.videos.count}, status: :ok
  end

  private
    def set_channel
      @channel = Channel.find_by_url params[:channel_url]
    end

    def video_params
      params.require(:video).permit(:url)
    end
end
