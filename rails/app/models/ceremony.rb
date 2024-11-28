class Ceremony < ApplicationRecord
  belongs_to :user
  has_many :ceremony_okyo_groups, dependent: :destroy
  has_many :okyos, through: :ceremony_okyo_groups
  accepts_nested_attributes_for :ceremony_okyo_groups, allow_destroy: true

  validates :name, presence: true
  validates :event_date, presence: true

  def ceremony_okyo_groups_attributes=(attributes)
    attributes.each do |_, group_attrs|
      # group_attrsがnilでないかをチェック
      next if group_attrs.nil?

      if group_attrs[:id].to_i <= -1
        # 新規作成
        ceremony_okyo_groups.build(group_attrs.except(:id))
      elsif group_attrs[:_destroy] == "1"
        # 削除フラグが立っている場合
        ceremony_okyo_groups.find_by(id: group_attrs[:id])&.destroy
      else
        # 既存のデータを更新
        ceremony_okyo_groups.find_by(id: group_attrs[:id])&.update(group_attrs.except(:_destroy))
      end
    end
  end
end
