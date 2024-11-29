require 'rails_helper'

RSpec.describe "Api::V1::Current::CeremonyOkyoGroups", type: :request do
  let(:ceremony) { create(:ceremony) }
  let(:okyo) { create(:okyo) }
  let(:ceremony_okyo_group) { create(:ceremony_okyo_group, ceremony: ceremony, okyo: okyo) }
  let(:valid_attributes) { { order: 1 } }
  let(:valid_new_attributes) { { order: 2 } }
  let(:invalid_attributes) { { order: nil } }

  let(:ceremony) { create(:ceremony) }
  let(:okyo) { create(:okyo) }
  let!(:ceremony_okyo_group) { create(:ceremony_okyo_group, ceremony: ceremony, okyo: okyo) }
  let(:valid_attributes) { { order: 1 } }
  let(:valid_new_attributes) { { order: 2 } }
  let(:invalid_attributes) { { order: nil } }

  # describe "GET /index" do
  #   it "returns a list of ceremony_okyo_groups" do
  #     create_list(:ceremony_okyo_group, 3, ceremony: ceremony, okyo: okyo) do |group, i|
  #       group.update(order: i + 1)
  #     end
  #     get api_v1_current_ceremony_ceremony_okyo_group_index_path(ceremony_id: ceremony.id)
  #     expect(response).to have_http_status(:ok)
  #     expect(JSON.parse(response.body).size).to eq(4) # ceremony_okyo_group + 3
  #   end
  # end

  describe "GET /show" do
    # it "returns a specific ceremony_okyo_group" do
    #   get api_v1_current_ceremony_ceremony_okyo_group_path(ceremony_id: ceremony.id, id: ceremony_okyo_group.id)
    #   expect(response).to have_http_status(:ok)
    #   expect(JSON.parse(response.body)["id"]).to eq(ceremony_okyo_group.id)
    # end

    # it "returns not found for an invalid id" do
    #   get api_v1_current_ceremony_ceremony_okyo_group_path(ceremony_id: ceremony.id, id: 0)
    #   expect(response).to have_http_status(:not_found)
    # end
  end

  describe "POST /create" do
    context "with valid attributes" do
      it "creates a new ceremony_okyo_group" do
        expect {
          post api_v1_current_ceremony_ceremony_okyo_group_index_path(ceremony_id: ceremony.id, okyo_id: okyo.id),
               params: { ceremony_okyo_group: valid_new_attributes }
        }.to change(CeremonyOkyoGroup, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid attributes" do
      it "does not create a new ceremony_okyo_group" do
        expect {
          post api_v1_current_ceremony_ceremony_okyo_group_index_path(ceremony_id: ceremony.id, okyo_id: okyo.id),
               params: { ceremony_okyo_group: invalid_attributes }
        }.not_to change(CeremonyOkyoGroup, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH/PUT /update" do
    context "with valid attributes" do
      it "updates the requested ceremony_okyo_group" do
        patch api_v1_current_ceremony_ceremony_okyo_group_path(ceremony_id: ceremony.id, okyo_id: okyo.id, id: ceremony_okyo_group.id),
              params: { ceremony_okyo_group: { order: 2 } }
        expect(response).to have_http_status(:ok)
        expect(ceremony_okyo_group.reload.order).to eq(2)
      end
    end

    context "with invalid attributes" do
      it "does not update the ceremony_okyo_group" do
        patch api_v1_current_ceremony_ceremony_okyo_group_path(ceremony_id: ceremony.id, okyo_id: okyo.id, id: ceremony_okyo_group.id),
              params: { ceremony_okyo_group: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  # describe "DELETE /destroy" do
  #   it "deletes the requested ceremony_okyo_group" do
  #     ceremony_okyo_group # Ensure it exists before testing deletion
  #     expect {
  #       delete api_v1_current_ceremony_ceremony_okyo_group_path(ceremony_id: ceremony.id, id: ceremony_okyo_group.id)
  #     }.to change(CeremonyOkyoGroup, :count).by(-1)
  #     expect(response).to have_http_status(:no_content)
  #   end
  # end
end
