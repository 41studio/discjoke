json.(@channel, :id, :name)

json.videos @channel.videos.not_banned, :id, :duration, :title, :url, :playing, :thumbnail, :created_at
