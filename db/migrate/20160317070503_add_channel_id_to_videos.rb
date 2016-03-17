class AddChannelIdToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :channel_id, :integer
    add_index :videos, :channel_id
  end
end
