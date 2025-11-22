class CreateDoctors < ActiveRecord::Migration[8.1]
  def change
    create_table :doctors do |t|
      t.string :name
      t.references :specialty, null: false, foreign_key: true

      t.timestamps
    end
  end
end
