class OkyoSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :video_url, :article_url, :created_at, :updated_at
end
