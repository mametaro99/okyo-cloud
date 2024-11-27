require 'rails_helper'

RSpec.describe "Api::V1::Current::OkyoPhrases", type: :request do
  let!(:user) { create(:user) } # 認証済みのユーザー
  let!(:auth_headers) { user.create_new_auth_token } # Devise Token Auth を使用して認証ヘッダーを作成
  let!(:okyo) { create(:okyo) } # Okyo を作成
  let!(:okyo_phrase) { create(:okyo_phrase, okyo: okyo) } # OkyoPhrase を作成

  describe "POST /api/v1/current/okyo/:okyo_id/okyo_phrase" do
    let(:valid_attributes) do
      {
        okyo_phrase: {
          phrase_text: "New phrase text",
          meaning: "New meaning",
          reading: "New reading",
          video_start_time: 5,
          video_end_time: 15,
          order: 2
        }
      }
    end

    it "creates a new OkyoPhrase" do
      expect {
        post "/api/v1/current/okyo/#{okyo.id}/okyo_phrase",
             params: valid_attributes,
             headers: auth_headers
      }.to change(OkyoPhrase, :count).by(1)

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response["phrase_text"]).to eq("New phrase text")
    end
  end

  describe "PATCH /api/v1/current/okyo/:okyo_id/okyo_phrase/:id" do
    let(:update_attributes) do
      {
        okyo_phrase: {
          phrase_text: "Updated phrase text",
          meaning: "Updated meaning",
          video_start_time: 10,
          video_end_time: 20
        }
      }
    end

    it "updates the OkyoPhrase" do
      patch "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{okyo_phrase.id}",
            params: update_attributes,
            headers: auth_headers

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response["phrase_text"]).to eq("Updated phrase text")
      expect(json_response["meaning"]).to eq("Updated meaning")
      expect(json_response["video_start_time"]).to eq(10)
      expect(json_response["video_end_time"]).to eq(20)
    end
  end

  describe "DELETE /api/v1/current/okyo/:okyo_id/okyo_phrase/:id" do
    it "deletes the OkyoPhrase" do
      expect {
        delete "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{okyo_phrase.id}",
               headers: auth_headers
      }.to change(OkyoPhrase, :count).by(-1)
  
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response["message"]).to eq("Phrase deleted successfully")
    end
  
    it "returns an error when OkyoPhrase is not found" do
      non_existing_id = okyo_phrase.id + 1
      delete "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{non_existing_id}",
             headers: auth_headers
  
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /api/v1/current/okyo/:okyo_id/okyo_phrase/:id/sort_by" do
    let!(:okyo_phrase_1) { create(:okyo_phrase, okyo: okyo, order: 1) }
    let!(:okyo_phrase_2) { create(:okyo_phrase, okyo: okyo, order: 2) }
    let!(:okyo_phrase_3) { create(:okyo_phrase, okyo: okyo, order: 3) }
  
    let(:sort_by_params) do
      {
        before_order: 2,
        after_order: 1
      }
    end
  
    it "reorders the phrases successfully" do
      patch "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{okyo_phrase_2.id}/sort_by",
            params: sort_by_params,
            headers: auth_headers
  
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response["message"]).to eq("Phrases reordered successfully")
  
      # 順序が更新されたことを検証
      expect(okyo_phrase_2.reload.order).to eq(1)
      expect(okyo_phrase_1.reload.order).to eq(2)
      expect(okyo_phrase_3.reload.order).to eq(3)
    end
  
    it "returns an error for invalid order parameters" do
      invalid_sort_params = {
        before_order: 2,
        after_order: 5 # 範囲外
      }
  
      patch "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{okyo_phrase_2.id}/sort_by",
            params: invalid_sort_params,
            headers: auth_headers
  
      expect(response).to have_http_status(:unprocessable_entity)
    end
  
    it "returns an error when OkyoPhrase is not found" do
      non_existing_id = 9999 # 存在しない ID を設定
  
      patch "/api/v1/current/okyo/#{okyo.id}/okyo_phrase/#{non_existing_id}/sort_by",
            params: sort_by_params,
            headers: auth_headers
  
      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response["error"]).to eq("OkyoPhrase not found")
    end
  end
end
