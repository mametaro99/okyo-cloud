class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :location, :sect, :created_at, :updated_at
  belongs_to :sect, serializer: SectSerializer
end
