class Api::ChannelsController < BaseApiController

  include Pagination

  before_action :set_channel, only: [:remove, :update]
  http_basic_authenticate_with name: "bossdj", password: "dj41kecehcelalu", only: [:index]

  def index
    channels = Channel.active.newest.page(params[:page]).per(1)
    render json: channels
  end

   def show
    channel = Channel.find_by_url(params[:url])
    save_and_response_to(channel, channel)
  end

  def create
    channel = Channel.new(channel_params)
    save_and_response_to(channel.save, channel)
  end

  #FIXME: params not in group
  def update
    save_and_response_to(@channel.update(channel_params_for_update), @channel)
  end

  def remove
    @channel.inactive!
    render json: @channel, status: :ok
  end

  private

    def set_channel
      @channel = Channel.find(params[:id])
    end

    def channel_params_for_update
      {id: params[:id], name: params[:name], url: params[:url], password: params[:password] }
    end

    def channel_params
      params.require(:channel).permit(:name, :url, :password)
    end
end
