class CreateChannelsVideos < ActiveRecord::Migration
  def change
    create_table :channels_videos, id: false do |t|
      t.belongs_to :channel, index: true
      t.belongs_to :video, index: true
    end
  end
end
