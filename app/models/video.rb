# == Schema Information
#
# Table name: videos
#
#  id          :integer          not null, primary key
#  title       :string
#  url         :string
#  status      :boolean          default("false")
#  duration    :integer          default("0")
#  description :text
#  thumbnail   :string
#  user_id     :string
#  playing     :boolean          default("false")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  channel_id  :integer
#  banned      :boolean          default("false")
#

class Video < ActiveRecord::Base
  YT_REGEX = /(https|http):\/\/(www\.|)(youtube\.com\/\watch\?v\=|youtu\.?be\/)([a-zA-Z0-9_-]{6,11})/

  before_validation :set_detail

  belongs_to :channel

  validates :url, presence: true
  validates :url_id, uniqueness: { scope: :channel_id }
  validates_format_of :url, with: YT_REGEX, message: 'Not valid youtube url.'
  validates_numericality_of :duration, less_than_or_equal_to: 420, message: 'should less than 7 minutes.'
  validate :check_limit
  validate :check_banned
  validate :check_embedable

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
      self.url_id = url.match(YT_REGEX)[4]
    end
  end

  def check_limit
    videos = Video.not_banned.where(channel_id: channel_id)
      .where("created_at > ? AND user_id = ?", 1.hour.ago, user_id)

    if self.new_record? && videos.count >= 5
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

  def next(random = false)
    previous_video = videos.find_by_id(id)
    previous_video.mark_as(:played) if previous_video.present?

    video = random_video(random)

    if video.present?
      video
    else
      videos.update_all(status: false)
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

  def random_video(random)
    if random
      Video.not_banned.where(status: false).where("id != ? AND channel_id = ?", id, channel_id).order("RANDOM()").first
    else
      Video.not_banned.order(id: :asc).where("id > ? AND channel_id = ?", id, channel_id).first
    end
  end

  def check_embedable
    video = Yt::Video.new(url: url)

    errors.add(:status, 'video not embeddable.') unless video.embeddable?
  end
end
