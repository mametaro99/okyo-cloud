class CreateOkyoPhrases < ActiveRecord::Migration[7.0]
  def change
    create_table :okyo_phrases do |t|
      t.references :okyo, null: false, foreign_key: true
      t.integer :order, null: false
      t.string :phrase_text, null: false
      t.text :meaning, null: false
      t.string :reading, null: false
      t.integer :video_start_time
      t.integer :video_end_time

      t.timestamps
    end

    add_index :okyo_phrases, [:okyo_id, :order], unique: true
  end
end
