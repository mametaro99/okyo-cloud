class CeremonyOkyoGroup < ApplicationRecord
  belongs_to :okyo
  belongs_to :ceremony
  validates :order, presence: true
  validates :order, uniqueness: { scope: :ceremony_id, message: "is already taken for this ceremony" }
end
