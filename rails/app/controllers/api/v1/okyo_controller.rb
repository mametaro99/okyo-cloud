class Api::V1::OkyoController < ApplicationController
  def index
    @published_okyos = cache_published_okyos
    render json: @published_okyos, each_serializer: OkyoSerializer, status: :ok
  end

  def show
    @okyo = Okyo.find(params[:id])
    render json: @okyo, serializer: ShowOkyoSerializer, status: :ok
  end

  private

    def cache_published_okyos
      Rails.cache.fetch("okyos", expires_in: 1.hour) do
        Okyo.includes(:sects).select { |okyo| okyo.published }.to_a
      end
    end
end
