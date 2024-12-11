class Ceremony < ApplicationRecord
  belongs_to :user
  has_many :ceremony_okyo_groups, dependent: :destroy
  has_many :okyos, through: :ceremony_okyo_groups
  has_many :ceremony_okyos, through: :ceremony_okyo_groups
  accepts_nested_attributes_for :ceremony_okyo_groups, allow_destroy: true

  validates :name, presence: true
  validates :event_date, presence: true
end
