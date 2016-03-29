class Api::VideosController < BaseApiController

  include Pagination

  before_action :set_channel, only: [:create, :index,  :get_page_count]
  before_action :set_video, only: [:show, :played, :play, :destroy, :next, :prev, :banned]

  def create
    @video = @channel.videos.new(video_params.merge(user_id: current_user_id))
    if @video.save
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

  def play
    @video.play!
    render json: @video, status: 200
  end

  def destroy
    @video.destroy
    head 204
  end

  def banned
    @video.banned!
    render json: @video, status: 200
  end

  def next
    video = @video.next(params[:random])
    video.play!
    render json: video, status: 200
  end

  def prev
    video = @video.prev
    video.play!
    render json: video, status: 200
  end

  private
    def set_channel
      @channel = Channel.find_by url: params[:channel_id]
    end

    def set_video
      @video = Video.find params[:id]
    end

    def video_params
      params.require(:video).permit(:url)
    end
end
