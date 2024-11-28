class Api::V1::Current::CeremonyController < Api::V1::BaseController
  before_action :authenticate_user!, only: [:index, :create, :update, :destroy]
  before_action :set_ceremony, only: [:show, :update, :destroy]

  # GET /api/v1/current/ceremonies
  def index
    @ceremonies = current_user.ceremonies
    render json: @ceremonies, status: :ok
  end

  # GET /api/v1/current/ceremonies/:id
  def show
    render json: @ceremony, status: :ok
  end

  # POST /api/v1/current/ceremonies
  def create
    @ceremony = Ceremony.new(ceremony_params)
    @ceremony.user = current_user

    if @ceremony.save
      render json: @ceremony, status: :created
    else
      render json: { errors: @ceremony.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/current/ceremonies/:id
  def update
    if @ceremony.update(ceremony_params)
      render json: @ceremony, status: :ok
    else
      render json: { errors: @ceremony.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/current/ceremonies/:id
  def destroy
    @ceremony.destroy
    head :no_content
  end

  private

  # Sets @ceremony based on the provided id
  def set_ceremony
    @ceremony = Ceremony.find_by(id: params[:id])
    render json: { error: 'Ceremony not found' }, status: :not_found unless @ceremony
  end

  # Strong parameters for Ceremony
  def ceremony_params
    params.require(:ceremony).permit(
      :name, :event_date, :location, :description,
      ceremony_okyo_groups_attributes: [:id, :okyo_id, :order, :_destroy]
    )
  end  
end
