class AddDefaultToStatusInChannel < ActiveRecord::Migration
  def change
    change_column :channels, :status, :integer, :default => 0
  end
end
