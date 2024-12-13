class CeremonyOkyoGroup < ApplicationRecord
  belongs_to :okyo
  belongs_to :ceremony
  validates :order, presence: true
  validates :okyo_id, presence: true
  validates :ceremony_id, presence:true
end
