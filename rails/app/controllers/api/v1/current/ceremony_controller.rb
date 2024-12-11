class Api::V1::Current::CeremonyController < Api::V1::BaseController
  before_action :authenticate_user!, only: [:index, :create, :destroy, :update]
  before_action :set_ceremony, only: [:show, :destroy, :update]
  

  # GET /api/v1/current/ceremony
  def index
    @ceremonies = current_user.ceremonies
    render json: @ceremonies, status: :ok
  end

  # GET /api/v1/current/ceremony/:id
  def show
    render json: @ceremony, include: ['ceremony_okyo_groups.okyo', 'ceremony_okyo_groups.okyo.okyo_phrases'], status: :ok
  end

  # POST /api/v1/current/ceremonies
  def create
    ActiveRecord::Base.transaction do
      @ceremony = Ceremony.new(ceremony_params.except(:ceremony_okyo_groups_attributes))
      @ceremony.user = current_user

      if @ceremony.save
        # CeremonyOkyoGroupsを作成
        handle_ceremony_okyo_groups(@ceremony)
        render json: @ceremony, status: :created
      else
        render json: { errors: @ceremony.errors.full_messages }, status: :unprocessable_entity
      end
    end
  rescue => e
    Rails.logger.error("Ceremony creation failed: #{e.message}")
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    ActiveRecord::Base.transaction do
      if @ceremony.update(ceremony_params.except(:ceremony_okyo_groups_attributes))
        # CeremonyOkyoGroupsを更新
        handle_ceremony_okyo_groups(@ceremony)
        render json: @ceremony, status: :ok
      else
        render json: { errors: @ceremony.errors.full_messages }, status: :unprocessable_entity
      end
    end
  rescue => e
    Rails.logger.error("Ceremony update failed: #{e.message}")
    render json: { error: e.message }, status: :unprocessable_entity
  end


  # DELETE /api/v1/current/ceremonies/:id
  def destroy
    @ceremony.destroy
    head :no_content
  end

  private

  # CeremonyOkyoGroupの新規作成と更新を処理
  def handle_ceremony_okyo_groups(ceremony)
    attributes = ceremony_params[:ceremony_okyo_groups_attributes]
    return if attributes.blank?

    Rails.logger.info("attributes: #{attributes}")

    attributes.each do |group_params|
      if group_params[:id].to_i.positive?
        # 正当なIDの場合は既存レコードの更新を試みる
        group = CeremonyOkyoGroup.find_by(id: group_params[:id])
        if group
          group.update!(group_params.except(:id))
        else
          raise ActiveRecord::RecordNotFound, "Couldn't find CeremonyOkyoGroup with ID=#{group_params[:id]}"
        end
      else
        # IDがnilまたは負の値の場合は新規作成
        ceremony.ceremony_okyo_groups.create!(group_params.except(:id))
      end
    end
  end


  # Sets @ceremony based on the provided id
  def set_ceremony
    @ceremony = Ceremony.find_by(id: params[:id])
    render json: { error: 'Ceremony not found' }, status: :not_found unless @ceremony
  end

  # Strong parameters for Ceremony
  def ceremony_params
    params.require(:ceremony).permit(
      :name, :event_date, :location, :description,
      ceremony_okyo_groups_attributes: [:id, :okyo_id, :order]
    )
  end
end
