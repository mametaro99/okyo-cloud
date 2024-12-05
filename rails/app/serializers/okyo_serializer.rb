class OkyoSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :video_url, :article_url, :sects,:created_at, :updated_at
  has_many :sects, serializer: SectSerializer
end
