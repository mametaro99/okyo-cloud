class Api::V1::Current::OkyoController < Api::V1::BaseController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_okyo, only: [:show, :destroy, :update]

  def index
    @okyos = Okyo.all
    render json: @okyos, each_serializer: OkyoSerializer, status: :ok
  end

  def create
    @okyo = Okyo.new(okyo_params)
    if @okyo.save
      render json: @okyo, status: :created
    else
      render json: { errors: @okyo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: @okyo, serializer: OkyoSerializer ,status: :ok
  end

  def update
    if @okyo.update(okyo_params.except(:sect_ids))
      render json: @okyo, status: :ok
    else
      render json: { errors: @okyo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @okyo.destroy
      render json: { message: 'Okyo deleted successfully' }, status: :ok
    else
      render json: { errors: 'Failed to delete Okyo' }, status: :unprocessable_entity
    end
  end

  private

  def set_okyo
    @okyo = Okyo.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Okyo not found' }, status: :not_found
  end

  def okyo_params
    params.require(:okyo).permit(:name, :description, :article_url, :published, :video, sect_ids: [])
  end
end
