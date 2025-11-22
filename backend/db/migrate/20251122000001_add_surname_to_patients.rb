class AddSurnameToPatients < ActiveRecord::Migration[7.1]
  def change
    add_column :patients, :surname, :string
  end
end
