json.array! @channels do |channel|
  json.(channel, :id, :url, :name, :created_at)
  json.videos_count channel.videos.count
end
