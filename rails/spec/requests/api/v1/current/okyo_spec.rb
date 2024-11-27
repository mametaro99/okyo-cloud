require 'rails_helper'

RSpec.describe "Api::V1::Current::OkyoController", type: :request do
  let!(:sect1) { create(:sect) }  # Sect を作成
  let!(:sect2) { create(:sect) }  # Sect を作成
  let!(:okyo) { create(:okyo, sects: [sect1, sect2]) }  # Sect を関連付けて Okyo を作成

  let(:valid_attributes) do
    {
      okyo: {
        name: "Test Okyo",
        description: "This is a test okyo.",
        article_url: "https://example.com",
        published: true,
        video_url: "test_video.mp4",
        sect_ids: [sect1.id, sect2.id]  # 動的に作成した Sect の ID を設定
      }
    }
  end

  let(:invalid_attributes) do
    {
      okyo: {
        name: "",
        description: "This is an invalid okyo.",
        article_url: "https://example.com",
        published: true,
        video_url: "test_video.mp4",
        sect_ids: [sect1.id, sect2.id]  # 動的に作成した Sect の ID を設定
      }
    }
  end

  let(:current_user) { create(:user) }  # FactoryBot を使用してユーザーを作成
  let(:headers) { current_user.create_new_auth_token }  # ログイン用のヘッダー

  # GET /api/v1/current/okyo
  describe "GET /index" do
    it "returns all okyos" do
      get api_v1_current_okyo_index_path, headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(1) # Okyoの数に合わせて調整
    end
  end

  # POST /api/v1/current/okyo
  describe "POST /create" do
    context "with valid attributes" do
      it "creates a new Okyo" do
        expect {
          post api_v1_current_okyo_index_path, params: valid_attributes, headers: headers
        }.to change(Okyo, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)["name"]).to eq("Test Okyo")
      end
    end

    context "with invalid attributes" do
      it "does not create a new Okyo" do
        expect {
          post api_v1_current_okyo_index_path, params: invalid_attributes, headers: headers
        }.to change(Okyo, :count).by(0)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"].any? { |e| e.include?("名前を入力してください") }).to be true
      end
    end
  end

  # GET /api/v1/current/okyo/:id
  describe "GET /show/:id" do
    it "returns the requested okyo" do
      get api_v1_current_okyo_path(okyo), headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq(okyo.name)
    end

    it "returns error if okyo is not found" do
      get api_v1_current_okyo_path(id: "nonexistent_id"), headers: headers
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("Okyo not found")
    end
  end

  # PATCH /api/v1/current/okyo/:id
  describe "PATCH /update/:id" do
    context "with valid attributes" do
      it "updates the requested okyo" do
        patch api_v1_current_okyo_path(okyo), params: { okyo: { name: "Updated Okyo" } }, headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["name"]).to eq("Updated Okyo")
      end
    end

    context "with invalid attributes" do
      it "does not update the okyo" do
        patch api_v1_current_okyo_path(okyo), params: { okyo: { name: "" } }, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"].any? { |e| e.include?("名前を入力してください") }).to be true
      end
    end
  end

  # DELETE /api/v1/current/okyo/:id
  describe "DELETE /destroy/:id" do
    it "deletes the requested okyo" do
      expect {
        delete api_v1_current_okyo_path(okyo), headers: headers
      }.to change(Okyo, :count).by(-1)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["message"]).to eq("Okyo deleted successfully")
    end

    it "returns error if okyo is not found" do
      delete api_v1_current_okyo_path(id: "nonexistent_id"), headers: headers
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("Okyo not found")
    end
  end
end
