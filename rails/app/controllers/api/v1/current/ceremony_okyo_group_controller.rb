class Api::V1::Current::CeremonyOkyoGroupController < Api::V1::BaseController
  before_action :set_ceremony
  before_action :set_okyo, only: [:create, :update]
  before_action :set_ceremony_okyo_group, only: [:show, :update, :destroy]

  # GET /api/v1/current/ceremonies/:ceremony_id/ceremony_okyo_groups
  def index
    ceremony_okyo_groups = @ceremony.ceremony_okyo_groups
    render json: ceremony_okyo_groups, status: :ok
  end

  # GET /api/v1/current/ceremony/:ceremony_id/ceremony_okyo_groups/:id
  def show
    render json: @ceremony_okyo_group, status: :ok
  end

  # POST /api/v1/current/ceremony/:ceremony_id/okyos/:okyo_id/ceremony_okyo_groups
  def create
    ceremony_okyo_group = @ceremony.ceremony_okyo_groups.new(ceremony_okyo_group_params)
    ceremony_okyo_group.okyo = @okyo

    if ceremony_okyo_group.save
      render json: ceremony_okyo_group, status: :created
    else
      render json: { errors: ceremony_okyo_group.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/current/ceremony/:ceremony_id/okyos/:okyo_id/ceremony_okyo_groups/:id
  def update
    ceremony_okyo_group = CeremonyOkyoGroup.find(params[:id])
    if ceremony_okyo_group.update(ceremony_okyo_group_params)
      render json: ceremony_okyo_group, status: :ok
    else
      render json: ceremony_okyo_group.errors, status: :unprocessable_entity
    end
  end

  def destroy
    ceremony_okyo_group = CeremonyOkyoGroup.find(params[:id])
    ceremony_okyo_group.destroy
    head :no_content
  end

  private

  def set_ceremony
    @ceremony = Ceremony.find(params[:ceremony_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Ceremony not found' }, status: :not_found
  end

  def set_okyo
    @okyo = Okyo.find(params[:okyo_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Okyo not found' }, status: :not_found
  end

  def set_ceremony_okyo_group
    @ceremony_okyo_group = @ceremony.ceremony_okyo_groups.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'CeremonyOkyoGroup not found' }, status: :not_found
  end

  def ceremony_okyo_group_params
    params.require(:ceremony_okyo_group).permit(:order)
  end
end
