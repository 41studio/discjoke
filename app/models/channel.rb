# == Schema Information
#
# Table name: channels
#
#  id         :integer          not null, primary key
#  name       :string
#  url        :string
#  password   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  status     :integer          default("0")
#

class Channel < ActiveRecord::Base
  enum status: [:active, :inactive]

  before_save :encrypt_password, :parameterize_url

  has_many :videos, dependent: :destroy

  scope :newest, -> { order(created_at: :desc) }
  scope :active, -> { where(status: 0) }

  validates :name, :url, :password, presence: true

  def encrypt_password
    self.password = Digest::SHA2.hexdigest("Adding #{url} and #{password}") if password.present?
  end

  def parameterize_url; self.url = url.parameterize end

end
