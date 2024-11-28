# spec/factories/ceremonies.rb
FactoryBot.define do
  factory :ceremony do
    name { "Ceremony Name" }
    event_date { "2024-12-31" }
    location { "Ceremony Location" }
    description { "Ceremony Description" }
    association :user

    # You can define associations here if needed
    # For example, if Ceremony has many CeremonyOkyoGroups:
    # association :ceremony_okyo_group, factory: :ceremony_okyo_group
  end
end
