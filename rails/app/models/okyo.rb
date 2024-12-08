class Okyo < ApplicationRecord
  has_one_attached :video
  has_many :ceremony_okyo_groups
  has_many :okyo_sect_groups, dependent: :destroy
  has_many :sects, through: :okyo_sect_groups
  has_many :okyo_phrases, dependent: :destroy
  accepts_nested_attributes_for :okyo_phrases, allow_destroy: true
  
  validates :name, presence: true

  # お経の宗派名の一覧を返すメソッド

  def sect_names
    sects.map(&:name)
  end
end
