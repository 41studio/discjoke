class AddBannedToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :banned, :boolean, default: false
  end
end
