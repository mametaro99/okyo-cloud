class Api::V1::OkyoController < ApplicationController
  def index
    @okyos = Okyo.all
    render json: @okyos
  end

  def show
    @okyo = Okyo.find(params[:id])
    @okyo_phrases = @okyo.okyo_phrases
    render json: { okyo: @okyo, okyo_phrases: @okyo_phrases } 
  end
end
