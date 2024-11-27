require 'rails_helper'

RSpec.describe "Api::V1::Okyo", type: :request do
  # データ作成
  let!(:okyo) { create(:okyo) } # Okyoレコードを1つ作成
  let!(:okyo_phrases) { create_list(:okyo_phrase, 5, okyo: okyo) } # Okyoに関連付けたOkyoPhraseを5つ作成

  describe "GET /index" do
    it "全てのお経を取得する" do
      get api_v1_okyo_index_path
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      expect(json).to be_an(Array)
      expect(json.size).to eq(1)
      expect(json.first["name"]).to eq(okyo.name)
    end
  end

  describe "GET /show/:id" do
    it "指定されたお経とそのフレーズを取得する" do
      get api_v1_okyo_path(okyo.id)
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      expect(json).to be_a(Hash)

      # お経の確認
      okyo_data = json["okyo"]
      expect(okyo_data["id"]).to eq(okyo.id)
      expect(okyo_data["name"]).to eq(okyo.name)

      # フレーズの確認
      phrases_data = json["okyo_phrases"]
      expect(phrases_data).to be_an(Array)
      expect(phrases_data.size).to eq(5)
      expect(phrases_data.first["phrase_text"]).to eq(okyo_phrases.first.phrase_text)
    end
  end
end
