Yt.configure do |config|
  config.log_level = :debug
  config.api_key = ENV['YT_API_KEY']
  config.client_id = ENV['YT_CLIENT_ID']
  config.client_secret = ENV['YT_CLIENT_SECRET']
end
