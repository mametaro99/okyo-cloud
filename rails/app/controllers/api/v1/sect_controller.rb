class Api::V1::SectController < ApplicationController
  def index
    @sects = Sect.all
    render json: @sects, each_serializer: SectSerializer, status: :ok
  end
end
