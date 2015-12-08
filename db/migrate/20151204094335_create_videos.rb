class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :title
      t.string :url
      t.boolean :status, default: false
      t.integer :duration, default: 0
      t.text :description
      t.string :thumbnail
      t.string :user_id
      t.boolean :playing, default: false

      t.timestamps null: false
    end
  end
end
