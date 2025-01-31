class OkyoPhrase < ApplicationRecord
  belongs_to :okyo
  validation :phrase_text, presence: true
  validation :meaning, presence: true
  validation :reading, presence: true
end
