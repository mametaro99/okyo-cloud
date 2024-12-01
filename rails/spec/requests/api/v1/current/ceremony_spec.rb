require 'rails_helper'

RSpec.describe "Api::V1::Current::Ceremonies", type: :request do
  let(:user) { create(:user) }
  let!(:auth_headers) { user.create_new_auth_token } # Devise Token Auth を使用して認証ヘッダーを作成
  let(:valid_attributes) do
    {
      name: "Ceremony Name",
      event_date: "2024-12-31",
      location: "Ceremony Location",
      description: "Ceremony Description",
      ceremony_okyo_groups_attributes: [
        { "id": nil, "okyo_id": 1, "order": 1 }
      ]
    }
  end

  let(:invalid_attributes) do
    {
      name: nil,  # invalid name
      event_date: "2024-12-31",
      location: "Ceremony Location",
      description: "Ceremony Description",
      ceremony_okyo_groups_attributes: [
        { id: nil,okyo_id: nil, order: nil } # invalid okyo group
      ]
    }
  end

  # Set up the initial data for the tests
  before do
    # No need to modify request headers here anymore
  end

  describe "GET /api/v1/current/ceremony" do
    it "returns a list of ceremonies for the authenticated user" do
      create(:ceremony, user: user)
      get api_v1_current_ceremony_index_path, headers: auth_headers # Pass headers in the request
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(1) # Adjust based on actual data setup
    end

    it "returns an empty list if the user has no ceremonies" do
      get api_v1_current_ceremony_index_path, headers: auth_headers # Pass headers in the request
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to be_empty
    end
  end

  describe "GET /api/v1/current/ceremony/:id" do
    let(:ceremony) { create(:ceremony, user: user) }

    it "returns the specified ceremony" do
      get api_v1_current_ceremony_path(ceremony), headers: auth_headers # Pass headers in the request
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq(ceremony.name)
    end

    it "returns a 404 if the ceremony does not exist" do
      get api_v1_current_ceremony_path(id: "nonexistent"), headers: auth_headers # Pass headers in the request
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("Ceremony not found")
    end
  end

  describe "POST /api/v1/current/ceremony" do
    # 一次的に保留
    # context "with valid parameters" do
    #   it "creates a new ceremony and returns it" do
    #     expect {
    #       post api_v1_current_ceremony_index_path, params: { ceremony: valid_attributes }, headers: auth_headers # Pass headers in the request
    #     }.to change(Ceremony, :count).by(1)
    #     expect(response).to have_http_status(:created)
    #     expect(JSON.parse(response.body)["name"]).to eq(valid_attributes[:name])
    #   end
    # end

    context "with invalid parameters" do
      it "does not create a new ceremony and returns errors" do
        expect {
          post api_v1_current_ceremony_index_path, params: { ceremony: invalid_attributes }, headers: auth_headers # Pass headers in the request
        }.to_not change(Ceremony, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Name を入力してください")
      end
    end
  end

  describe "DELETE /api/v1/current/ceremony/:id" do
    let(:ceremony) { create(:ceremony, user: user) }
    #
    # it "deletes the specified ceremony" do
    #   expect {
    #     delete api_v1_current_ceremony_path(ceremony), headers: auth_headers # Pass headers in the request
    #   }.to change(Ceremony, :count).by(-1)
    #   expect(response).to have_http_status(:no_content)
    # end

    it "returns a 404 if the ceremony does not exist" do
      delete api_v1_current_ceremony_path(id: "nonexistent"), headers: auth_headers # Pass headers in the request
      expect(response).to have_http_status(:not_found)
    end
  end
end
