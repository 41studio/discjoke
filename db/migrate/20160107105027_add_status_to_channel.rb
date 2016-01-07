class AddStatusToChannel < ActiveRecord::Migration
  def change
    add_column :channels, :status, :integer
  end
end
