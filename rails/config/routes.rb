Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for 'User', at: 'auth'
      
      resources :okyo, only: [:index, :show]
      
      namespace :current do
        resources :okyo, only: [:index, :show, :create, :update, :destroy] do
          resources :okyo_phrase, only: [:create, :update, :destroy] do
            patch "sort_by", on: :member
          end
        end
        resources :ceremony, only: [:index, :show, :create, :update, :destroy] do
          resources :ceremony_okyo_group, only: [:index, :show, :create, :update, :destroy]
        end
        resources :user, only: [:show]
      end
    end
  end
end
