module Pagination
  extend ActiveSupport::Concern

  def get_page_count
    data_count =
      case self.class.to_s
        when "Api::VideosController" then @channel.videos.not_played.count
        when "Api::ChannelsController" then Channel.active.count
      end

    render json: {page_count: data_count}, status: :ok
  end

end
