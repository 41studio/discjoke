class AddAnnouncementToChannels < ActiveRecord::Migration
  def change
    add_column :channels, :announcement, :text, default: 'Enjoy your music.'
  end
end
