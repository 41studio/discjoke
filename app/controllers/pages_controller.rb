class PagesController < ApplicationController
  http_basic_authenticate_with name: ENV['BOSS_NAME'], password: ENV['BOSS_PASS'], only: [:bossdj]

  def index
  end

  def bossdj
    channels = Channel.active.newest.page(params[:page]).per(1)
    render 'pages/index'
  end
end
