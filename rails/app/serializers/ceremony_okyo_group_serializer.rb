class CeremonyOkyoGroupSerializer < ActiveModel::Serializer
  attributes :order, :okyo_id, :ceremony_id, :order, :okyo
  belongs_to :okyo, serializer: OkyoSerializer
end
