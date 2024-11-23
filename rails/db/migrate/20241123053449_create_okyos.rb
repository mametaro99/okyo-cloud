class CreateOkyos < ActiveRecord::Migration[7.0]
  def change
    create_table :okyos do |t|
      t.string :name, null: false
      t.text :description
      t.string :video_url
      t.string :article_url
      t.boolean :published, default: false

      t.timestamps
    end
  end
end
