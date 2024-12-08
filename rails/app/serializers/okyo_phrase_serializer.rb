class OkyoPhraseSerializer < ActiveModel::Serializer
  attributes :id, :okyo_id, :phrase_text, :meaning, :reading, :video_start_time, :video_end_time, :order
end