class Api::VideosController < BaseApiController

  include Pagination

  before_action :set_channel, only: [:create, :index,  :get_page_count]
  before_action :set_video, only: [:show, :played]

  def create
    @video = Video.new(video_params.merge(user_id: current_user_id))
    if @video.save
      @channel.videos << @video
      render :show, status: 201
    else
      render json: @video.errors.full_messages, status: 400
    end
  end

  def index
    videos  = @channel.present? ? @channel.videos.not_played.order_by_playlist.page(params[:page]).per(1) : Video.all
    render json: videos, status: :ok
  end

  def show
  end

  def played
    played_video = @video
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
    def set_channel
      @channel = Channel.find params[:channel_id]
    end

    def set_video
      @video = Video.find params[:id]
    end

    def video_params
      params.require(:video).permit(:url)
    end
end
