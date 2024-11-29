FactoryBot.define do
  factory :ceremony_okyo_group do
    sequence(:order) { |n| n }
    ceremony
    okyo
  end
end
