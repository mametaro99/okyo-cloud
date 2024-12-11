class CeremonySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :created_at, :updated_at
  has_many :ceremony_okyo_groups, each_serializer: CeremonyOkyoGroupSerializer
end
