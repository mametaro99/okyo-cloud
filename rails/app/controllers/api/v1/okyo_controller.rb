class Api::V1::OkyoController < ApplicationController
  def index
    @okyos = Okyo.all
    render json: @okyos, each_serializer: OkyoSerializer, status: :ok
  end

  def show
    @okyo = Okyo.find(params[:id])
    render json: @okyo, serializer: OkyoSerializer, status: :ok
  end
end
