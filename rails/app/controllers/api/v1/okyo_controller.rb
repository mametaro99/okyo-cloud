class Api::V1::OkyoController < ApplicationController
  def index
    @okyos = Okyo.includes(:sects).includes(:okyo_phrases)
    @published_okyos = @okyos.select { |okyo| okyo.published }
    render json: @published_okyos, each_serializer: OkyoSerializer, status: :ok
  end

  def show
    @okyo = Okyo.find(params[:id])
    render json: @okyo, serializer: OkyoSerializer, status: :ok
  end
end
