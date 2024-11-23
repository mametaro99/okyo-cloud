class CreateCeremonyOkyoGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :ceremony_okyo_groups do |t|
      t.references :okyo, null: false, foreign_key: true
      t.references :ceremony, null: false, foreign_key: true
      t.integer :order

      t.timestamps
    end
    add_index :ceremony_okyo_groups, [:okyo_id, :ceremony_id, :order], unique: true
  end
end
