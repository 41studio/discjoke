class Channel < ActiveRecord::Base
  enum status: [:active, :inactive]

  scope :newest, -> { order(created_at: :desc) }
  scope :active, -> { where(status: 0) }

end
