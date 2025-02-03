class OkyoSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :sects
  has_many :sects, serializer: SectSerializer
end
