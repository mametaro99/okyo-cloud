class RemoveUniqueIndexFromCeremonyOkyoGroups < ActiveRecord::Migration[7.0]
  def change
    remove_index :ceremony_okyo_groups, column: [:okyo_id, :ceremony_id, :order], unique: true
  end
end
