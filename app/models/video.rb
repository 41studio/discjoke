class Video < ActiveRecord::Base
  YT_REGEX = /(https|http):\/\/www\.youtube\.com\/watch\?v\=([a-zA-Z0-9_-]{6,11})/

  before_validation :set_detail

  validates :url, presence: true
  validates_uniqueness_of :url, conditions: -> { where(status: false) }
  validates_format_of :url, with: YT_REGEX, message: 'Not valid youtube url.'
  validates_numericality_of :duration, less_than_or_equal_to: 420, message: 'should less than 7 minutes.'
  validate :check_limit

  scope :not_played, -> { order(created_at: :asc).where(status: false) }
  scope :play_now, -> { not_played.first }

  def set_detail
    if YT_REGEX =~ url
      video = Yt::Video.new(url: url)

      self.title = video.title
      self.duration = video.duration
      self.thumbnail = video.thumbnail_url('medium')
      self.description = video.description
    end
  end

  def check_limit
    videos = Video.where(user_id: user_id)

    if self.new_record? && videos.count > 5
      errors.add(:user_id, 'request has 5 videos')
    end
  end
end
