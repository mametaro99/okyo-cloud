class CreateOkyoSectGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :okyo_sect_groups do |t|
      t.references :okyo, null: false, foreign_key: true
      t.references :sect, null: false, foreign_key: true

      t.timestamps
    end
  end
end
