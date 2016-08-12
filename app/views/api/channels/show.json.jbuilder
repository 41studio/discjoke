json.(@channel, :id, :name, :announcement, :url)

json.videos @channel.videos.not_banned, :id, :duration, :title, :url, :playing, :thumbnail, :created_at, :status

