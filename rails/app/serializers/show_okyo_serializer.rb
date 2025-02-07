class ShowOkyoSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :article_url, :sects, :video, :created_at, :from_today, :published
  has_many :sects, serializer: SectSerializer
  has_many :okyo_phrases, serializer: OkyoPhraseSerializer do
    object.okyo_phrases.order(:order)
  end
  
  # ActiveStorageでS3にアップロードされた動画の署名付きURLを返すメソッド
  def video
    object.video.attachment.service.send(:object_for, object.video.key).public_url if object.video.attached?
  end

  def created_at
    object.created_at.strftime("%Y/%m/%d")
  end

  def from_today # rubocop:disable Metrics/AbcSize
    now = Time.zone.now
    created_at = object.created_at

    months = (now.year - created_at.year) * 12 + now.month - created_at.month - ((now.day >= created_at.day) ? 0 : 1)
    years = months.div(12)

    return "#{years}年前" if years > 0
    return "#{months}ヶ月前" if months > 0

    seconds = (Time.zone.now - object.created_at).round

    days = seconds / (60 * 60 * 24)
    return "#{days}日前" if days.positive?

    hours = seconds / (60 * 60)
    return "#{hours}時間前" if hours.positive?

    minutes = seconds / 60
    return "#{minutes}分前" if minutes.positive?

    "#{seconds}秒前"
  end
end
