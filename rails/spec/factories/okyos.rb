FactoryBot.define do
  factory :okyo do
    name { "般若心経" }
    description { "智慧の完成を説いたお経" }
    video_url { "https://youtu.be/sample1" }
    article_url { "https://blog.example.com/sample1" }
    published { true }
  end
end
