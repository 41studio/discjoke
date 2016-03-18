json.array! @channels do |channel|
  json.(channel, :id, :name)
  json.videos_count channel.videos.count
end
