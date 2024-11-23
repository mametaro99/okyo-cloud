class Sect < ApplicationRecord
  has_many :okyo_sect_groups, dependent: :destroy
  has_many :users
end
