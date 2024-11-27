FactoryBot.define do
  factory :sect do
    name { Faker::Religion.name } # 宗教のランダムな名前を生成
    description { Faker::Lorem.paragraph } # 説明文を生成
  end
end
