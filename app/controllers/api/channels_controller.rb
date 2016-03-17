class Api::ChannelsController < BaseApiController

  include Pagination

  before_action :set_channel, only: [:remove, :update, :sign_in]

  def index
    channels = Channel.newest
    render json: channels
  end

  def show
    @channel = Channel.includes(:videos).find(params[:id])
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

  def sign_in
    password       = Digest::SHA2.hexdigest("Adding #{@channel.url} and #{params[:password]}")
    valid_password = @channel.password.eql?(password)

    if valid_password
      render json: { is_password_valid: true }, status: 200
    else
      render json: { is_password_valid: false }, status: 401
    end
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
