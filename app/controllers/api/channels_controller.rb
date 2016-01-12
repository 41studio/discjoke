class Api::ChannelsController < BaseApiController

  include Pagination

  before_action :set_channel, only: [:remove, :update, :show, :sign_in]

  def index
    channels = Channel.active.newest.page(params[:page]).per(1)
    render json: channels
  end

   def show
    save_and_response_to(@channel, @channel)
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
    save_and_response_to(valid_password, {is_password_valid: valid_password})
  end

  private

    def set_channel
      @channel =
        params[:id].present? ? Channel.find(params[:id]) : Channel.find_by_url(params[:url])
    end


    def channel_params_for_update
      {id: params[:id], name: params[:name], url: params[:url], password: params[:password] }
    end

    def channel_params
      params.require(:channel).permit(:name, :url, :password)
    end
end
