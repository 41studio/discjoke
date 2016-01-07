class Api::ChannelsController < BaseApiController
  before_action :set_channel, only: [:remove, :update]

  def index
    channels = Channel.active.newest
    render json: channels
  end

  def create
    channel = Channel.new(channel_params)
    save_and_response_to(channel, channel.save)
  end

  def update
    save_and_response_to(@channel, @channel.update(channel_params_for_update))
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
