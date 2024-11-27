FactoryBot.define do
  factory :okyo_phrase do
    association :okyo
    phrase_text { "Default phrase text" }
    meaning { "Default meaning" }
    reading { "Default reading" }
    video_start_time { 0 }
    video_end_time { 10 }
    sequence(:order) { |n| n } # 順序をユニークにするためにsequenceを使用
  end
end
