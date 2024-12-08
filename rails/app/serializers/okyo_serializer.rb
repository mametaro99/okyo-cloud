class OkyoSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :article_url, :sects, :video, :created_at, :updated_at
  has_many :sects, serializer: SectSerializer
  has_many :okyo_phrases, serializer: OkyoPhraseSerializer
  
  # ActiveStorageでS3にアップロードされた動画の署名付きURLを返すメソッド
  def video
    object.video.attachment.service.send(:object_for, object.video.key).public_url if object.video.attached?
  end
end
