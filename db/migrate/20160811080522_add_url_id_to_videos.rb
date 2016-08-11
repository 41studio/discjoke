class AddUrlIdToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :url_id, :string
  end
end
