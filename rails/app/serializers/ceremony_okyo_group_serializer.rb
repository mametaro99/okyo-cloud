class CeremonyOkyoGroupSerializer < ActiveModel::Serializer
  attributes :id, :order, :okyo_id, :ceremony_id, :order, :okyo
  belongs_to :okyo, serializer: OkyoSerializer
end
