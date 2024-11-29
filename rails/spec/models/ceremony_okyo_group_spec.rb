require 'rails_helper'

RSpec.describe CeremonyOkyoGroup, type: :model do
  let(:ceremony) { create(:ceremony) }
  let!(:existing_group) { create(:ceremony_okyo_group, ceremony: ceremony, order: 1) }

  it "is invalid if the same order is used for the same ceremony" do
    new_group = CeremonyOkyoGroup.new(ceremony: ceremony, okyo: create(:okyo), order: 1)
    expect(new_group).to_not be_valid
    expect(new_group.errors[:order]).to include("is already taken for this ceremony")
  end
end