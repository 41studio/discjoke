class PagesController < ApplicationController
  http_basic_authenticate_with name: "bossdj", password: "dj41kecehcelalu", only: [:bossdj]

  def index
  end

  def bossdj
    channels = Channel.active.newest.page(params[:page]).per(1)
    render 'pages/index'
  end
end
