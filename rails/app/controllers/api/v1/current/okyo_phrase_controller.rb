class Api::V1::Current::OkyoPhraseController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_okyo, only: [:create, :update, :destroy, :sort_by]
  before_action :set_okyo_phrase, only: [:update, :destroy, :sort_by]

  # POST /api/v1/current/okyo/:okyo_id/okyo_phrases
  def create
    @okyo_phrase = @okyo.okyo_phrases.build(okyo_phrase_params)
    if @okyo_phrase.save
      render json: @okyo_phrase, status: :created
    else
      render json: { errors: @okyo_phrase.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/current/okyo/:okyo_id/okyo_phrases/:id
  def update
    if @okyo_phrase.update(okyo_phrase_params)
      render json: @okyo_phrase, status: :ok
    else
      render json: { errors: @okyo_phrase.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/current/okyo/:okyo_id/okyo_phrases/:id
  def destroy
    if @okyo_phrase.destroy
      render json: { message: 'Phrase deleted successfully' }, status: :ok
    else
      render json: { errors: @okyo_phrase.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/current/okyo/:okyo_id/okyo_phrases/sort_by
  def sort_by
    before_order = params[:before_order].to_i
    after_order = params[:after_order].to_i
    
    # 引数が無効な場合、エラーを返す
    if before_order == after_order || before_order <= 0 || after_order <= 0
      return render json: { message: "Invalid order parameters" }, status: :unprocessable_entity
    end

    # before_order と after_order が範囲外である場合
    if OkyoPhrase.where(order: before_order).empty? || OkyoPhrase.where(order: after_order).empty?
      return render json: { message: "Order range is out of bounds" }, status: :unprocessable_entity
    end
    
    # 変更対象のレコードを一時的にorderを0に変更 (unique制約を回避)
    OkyoPhrase.where(order: before_order).update_all(order: 0)
  
    # before_order が大きい場合
    if before_order > after_order
      OkyoPhrase.where(order: (before_order - 1)..after_order)
                .update_all("`order` = `order` + 1")
      
    # before_order が小さい場合
    else
      OkyoPhrase.where(order: (before_order + 1)..after_order)
                .update_all("`order` = `order` - 1")
    end
  
    # 最後に元の位置のレコードのorderを正しい値に設定
    OkyoPhrase.where(order: 0).update_all(order: after_order)
  
    render json: { message: "Phrases reordered successfully" }, status: :ok
  end
  
  

  private

  # Sets @okyo based on the provided okyo_id
  def set_okyo
    @okyo = Okyo.includes(:okyo_phrases).find(params[:okyo_id])
  end

  # Sets @okyo_phrase based on the provided id
  def set_okyo_phrase
    @okyo_phrase = OkyoPhrase.find_by(id: params[:id])
    render json: { error: 'OkyoPhrase not found' }, status: :not_found unless @okyo_phrase
  end
  

  # Strong parameters for OkyoPhrase
  def okyo_phrase_params
    params.require(:okyo_phrase).permit(:phrase_text, :meaning, :reading, :video_start_time, :video_end_time, :order)
  end
end
