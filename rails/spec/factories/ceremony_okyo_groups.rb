# spec/factories/ceremony_okyo_groups.rb
FactoryBot.define do
  factory :ceremony_okyo_group do
    order { 1 }
    association :ceremony  # Associate with the Ceremony factory
    association :okyo  # Assuming you have an Okyo factory (you can replace this with your actual association)
  end
end
