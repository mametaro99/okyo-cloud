class OkyoPhrase < ApplicationRecord
  belongs_to :okyo
  validates :phrase_text, presence: true
  validates :meaning, presence: true
  validates :reading, presence: true
end
