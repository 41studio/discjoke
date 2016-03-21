json.array! @channels do |channel|
  json.(channel, :id, :name, :created_at)
  json.videos_count channel.videos.count
end
