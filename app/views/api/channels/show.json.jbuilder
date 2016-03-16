json.(@channel, :id, :name)

json.videos @channel.videos, :id, :duration, :title, :url, :playing, :thumbnail, :created_at
