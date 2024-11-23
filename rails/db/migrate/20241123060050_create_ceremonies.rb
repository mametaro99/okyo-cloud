class CreateCeremonies < ActiveRecord::Migration[7.0]
  def change
    create_table :ceremonies do |t|
      t.string :name, null: false
      t.date :event_date, null: false
      t.references :user, null: false, foreign_key: true
      t.string :location
      t.text :description

      t.timestamps
    end
  end
end
