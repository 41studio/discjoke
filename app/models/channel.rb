class Channel < ActiveRecord::Base
  enum status: [:active, :inactive]

  before_save :encrypt_password, :parameterize_url

  has_and_belongs_to_many :videos

  scope :newest, -> { order(created_at: :desc) }
  scope :active, -> { where(status: 0) }

  def encrypt_password
    self.password = Digest::SHA2.hexdigest("Adding #{url} and {password}") if password.present?
  end

  def parameterize_url; self.url = url.parameterize end

end
