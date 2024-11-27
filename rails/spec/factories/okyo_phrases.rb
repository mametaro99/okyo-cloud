FactoryBot.define do
  factory :okyo_phrase do
    sequence(:order) { |n| n }
    phrase_text { "テストフレーズ" }
    reading { "テストリーディング" }
    meaning { "テストの意味" }
    association :okyo
  end
end