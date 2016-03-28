class Video < ActiveRecord::Base
  YT_REGEX = /(https|http):\/\/www\.youtube\.com\/watch\?v\=([a-zA-Z0-9_-]{6,11})/

  before_validation :set_detail

  belongs_to :channel

  validates :url, presence: true
  validates :url, uniqueness: { scope: :channel_id }
  validates_format_of :url, with: YT_REGEX, message: 'Not valid youtube url.'
  validates_numericality_of :duration, less_than_or_equal_to: 420, message: 'should less than 7 minutes.'
  validate :check_limit
  validate :check_banned

  scope :not_played, -> { order(created_at: :asc).where(status: false) }
  scope :newest, -> { order(created_at: :desc) }
  scope :order_by_now_playing, -> { order(playing: :desc) }
  scope :order_by_playing_status, -> { order(:status) }
  scope :order_by_playlist, -> { order_by_now_playing.order_by_playing_status.newest }
  scope :not_banned, -> { where(banned: false) }

  def self.play_now
    not_played.first
  end

  def videos
    Video.not_banned.where(channel_id: channel_id).order(id: :asc)
  end

  def mark_as(status)
    case status

    when :played
      self.status   = true
      self.playing  = false
    when :playing
      self.playing = true
    end

    self.save
  end

  def set_detail
    if YT_REGEX =~ url
      video = Yt::Video.new(url: url)

      self.title = video.title.truncate_words(10)
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

  def banned!
    self.update(banned: true)
  end

  def play!
    videos.update_all(playing: false)
    self.playing = true
    self.save validate: false
  end

  def next
    video = Video.not_banned.order(id: :asc).where("id > ? AND channel_id = ?", id, channel_id).first
    if video.present?
      video
    else
      channel.videos.not_banned.first
    end
  end

  def prev
    video = Video.not_banned.order(id: :asc).where("id < ? AND channel_id = ?", id, channel_id).first
    if video.present?
      video
    else
      channel.videos.not_banned.last
    end
  end

  private

  def check_banned
    true
  end
end
