class Api::ChannelsController < BaseApiController
  before_action :set_channel, only: [:destroy, :update, :sign_in, :empty]

  def index
    @channels = Channel.all
  end

  def show
    @channel = Channel.includes(:videos).find_by url: params[:id]
  end

  def create
    channel = Channel.new(channel_params)
    save_and_response_to(channel.save, channel)
  end

  def update
    if @channel.update(channel_params)
      render json: @channel, status: 200
    else
      render json: @channel.errors.full_messages, status: 401
    end
  end

  def destroy
    @channel.destroy
    head 204
  end

  def empty
    @channel.videos.not_banned.destroy_all
    head 204
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
      @channel = Channel.find_by(url: params[:id])
    end

    def channel_params
      params.require(:channel).permit(:name, :url, :password)
    end
end
